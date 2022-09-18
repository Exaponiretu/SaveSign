import React, { useEffect} from 'react';
import { CirclePicker} from 'react-color'

import './style.css';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, get} from "firebase/database";

import {Buttons3} from "./components/Buttons/Buttons";

const firebaseConfig = {
  databaseURL: "https://savesign-f7de7-default-rtdb.europe-west1.firebasedatabase.app/",
};

initializeApp(firebaseConfig);

const Top = ({text,actionEn, actionPl}) =>(
    <>
        <h1 id='niggers'>{text.top1}</h1>
        <a id='pl2' className="enpl pl" onClick={actionPl}>pl</a>
        <p className="enpl pe">/ </p>
        <a id='en2' className="enpl en" onClick={actionEn}>en</a>         
    </>
)

const Output = ({output, colour}) => (
        <>
            <p id="Output"  className="output" style={{color: colour}}>{output}</p>
        </>
)

const Store = ({type = 'submit', action, text}) => (
        <>
            <button id="store" className="submit-user-buttons" type={type} onClick={action}>{text.save}</button>
        </>
    )

const Reset = ({type = 'submit', action, text}) => (
        <>
            <button className="submit-user-buttons" id="reset" type={type} title={text.resetTitle} onClick={action}>{text.reset}</button>
        </>
    )

