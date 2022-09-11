import React, { useEffect, useRef, createContext} from 'react';

import './style.css';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, get, onValue, off} from "firebase/database";

import Top from "./components/Top/Top";
//import Buttons2 from "./components/Buttons/Buttons";

const firebaseConfig = {
  databaseURL: "https://savesign-f7de7-default-rtdb.europe-west1.firebasedatabase.app/",
};

initializeApp(firebaseConfig);

const Buttons = ({id, action, type = 'button', val, out=''}) => (
        <>
            <td><button className='buttons' id={id} onClick={action} type={type} value={val}>{out}</button></td>
        </>
    )

const Output = ({output, colour}) => {

    return(
        <>
            <p id="Output"  className="output" style={{color: colour}}>{output}</p>
        </>
)}

const Store = ({type = 'submit', action}) => (
        <>
            <button type={type} onClick={action}>Save</button>
        </>
    )

const Reset = ({type = 'submit', action}) => {

    return (
        <>
            <button type={type} onClick={action}>Reset</button>
        </>
    )
}

const Dropdown = ({ options, action}) => {
 
    return(
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
}

const NewName = ({action, holder}) => {
    return (
        <>
            <label htmlFor="newName"/>
            <input id="newName" type="text" onKeyPress={action} placeholder='Wpisz nazwę' defaultValue={holder} onClick={() =>(document.getElementById('newName').value === localStorage.getItem('last-user') ? document.getElementById('newName').value ='': null)} />
        </>
    )
}

const Canvas = ({mdown, draw, mout, mup}) => {


    return (
        <>
            <canvas id="canvas" className="center" onMouseDown={mdown} onMouseMove={draw} onMouseOut={mout} onMouseUp={mup}></canvas>
        </>
    )
}


let canvas = {}
if (document.querySelector("#canvas") !== undefined){
    canvas = document.querySelector("#canvas")
}
let ctx = {}
if (canvas !== null){
    console.log(canvas)
    console.log('brazil?')
     ctx = canvas.getContext('2d')}


const App = () => {
    let options = ''
    const [base, setBase] = React.useState()
    const [sign, setSign] = React.useState()
    const [color, setColor] = React.useState()
    const [user, setUser] = React.useState(localStorage.getItem('last-user')||'')

    const database = getDatabase();

    const loadBase = () =>{
        get(ref(database)).then((snapshot) => {
            setBase(Object.getOwnPropertyNames(snapshot.val())) 
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
                    [value]: { color: '',
                    sign: ''
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
/*
    const canvasRef = useRef(null)
    const ctxRef = useRef(null)
    const [isDrawing, setIsDrawing] = React.useState(false)

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 100;
        canvas.height = 100;

        ctx = canvas.getContext('2d')
        ctx.strokeStyle = '#000000';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 10;
        ctx.globalCompositeOperation = 'multiply';

        ctx.current = ctx
    }, [])

    const start = ({nativeEvent})  => {
        const {offsetX, offSetY} = nativeEvent
        ctxRef.current.beginPath()
        ctxRef.current.moveTo(offsetX, offSetY)
        setIsDrawing(true)
    }

    const finish = () => {
        ctxRef.current.closePath()
        setIsDrawing(false)
    }

    const draw = ({nativeEvent}) => {
        if(!isDrawing){
            return
        }
        const {offsetX, offsetY} = nativeEvent
        ctxRef.current.lineTo(offsetX, offsetY)
        ctxRef.current.stroke()
    }
    */
    
    const canvas = useRef(null);

    useEffect(() => {
        canvas.current = document.querySelector("#canvas")
    }, [document.querySelector("#canvas")])
    console.log(canvas.current)
    
    //let canvas = {}
  //  let canvas = createContext()
  //  if (document.querySelector("#canvas") !== undefined){
  //      canvas = document.querySelector("#canvas")
  //  }

    let ctx = useRef();

    useEffect(() =>{
        if(canvas !== undefined){
            ctx = canvas.current.getContext('2d')
            canvas.current.width = 500;
            canvas.current.height = 500;
           // ctx.current.strokeStyle = '#000000';
            //ctx.current.lineJoin = 'round';
            //ctx.current.lineCap = 'round';
            //ctx.current.lineWidth = 10;
            //ctx.current.globalCompositeOperation = 'multiply';
        }

    },[] )

    //console.log(ctx)

    //console.log(ctx.beginPath)

    console.log(ctx)
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const mdown = (event) => {
        isDrawing = true;
        [lastX, lastY] = [event.pageX, event.pageY]; 
    };
   // let ctx = {}
    if (canvas !== null){
        console.log(canvas)
        console.log('brazil')
         //ctx = canvas.getContext('2d')
         canvas.width = 500;
         canvas.height = 500;
         ctx.strokeStyle = '#000000';
         ctx.lineJoin = 'round';
         ctx.lineCap = 'round';
         ctx.lineWidth = 10;
         ctx.globalCompositeOperation = 'multiply';
         console.log(ctx)
            }
    console.log(canvas)
    console.log(ctx)
    
    const draw = (event) => {
        
   
  
        //console.log('im under the water')
        if (!isDrawing) return; 
        
        console.log(canvas)
        ctx = canvas.current.getContext('2d')
        canvas.width = 500;
        canvas.height = 500;
        ctx.strokeStyle = '#000000';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 10;
        ctx.globalCompositeOperation = 'multiply';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(event.pageX, event.pageY-800);
        ctx.stroke();
        console.log(ctx);
        [lastX, lastY] = [event.pageX, event.pageY-800]; 
        console.log(lastY)
        console.log(lastX)
        
    }
const mup = () => {
    
    console.log(ctx)
    console.log(canvas)

    isDrawing = false;
}

const mout = () => {
    isDrawing = false;
    console.log(isDrawing)
}

    

    return (
        <>  
            <Top />
            <table className="center">
                <tbody>
                    <tr>
                        <Buttons id="sign1" action={handleClick} val="♠" out="♠"/>
                        <Buttons id="sign2" action={handleClick} val="✰" out="✰"/>
                        <Buttons id="sign3" action={handleClick} val="( ͡° ͜ʖ ͡°)" out="( ͡° ͜ʖ ͡°)"/>
                        <Buttons id="sign4" action={handleClick} val="☢" out="☢" />
                        <Buttons id="sign5" action={handleClick} val="κ" out="κ"/>
                        <Buttons id="sign6" action={handleClick} val="✾" out="✾"/>
                    </tr>
                    
                    <tr>
                        <Buttons id="color1" action={handleColor} val="red" />
                        <Buttons id="color2" action={handleColor} val="green" />
                        <Buttons id="color3" action={handleColor} val="blue" />
                        <Buttons id="color4" action={handleColor} val="magenta" />
                        <Buttons id="color5" action={handleColor} val="white" />
                        <Buttons id="color6" action={handleColor} val="yellow" />
                    </tr>
                </tbody>
            </table>
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
           <Canvas mdown={mdown} mup={mup} mout={mout} draw={draw} />
        </>
    )
}

export default App;