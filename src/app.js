import React, { useEffect, useRef, createContext} from 'react';
import { CirclePicker } from 'react-color'

import './style.css';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, get, onValue, off, set, getReference} from "firebase/database";

import Top from "./components/Top/Top";
import {Buttons, Buttons2, Buttons3} from "./components/Buttons/Buttons";
import { setOriginalNode } from 'typescript';

const firebaseConfig = {
  databaseURL: "https://savesign-f7de7-default-rtdb.europe-west1.firebasedatabase.app/",
};

initializeApp(firebaseConfig);

const Output = ({output, colour}) => (
        <>
            <p id="Output"  className="output" style={{color: colour}}>{output}</p>
        </>
)

const Store = ({type = 'submit', action}) => (
        <>
            <button type={type} onClick={action}>Save</button>
        </>
    )

const Reset = ({type = 'submit', action}) => (
        <>
            <button type={type} onClick={action}>Reset</button>
        </>
    )

const Dropdown = ({ options, action}) => (
        <>
        <label htmlFor='dropdown'/>
            <select id='dropdown' name='dropdown' title="stupid nigger" value='xxx' onChange={action}>
                <option defaultValue='' hidden >Wybierz nazwę</option>
                {options.map((option) =>(
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </>
    )


const NewName = ({action, holder}) => (
        <>
            <label htmlFor="newName"/>
            <input id="newName" type="text" onKeyPress={action} placeholder='Wpisz nazwę' defaultValue={holder} onClick={() =>(document.getElementById('newName').value === localStorage.getItem('last-user') ? document.getElementById('newName').value ='': null)} />
        </>
    )

const Canvas = ({mdown, draw, mout, mup}) => (
        <>
            <canvas id="canvas" onMouseDown={mdown} onMouseMove={draw} onMouseOut={mout} onMouseUp={mup}></canvas>
        </>
    )

const App = () => {
    let options = ''
    const [base, setBase] = React.useState()
    const [sign, setSign] = React.useState()
    const [color, setColor] = React.useState()
    const [user, setUser] = React.useState(localStorage.getItem('last-user')||'')
    const [thicc, setThicc] = React.useState()
    const [stamp, setStamp] = React.useState(false)
    const [lines, setLine] = React.useState(false)
    const [confirm, setConfirm] = React.useState(false)
    const [rectangles, setRectangle] = React.useState(false)
    const [circl, setCircl] = React.useState(false)
    const [filling, setFilling] = React.useState(false)
    const [figureX, setFigureX] = React.useState(0)
    const [figureY, setFigureY] = React.useState(0)

    const database = getDatabase();

    const loadBase = () =>{
        get(ref(database)).then((snapshot) => {
            snapshot.val() !== null ?
            setBase(Object.getOwnPropertyNames(snapshot.val())) : setBase(null)
    })
    }

    useEffect(() => {loadBase()},[])
        
    if (Object(base) !== undefined){options = Object.values(Object(base))}

    React.useEffect(() =>{
        localStorage.setItem('last-user', user)
    }, [user])
    
    const handleClick = (event) => {
        setSign(event.target.value);
    }
    const handleColor = (event) => {
            setColor(event.target.value)
    }

    const figure = {
        sign,
        color
    }

    const handleSave = () => {
        if (figure.color !== undefined && figure.sign !== undefined && user !== ''){
            update(ref(database, user), {
            color: figure.color,
            sign: figure.sign
            })}
            if (user === ''){
            alert("Najpierw wprowadź nazwę i wciśnij enter lub wybierz nazwę z listy")
            }
    }

    const handleReset = () => {
        update(ref(database, user), {
            color: '',
            sign: ''
        })
    }

    const handleNewName = (event) => {
        const value = document.getElementById('newName').value
            if (value !== '' && event.key === 'Enter'){
                setUser(value)
                update(ref(database),{
                    [value]: { 
                    color: '',
                    sign: '',
                    images: {
                        image1: ''
                        }         
                    }
                })
                document.getElementById('newName').value = ''
            }loadBase()  
        }   

    const handleChange = (event) => {
        document.getElementById('newName').value = event.target.value
        setUser(event.target.value)     
        onValue(ref(database, event.target.value), (snapshot) => {
        localStorage.setItem('sign', snapshot.val().sign)
        localStorage.setItem('sign-color', snapshot.val().color)
        setSign(snapshot.val().sign)
        setColor(snapshot.val().color)
    })  
        loadBase()       
    }
        
    const canvas = React.useRef(null);
    const ctx = React.useRef();

    useEffect(() => {
        canvas.current = document.querySelector("#canvas")
        ctx.current = canvas.current.getContext('2d')
        canvas.current.width = window.innerWidth ;
        canvas.current.height = 1000;
        canvas.current.style.width = "100%";
        canvas.current.style.height = "100%";
        ctx.current.strokeStyle = '#FFFFFF';
        ctx.current.lineJoin = 'round';
        ctx.current.lineCap = 'round';
        ctx.current.lineWidth = 10;
        ctx.current.miterLimit = 100;
        //ctx.current.globalCompositeOperation = 'destination-under'
        ctx.current.fillStyle = 'black'
        ctx.current.fillRect(0, 0, canvas.current.width, canvas.current.height)
    }, [document.querySelector("#canvas")])

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const fill = () => {
        setFilling(!filling)
    }

    const draw = (event) => {       
        if (!isDrawing) return; 
        if (!stamp && !lines && !rectangles){
            ctx.current.beginPath();
            ctx.current.moveTo(lastX, lastY);
            ctx.current.lineTo(event.pageX-canvas.current.offsetLeft, event.pageY-canvas.current.offsetTop);
            //ctx.current.globalCompositeOperation = 'source-over'
            ctx.current.stroke();       
            [lastX, lastY] = [event.pageX-canvas.current.offsetLeft, event.pageY-canvas.current.offsetTop]; 
            ctx.current.closePath()
        }

  
    }

    const mdown = (event) => {
        //let rectX, rectY = 0;
        if (stamp){
            ctx.current.font = '50px Arial'
            ctx.current.fillStyle = color? color: 'red';
            ctx.current.fillText(sign? sign: '♠', event.pageX-canvas.current.offsetLeft, event.pageY-canvas.current.offsetTop)
            //isDrawing = false;
        }
        if (lines && !confirm){
            console.log(ctx.current)
            ctx.current.beginPath()
            ctx.current.moveTo(event.pageX-canvas.current.offsetLeft, event.pageY-canvas.current.offsetTop)
            setConfirm(!confirm)
          }
        if (lines && confirm){
            ctx.current.lineTo(event.pageX-canvas.current.offsetLeft, event.pageY-canvas.current.offsetTop)
            ctx.current.stroke()
            setConfirm(!confirm)
            ctx.current.closePath()
        }
        if (rectangles && !confirm){
            ctx.current.beginPath()
            setFigureX(event.pageX-canvas.current.offsetLeft)
            setFigureY(event.pageY-canvas.current.offsetTop)
            setConfirm(!confirm)
        }
        if (rectangles && confirm){
            ctx.current.rect(figureX, figureY, event.pageX-canvas.current.offsetLeft-figureX, event.pageY-canvas.current.offsetTop-figureY)
            ctx.current.stroke()
            ctx.current.closePath()
            setConfirm(!confirm)
        }
        if (circl && !confirm){
            ctx.current.beginPath()
            setFigureX(event.pageX-canvas.current.offsetLeft)
            setFigureY(event.pageY-canvas.current.offsetTop)
            setConfirm(!confirm)
        }
        if (circl && confirm){
            let x = Math.pow(event.pageY-canvas.current.offsetTop-figureY,2) + Math.pow(event.pageX-canvas.current.offsetLeft-figureX,2)
            x = Math.sqrt(x)
            ctx.current.arc(figureX, figureY, x,0, 2*Math.PI )
            console.log(Math.sqrt(Math.pow(event.pageX-canvas.current.offsetLeft-figureX,2)+Math.pow(event.pageY-canvas.current.offsetTop-figureY,2)))
            console.log( event.pageY-canvas.current.offsetTop)
            console.log(figureY)
            console.log(event.pageY-canvas.current.offsetTop-figureY)
            console.log(Math.pow(event.pageY-canvas.current.offsetTop-figureY,2))
            
            console.log(Math.pow(event.pageX-canvas.current.offsetLeft-figureX,2))
            console.log(Math.sqrt(x))
            ctx.current.stroke();
            ctx.current.closePath();
            setConfirm(!confirm)
        }
        console.log('linesactive? ', lines, ' directionConfirmed? ', confirm)
        if (!lines && !rectangles){
            isDrawing = true;
            [lastX, lastY] = [event.pageX-canvas.current.offsetLeft, event.pageY-canvas.current.offsetTop]; 
        }
      
    };

    const mup = () => {
        ctx.current.closePath(); 
        isDrawing = false;
    }

    const mout = () => {
        ctx.current.closePath();
        isDrawing = false;
    }

    const collapse = () => {
        var content = document.getElementsByClassName("content");
        if (content[0].style.display === "block") {
            content[0].style.display = "none";
        } else {
            content[0].style.display = "block";
        }
    }

    const saveCanvas = () => {
        let canvasImage = document.getElementById('canvas').toDataURL('image/png');
        get(ref(database, user)).then((snapshot)=>{
            let name = ''
            if (snapshot.val().images.image1 === ''){
                name = "image1"
            }
            else{
                name = "image" +  (parseInt(Object.keys(snapshot.val().images).length) +1)
            } 
            update(ref(database, user + "/images"), {      
                    [name]: canvasImage    
                })
        })    
    }

    const clear = () => {
        ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height)
    }    

    const load = () => {
        ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height)
        
        onValue(ref(database, user), (snapshot) => {
        var drawing = new Image()
        drawing.src = snapshot.val().images.image1
        console.log('load')
        drawing.onload = () =>{
            ctx.current.drawImage(drawing, 0, 0, canvas.current.width, canvas.current.height)
        }
        }) 
    }

    const customColor = (event) => {
        ctx.current.strokeStyle = event.target.value
    }

    const nigger = (event) => {                     //co z tym zrobić?
        ctx.current.strokeStyle = event.hex;
    }
    const backgroundColor = (event) => {
        //ctx.current.globalCompositeOperation = 'copy'  //color
        ctx.current.fillStyle = event.target.value
        ctx.current.fillRect(0,0,canvas.current.width, canvas.current.height)
        document.getElementById("canvas").style.backgroundColor = event.target.value
        document.getElementById('eraser').style.backgroundColor = event.target.value
    }

    const eraser = () => {
        setLine(false)
        setCircl(false)
        setRectangle(false)
        setStamp(false)
        ctx.current.strokeStyle = document.getElementById("canvas").style.backgroundColor     
    }

    const slider = (event) =>{
        ctx.current.lineWidth = event.target.value
        setThicc(event.target.value)
    }
    const line = () => {
        setLine(!lines)
        setCircl(false)
        setRectangle(false)
        setStamp(false)
        if (confirm === true){
            setConfirm(false)
        }
    }

    const rect = () => {
        setRectangle(!rectangles)
        setCircl(false)
        setLine(false)
        setStamp(false)
        if (confirm === true){
            setConfirm(false)
        }
    }

    const circle = () => {
        setCircl(!circl)
        setRectangle(false)
        setLine(false)
        setStamp(false)
        if (confirm === true){
            setConfirm(false)
        }
    }

    const stample = () => {
        setStamp(!stamp)
        setRectangle(false)
        setLine(false)
        setCircl(false)
        if (confirm === true){
            setConfirm(false)
        }
    }

    return (
        <>  
            <Top />
            <button type="button" className="collapsible" onClick={collapse}>klik kurwa</button>
                <div className="content">
                    <table>
                        <tbody>
                            <tr>
                                <td><button type="submit" onClick={saveCanvas} >Save</button></td>
                                <td><CirclePicker id="picker" onChange={nigger}/></td>
                                <td><input type="color" onChange={customColor}></input></td>
                                <td><button type="clear" onClick={clear}>Clear</button></td>
                                <td><button type="submit" onClick={load}>Load Image</button></td>
                                <td><label htmlFor="background-picker">Kolor tła</label><input id="background-picker" type="color" onChange={backgroundColor}></input></td>
                                <td><button id="eraser" type="button" onClick={eraser}>Gumka</button></td>
                                <td><label htmlFor="slider">grubość: {thicc}</label></td>
                                <td><input type="range" min="2" max="40" defaultValue="10" id="slider" onChange={slider}></input> </td>
                                <td><button id="stample" onClick={stample}>pieczątka</button></td>
                                <td><button id="line" onClick={line}>Prosta linia</button></td>
                                <td><button id="rectangle" onClick={rect}>Kwadrat</button></td>
                                <td><button id="circle" onClick={circle}>Okręg</button></td>
                                <td><button id="fill" onClick={fill}>Rysuj wypełnioną figurę</button></td>
                            </tr>
                        </tbody>
                    </table>
                    <Canvas mdown={mdown} mup={mup} mout={mout} draw={draw} />
                </div>
            <Buttons3 actionClick={handleClick} actionColor={handleColor} out={["♠","✰","( ͡° ͜ʖ ͡°)","☢","κ","✾"]} val={["♠","✰","( ͡° ͜ʖ ͡°)","☢","κ","✾"]} colour={["red", "green", "blue", "magenta", "white", "yellow"]}/>
            <table className="center table_bottom" id="table_bottom">
                <tbody>
                    <tr>
                        <td className="outputCell"><Output output={sign} colour={color}/></td>
                        <td><Store action={handleSave}/></td>
                        <td><Reset action={handleReset}/></td>
                        <td><NewName action={handleNewName} holder={user}/></td>
                        <td><Dropdown options={options} action={handleChange}/></td>
                        <td><p>obecnie wybrany: {user}</p></td>
                    </tr>
                </tbody>
            </table>
            
        </>
    )
}

export default App;