const Dropdown = ({ options, action, text}) => (
        <>
        <label htmlFor='dropdown'/>
            <select id='dropdown' name='dropdown' title={text.chooseName2} value='xxx' onChange={action}>
                <option defaultValue='' hidden >{text.chooseName}</option>
                {options.map((option) =>(
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </>
    )

    const Popup = ({text, actionEn, actionPl, actionButton}) => (
        <div className='popup' id='popup'>
            <button id='popup-button' type='button' onClick={actionButton}></button>
            <p id='popup-text'>{text.popup}</p>
            <a id='en' onClick={actionEn}>en</a> / 
            <a id='pl' onClick={actionPl}>pl</a>
        </div>
    )

const LoadImg = ({images, action, text}) => {
    if(images!==undefined){     //zbedny ternary niżej
        return(
            <div className="scroll-container">      
                {images.length? images.map((image) => (
                <img key={"img"+1+images.indexOf(image)} className="scroll-image" id={`image${1 +parseInt(images.indexOf(image)) }`} src={image} alt={"image"+1+images.indexOf(image)} onClick={action}/>
                )) : <p className="scroll-image" id="empty">{text.noSaved}</p>
                }
            </div>
            )
        }
    }
    
const NewName = ({action, holder, text}) => (
        <>
            <label htmlFor="newName"/>
            <input id="newName" type="text" onKeyPress={action} placeholder={text.newName} defaultValue={holder} onClick={() =>(document.getElementById('newName').value === localStorage.getItem('last-user') ? document.getElementById('newName').value ='': null)} />
        </>
    )

const Canvas = ({mdown, draw, mout, mup}) => (
        <>
            <canvas id="canvas" onMouseDown={mdown} onMouseMove={draw} onMouseOut={mout} onMouseUp={mup}></canvas>
        </>
    )

const App = () => {
    const lang = {
        en: {
            popup: "What at first was meant to be a simple Firebase experiment ended up as something of a drawing app.\n"
            + "\nInput your name in the input field at the bottom right or choose an existing one. Save changes by pressing Enter or clicking the Save button.\n"
            + "You can store chosen sign and its color to the database, as well as custom paintings.\n" 
            + "To access drawing mode, click the top of the page.\n"
            + "Drawing can be stored by pressing Save at the bottom right of the page.\n" 
            + "Choose drawing to load by clicking on miniature on the right and press Load button.\n"
            + "To change \"Stamp\" return to the page with signs and colors by pressing top of the page again.\n"
            + "\n! WARNING !\n"
            + "Changing background color will remove existing drawing.\n"
            + "Database is public.",
            top1: "Choose symbol and color, draw images and save them. Enter new user if you want to.",
            top2: "Click here to switch between signs and image drawing.",
            sign: "Currently chosen: ",
            noSaved: "No saved images.",
            save: "Save",
            load: "Load",
            reset: "Reset",
            resetTitle: "Removes saved sign",
            custom: "Custom",
            clear: "Clear",
            background: "Background",
            eraser: "Eraser",
            brush: "Brush Size: ",
            filled: "Filled Figures",
            stamp: "Stamp",
            newName: "Input name:",
            chooseName: "Select user",
            chooseName2: "See what others saved"

        },

        pl: {
            popup: "Co początkowo miało być prostym eksperymentem z Firebase stopniowo rozrosło się w coś w rodzaju aplikacji do rysowania.\n"
            + "\nWprowadź swoją nazwę w polu w dolnym prawym rogu lub wybierz jedną z istniejących. Zapisz zmiany wciskając Enter lub klikacjąc na przycisk Save.\n"
            + "Możesz zapisać wybrany znak i kolor do bazy danych, jak i narysowane obrazki.\n"
            + "Kliknij górę strony, by przełączyć się w tryb rysowania.\n"
            + "Rysunki mogą być zapisane poprzez naciśnięcie Save w prawej dolnej części strony.\n"
            + "Wybierz, który obrazek chcesz wczytać klikając na jego miniature i wciskając przycisk Load.\n"
            + "By zmienić \"Pieczątkę\" wróć do poprzedniej strony z znakami i kolorami klikając ponownie górę strony.\n"
            + "\n! UWAGA !\n"
            + "Zmiana koloru tła usunie istniejący rysunek.\n"
            + "Baza danych jest publiczna.",
            top1: "Wybierz symbol i kolor, rysuj obrazki i zapisz je. Jeżeli chcesz, wprowadź nowego użytkownika.",
            top2: "Kliknij tutaj by zmienić pomiędzy znakami, a rysowaniem",
            sign: "Obecnie wybrany: ",
            noSaved: "Brak zapisanych rysunków.",
            save: "Zapisz",
            load: "Wczytaj",
            reset: "Reset",
            resetTitle: "Usuwa zapisany znak",
            custom: "Dowolny",
            clear: "Wyczyść",
            background: "Tło",
            eraser: "Gumka",
            brush: "Rozmiar Pędzla",
            filled: "Wypełnione figury",
            stamp: "Pieczątka",
            newName: "Wprowadź nazwę:",
            chooseName: "Wybierz użytkownika",
            chooseName2: "Zobacz co inni zapisali"
        }
    }

    let options = '';
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    const [base, setBase] = React.useState();
    const [sign, setSign] = React.useState();
    const [color, setColor] = React.useState();
    const [user, setUser] = React.useState(localStorage.getItem('last-user')||'');
    const [thicc, setThicc] = React.useState(10);
    const [stamp, setStamp] = React.useState(false);
    const [lines, setLine] = React.useState(false);
    const [confirm, setConfirm] = React.useState(false);
    const [rectangles, setRectangle] = React.useState(false);
    const [circl, setCircl] = React.useState(false);
    const [filling, setFilling] = React.useState(false);
    const [figureX, setFigureX] = React.useState(0);
    const [figureY, setFigureY] = React.useState(0);
    const [images, setImages] = React.useState();
    const [pick, setPick] = React.useState();
    const [loadNew, setloadNew] = React.useState(true);
    const [back, setBack] = React.useState('black');
    const [language, setlanguage] = React.useState('en');
    const [cPushArray, SetcPushArray] = React.useState([]);
    const [cStep, SetcStep] = React.useState(-1);
    const [size, setSize] = React.useState([0, 0]);
    const [text, setText] = React.useState(lang.en);

    const canvas = React.useRef(null);
    const ctx = React.useRef();

    const figure = {
        sign,
        color
    }
    
    const database = getDatabase();

    const loadBase = () =>{
        get(ref(database)).then((snapshot) => {
            snapshot.val() !== null ? setBase(Object.getOwnPropertyNames(snapshot.val())) : setBase(null)
        })
    }

    const loadImages = () => {
        console.log('we milking base2')
        get(ref(database, user + "/images")).then((snapshot) => {
            snapshot.val() ? setImages(Object.values(snapshot.val())) : setImages([])
        })
    }

    React.useEffect(() => {
            loadImages()
            loadBase()
    },[])
        
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

    const handleSave = () => {
        const value = document.getElementById('newName').value
        if (value !== ''){
            setUser(value)
            update(ref(database),{
                [value]: { 
                color: '',
                sign: '',
                images: {
                    
                    }         
                }
            })
            document.getElementById('newName').value = ''
        }loadBase()  
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
                    images: { }                                 
                    }
                })
                document.getElementById('newName').value = ''
            }loadBase()  
        }   

    const handleChange = (event) => {
        document.getElementById('newName').value = event.target.value
        setUser(event.target.value)     
        get(ref(database, event.target.value)).then ((snapshot) => {          //uwaga zmieniam z onvalue na get
        localStorage.setItem('sign', snapshot.val().sign)
        localStorage.setItem('sign-color', snapshot.val().color)
        setSign(snapshot.val().sign)
        setColor(snapshot.val().color)
    })  
        setloadNew(true)
        loadBase()
        loadImages()
    }
        
    React.useEffect(() => {
        canvas.current = document.querySelector("#canvas")
        ctx.current = canvas.current.getContext('2d')
        canvas.current.width = width-360;
        canvas.current.height = height-200;
        ctx.current.strokeStyle = '#FFFFFF';
        ctx.current.lineJoin = 'round';
        ctx.current.lineCap = 'round';
        ctx.current.lineWidth = 10;
        ctx.current.miterLimit = 100;
        ctx.current.fillStyle = 'black'
        canvas.current.style.backgroundcolor = 'black'
        ctx.current.fillRect(0, 0, canvas.current.width, canvas.current.height)
    }, [document.querySelector("#canvas")])

    const draw = (event) => {       
        if (!isDrawing) return; 
        if (!lines && !rectangles && !circl && !stamp){
            ctx.current.beginPath();
            ctx.current.moveTo(lastX, lastY);
            ctx.current.lineTo(event.pageX-canvas.current.offsetLeft, event.pageY-canvas.current.getBoundingClientRect().top);
            ctx.current.globalCompositeOperation = 'source-over'
            ctx.current.stroke();       
            [lastX, lastY] = [event.pageX-canvas.current.offsetLeft, event.pageY-canvas.current.getBoundingClientRect().top]; 
            ctx.current.closePath()
        }
    }

    const mdown = (event) => {
        if (stamp){
            ctx.current.font = '50px Arial'
            ctx.current.fillStyle = color? color: 'red';
            ctx.current.fillText(sign? sign: '♠', event.pageX-canvas.current.offsetLeft, event.pageY-canvas.current.getBoundingClientRect().top)
        }
        if (lines && !confirm){    
            ctx.current.beginPath()
            ctx.current.moveTo(event.pageX-canvas.current.offsetLeft, event.pageY-canvas.current.getBoundingClientRect().top)
            setConfirm(!confirm)
            document.getElementById("line").style.backgroundColor = "aqua"
          }
        if (lines && confirm){
            ctx.current.lineTo(event.pageX-canvas.current.offsetLeft, event.pageY-canvas.current.getBoundingClientRect().top)
            ctx.current.stroke()
            setConfirm(!confirm)
            ctx.current.closePath()
            document.getElementById("line").style.backgroundColor = "#00FF00"
        }
        if (rectangles && !confirm){
            ctx.current.beginPath()
            setFigureX(event.pageX-canvas.current.offsetLeft)
            setFigureY(event.pageY-canvas.current.getBoundingClientRect().top)
            setConfirm(!confirm)
            document.getElementById("rectangle").style.backgroundColor = "aqua"
        }
        if (rectangles && confirm){
            ctx.current.rect(figureX, figureY, event.pageX-canvas.current.offsetLeft-figureX, event.pageY-canvas.current.getBoundingClientRect().top-figureY)
            if (filling){
                ctx.current.fill()
            }
            ctx.current.stroke()
            ctx.current.closePath()
            setConfirm(!confirm)
            document.getElementById("rectangle").style.backgroundColor = "#00FF00"
        }
        if (circl && !confirm){
            ctx.current.beginPath()
            setFigureX(event.pageX-canvas.current.offsetLeft)
            setFigureY(event.pageY-canvas.current.getBoundingClientRect().top)
            setConfirm(!confirm)
            document.getElementById("circle").style.backgroundColor = "aqua"
        }
        if (circl && confirm){
            let x = Math.pow(event.pageY-canvas.current.getBoundingClientRect().top-figureY,2) + Math.pow(event.pageX-canvas.current.offsetLeft-figureX,2)
            x = Math.sqrt(x)
            ctx.current.arc(figureX, figureY, x,0, 2*Math.PI )
            if (filling){
                ctx.current.fill()
            }
            ctx.current.stroke();
            ctx.current.closePath();
            setConfirm(!confirm)
            document.getElementById("circle").style.backgroundColor = "#00FF00"
        }
        if (!lines && !rectangles && !circl && !stamp){
           
            isDrawing = true;
            [lastX, lastY] = [event.pageX-canvas.current.offsetLeft, event.pageY-canvas.current.getBoundingClientRect().top]; 
        }      
    };

    const mup = () => {
        if (!confirm){
            cPush()
        }
        ctx.current.closePath(); 
        isDrawing = false;
    }

    const mout = () => {
        ctx.current.closePath();
        isDrawing = false;
    }

    const cPush = () => {
        SetcStep(cStep + 1)
        let x = cStep + 1
        if (x < cPushArray.length){
            SetcPushArray(cPushArray.slice(0, x))}
        SetcPushArray(prevArray => [...prevArray, document.getElementById('canvas').toDataURL()])
    }

    const cUndo = () => {
        if (cStep > 0){
            SetcStep(cStep - 1)
            let x = cStep - 1
            var canvasPic = new Image();
            canvasPic.src = cPushArray[x]
            canvasPic.onload = function () {ctx.current.drawImage(canvasPic, 0, 0)}
        }
    }

    const cRedo = () => {
        if (cStep < cPushArray.length - 1){
            SetcStep(cStep + 1)
            let x = cStep + 1
            var canvasPic = new Image();
            canvasPic.src = cPushArray[x]
            canvasPic.onload = function () {ctx.current.drawImage(canvasPic, 0, 0)}
        }
    }

    const collapse = () => {
        var contentBot = document.getElementsByClassName("bottom-content");
        var content = document.getElementsByClassName("content");
        if (content[0].style.display === "block") {
            content[0].style.display = "none";
            contentBot[0].style.display = "block"
        } else {
            if (loadNew){
                loadImages()
                setloadNew(false)
                console.log('x')
            }
            content[0].style.display = "block";
            contentBot[0].style.display = "none"
        }     
    }

    const saveCanvas = () => {
        let canvasImage = document.getElementById('canvas').toDataURL('image/png');
        get(ref(database, user)).then((snapshot)=>{
            let name = ''
            if (snapshot.val().images === undefined){
                name = "image1"
            }
            else{
                name = "image" +  (parseInt(Object.keys(snapshot.val().images).length) +1)
            }
            update(ref(database, user + "/images"), {      
                    [name]: canvasImage    
                })
        })
        setImages(previous => [...previous, canvasImage])
    }

    const clear = () => {
        if(back){
            document.getElementById("canvas").style.backgroundColor = back
            ctx.current.fillStyle = back
            ctx.current.fillRect(0,0,canvas.current.width, canvas.current.height)
        }
        else{
            document.getElementById("canvas").style.backgroundColor = back
            ctx.current.fillStyle = 'black'
            ctx.current.fillRect(0,0,canvas.current.width, canvas.current.height)
        }
        cPush()
    }    

    const load = () => {                                                            ///UWAGA SPIERDOLONE
        ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height)
        console.log('naprawde?')
        get(ref(database, user + "/images")).then( (snapshot) => {
        var drawing = new Image()
        drawing.src = snapshot.val()[pick]
        drawing.onload = () =>{
            ctx.current.drawImage(drawing, 0, 0, canvas.current.width, canvas.current.height)
        }
        })
        cPush()
    }

    const customColor = (event) => {
        ctx.current.strokeStyle = event.target.value
        ctx.current.fillStyle = event.target.value
    }

    const nigger = (event) => {                     //co z tym zrobić?
        ctx.current.strokeStyle = event.hex;
        ctx.current.fillStyle = event.hex
    }
    const backgroundColor = (event) => {
        setBack(event.target.value)
        ctx.current.fillStyle = event.target.value
        ctx.current.fillRect(0,0,canvas.current.width, canvas.current.height)
        document.getElementById("canvas").style.backgroundColor = event.target.value
    }

    const eraser = () => {
        setLine(false)
        setCircl(false)
        setRectangle(false)
        setStamp(false)
        document.getElementById("canvas").style.background = 'black'? ctx.current.strokeStyle = 'rgb(0,0,0)': ctx.current.strokeStyle = document.getElementById("canvas").style.backgroundColor  
    }

    const slider = (event) =>{
        ctx.current.lineWidth = event.target.value
        setThicc(event.target.value)
    }
    const line = () => {
        document.getElementById("rectangle").disabled = !lines;
        document.getElementById("circle").disabled = !lines;
        document.getElementById("stample").disabled = !lines;
        document.getElementById("eraser").disabled = !lines
        if (lines){
            document.getElementById("rectangle").style.cursor = "pointer"
            document.getElementById("circle").style.cursor = "pointer"
            document.getElementById("stample").style.cursor = "pointer"
        }
        else{
            document.getElementById("rectangle").style.cursor = "not-allowed"
            document.getElementById("circle").style.cursor = "not-allowed"
            document.getElementById("stample").style.cursor = "not-allowed"
        }   
        lines? document.getElementById("line").style.backgroundColor = "#fbeee0": document.getElementById("line").style.backgroundColor = "#00FF00"
        setLine(!lines)
        setCircl(false)
        setRectangle(false)
        setStamp(false)
        if (confirm === true){
            setConfirm(false)
        }
    }

    const rect = () => {
        document.getElementById("line").disabled = !rectangles;
        document.getElementById("circle").disabled = !rectangles;
        document.getElementById("stample").disabled = !rectangles;
        document.getElementById("eraser").disabled = !rectangles
        if (rectangles){
            document.getElementById("line").style.cursor = "pointer"
            document.getElementById("circle").style.cursor = "pointer"
            document.getElementById("stample").style.cursor = "pointer"
        }
        else{
            document.getElementById("line").style.cursor = "not-allowed"
            document.getElementById("circle").style.cursor = "not-allowed"
            document.getElementById("stample").style.cursor = "not-allowed"
        }
        rectangles? document.getElementById("rectangle").style.backgroundColor = "#fbeee0": document.getElementById("rectangle").style.backgroundColor = "#00FF00"
        setRectangle(!rectangles)
        setCircl(false)
        setLine(false)
        setStamp(false)
        if (confirm === true){
            setConfirm(false)
        }
    }

    const circle = () => {
        document.getElementById("line").disabled = !circl;
        document.getElementById("rectangle").disabled = !circl;
        document.getElementById("stample").disabled = !circl;
        document.getElementById("eraser").disabled = !circl
        if (circl){
            document.getElementById("rectangle").style.cursor = "pointer"
            document.getElementById("line").style.cursor = "pointer"
            document.getElementById("stample").style.cursor = "pointer"
        }
        else{
            document.getElementById("rectangle").style.cursor = "not-allowed"
            document.getElementById("line").style.cursor = "not-allowed"
            document.getElementById("stample").style.cursor = "not-allowed"
        }

        setCircl(!circl)
        circl? document.getElementById("circle").style.backgroundColor = "#fbeee0": document.getElementById("circle").style.backgroundColor = "#00FF00"
        setRectangle(false)
        setLine(false)
        setStamp(false)
        if (confirm === true){
            setConfirm(false)
        }
    }

    const stample = () => {
        document.getElementById("line").disabled = !stamp;
        document.getElementById("rectangle").disabled = !stamp;
        document.getElementById("circle").disabled = !stamp;
        document.getElementById("eraser").disabled = !stamp
        if(stamp){
            document.getElementById("rectangle").style.cursor = "pointer"
            document.getElementById("circle").style.cursor = "pointer"
            document.getElementById("line").style.cursor = "pointer"
        }
        else{
            document.getElementById("rectangle").style.cursor = "not-allowed"
            document.getElementById("circle").style.cursor = "not-allowed"
            document.getElementById("line").style.cursor = "not-allowed"
        }

        setStamp(!stamp)
        stamp? document.getElementById("stample").style.backgroundColor = "#fbeee0": document.getElementById("stample").style.backgroundColor = "#00FF00"
        setRectangle(false)
        setLine(false)
        setCircl(false)
        if (confirm === true){
            setConfirm(false)
        }
    }

    const fill = () => {
        filling? document.getElementById("fill").style.backgroundColor = "#fbeee0": document.getElementById("fill").style.backgroundColor = "#00FF00"
        ctx.current.fillStyle = ctx.current.strokeStyle
        setFilling(!filling)
    }

    const select = (event) => {
        setPick(event.target.id)
        console.log(event.target.id)
    }

    //https://youtu.be/FImgqhivLBw?t=7

    function useWindowSize() {
      
        React.useLayoutEffect(() => {
          function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
          }
          window.addEventListener('resize', updateSize);
          updateSize();
          return () => window.removeEventListener('resize', updateSize);
        }, []);
        return size;
      }
      const [width, height] = useWindowSize();

    const changeLanguageEn = () =>{
        setlanguage('en')
    }

    const changeLanguagePl = () => {
        setlanguage('pl')
        console.log('lmao?')
    }


    React.useEffect(() => {
        if(language === 'en'){
            setText(lang.en)
        }
        else{
            setText(lang.pl)
        }
        console.log('language')
    }, [language])

    const changeDisplay = () => {
        localStorage.setItem("popup", 1)
        document.getElementById("popup").style.display = "none";
        document.getElementById("main-content").style.opacity = 1;
        document.getElementById("main-content").style.pointerEvents = "auto";
    }

    React.useEffect(() => {
        Once();

    },[])
        
    const Once = () => {
        if (localStorage.getItem("popup") == 1){
            document.getElementById("popup").style.display = "none";
            document.getElementById("main-content").style.opacity = 1;
            document.getElementById("main-content").style.pointerEvents = "auto";
            console.log('nigger')
        }
        else{
            localStorage.setItem("popup", 1)
        }
        console.log(localStorage.getItem("popup"))
    }


    return (
        <>  
            

        <div id='main-content' >
           
        
            <Top text={text} actionEn={changeLanguageEn} actionPl={changeLanguagePl}/>
            <button type="button" className="collapsible" onClick={collapse}>{text.top2}</button>
                <div className="content">
                    <table>
                        <tbody>
                            <tr>
                                
                                <td><CirclePicker id="picker" onChange={nigger} style={{margin: 0}}/></td>
                                <td><label className="color-label" htmlFor='custom-color'>{text.custom}</label><input className="custom-color" id='custom-color' type="color" onChange={customColor} defaultValue="#FFFFFF"></input></td>
                                <td><button className="paint-buttons" type="clear" onClick={clear}>{text.clear}</button></td>
                                
                                <td><label className="color-label" id="background-label" htmlFor="background-picker">{text.background}</label><input className="custom-color" id='background-color' type="color" onChange={backgroundColor}></input></td>
                                <td><label className="color-label" id="eraser-label">{text.eraser}</label><button className="paint-buttons" id="eraser" type="button" onClick={eraser}></button></td>
                                <td><button className="paint-buttons" id="undo" onClick={cUndo}></button></td>
                                <td><button className="paint-buttons" id='redo' onClick={cRedo}></button></td>
                                <td><label className="color-label" id="brush-label" htmlFor="slider">{text.brush}{thicc}</label>
                                <input type="range" min="2" max="40" defaultValue="10" id="slider" onChange={slider}></input> </td>
                                <td><button className="paint-buttons" id="line" onClick={line}></button></td>
                                <td><button className="paint-buttons" id="rectangle" onClick={rect}></button></td>
                                <td><button className="paint-buttons" id="circle" onClick={circle}></button></td>
                                <td><button className="paint-buttons" id="stample" onClick={stample}>{text.stamp}</button></td>

                                <td><button className="paint-buttons" id="fill" onClick={fill}>{text.filled}</button></td>


                            </tr>
                        </tbody>
                    </table>
                    <div id="test3">
                        
                        <table >
                            <tbody>
                                <tr>
                                
                                    <td id="canvas-div" ><Canvas  mdown={mdown} mup={mup} mout={mout} draw={draw} /></td>
                                    
                                    <td className="load-table">
                                        <LoadImg action={select} images={images} text={text}/>
                                        <button className="paint-buttons save-load" id="save-load" type="submit" onClick={saveCanvas} >{text.save}</button>
                                <button className="paint-buttons save-load" type="submit" id="save-load" onClick={load}>{text.load}</button>
                                        </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                </div>
                <div className="bottom-content">
            <Buttons3 actionClick={handleClick} actionColor={handleColor} out={["♠","✰","( ͡° ͜ʖ ͡°)","☢","κ","✾"]} val={["♠","✰","( ͡° ͜ʖ ͡°)","☢","κ","✾"]} colour={["red", "green", "blue", "magenta", "white", "yellow"]}/>
            <div className="bottom">
                <div className='bottom-column'>

                
            <table className="table_bottom" id="table_bottom">
                <tbody>
                    <tr>
                        <td className="outputCell"><p id='picked'>{text.sign}</p>
                            <Output output={sign} colour={color}/>
                        
                        </td>
                        <div className="test2">
                        <td>

                        <div className="test">
                        <td className='kurwa'><NewName action={handleNewName} holder={user} text={text}/></td>
                        <td className='kurwa'><Dropdown options={options} action={handleChange} text={text}/></td>
                        </div>

                    
              <td><Store action={handleSave} text={text}/>
              <Reset action={handleReset} text={text}/>
              </td>
              
           
            
            

                        </td>
                        </div>

                        </tr>
                    </tbody>
            </table>
            </div>
         
      
                       
                        
                  
           
            </div>

            </div>
            </div>
            <Popup text={text} actionEn={changeLanguageEn} actionPl={changeLanguagePl} actionButton={changeDisplay}/>
        </>
    )
}

export default App;