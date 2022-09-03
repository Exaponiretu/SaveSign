import React from 'react';

import './style.css';

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://savesign-f7de7-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);


const Buttons = ({id, action, type = 'button', val, out=''}) => 
    (
        <>
            <td><button className='buttons' id={id} onClick={action} type={type} value={val}>{out}</button></td>
        </>
    )

const Output = ({output, colour}) => 
    (
        <>
            <p className="output" style={{color: colour}}>{output}</p>
        </>
    )

const Store = ({type = 'submit', action}) => 
     (
        <>
            <button type={type} onClick={action}>Save</button>
        </>
    )


const Reset = ({}) => {

    return (
        <>
            <button >Reset</button>
        </>
    )
}

const App = () => {

    const [sign, setSign] = React.useState()
    const [color, setColor] = React.useState()

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
        console.log(figure)
    }

    return (
        <>
            <h1 id='niggers'>nigger</h1>
            <hr/>
            <table className="center">
                <tbody>
                    <tr>
                        <Buttons id="sign1" action={handleClick} val="♠" out="♠"/>
                        <Buttons id="sign2" action={handleClick} val="♋" out="♋"/>
                        <Buttons id="sign3" action={handleClick} val="( ͡° ͜ʖ ͡°)" out="( ͡° ͜ʖ ͡°)"/>
                        <Buttons id="sign4" action={handleClick} val="☢" out="☢" />
                        <Buttons id="sign5" action={handleClick} val="κ" out="κ"/>
                        <Buttons id="sign6" action={handleClick} val="🦇" out="🦇"/>
                    </tr>
                    <br/>
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
                        <td></td>
                        <td></td>
                        <td className="outputCell"><Output output={sign} colour={color}/></td>
                        <td><Store action={handleSave}/></td>
                        <td><Reset /></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default App;