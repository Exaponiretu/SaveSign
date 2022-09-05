import React, { useEffect } from 'react';

import './style.css';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, get, child, onValue } from "firebase/database";
import {collection} from 'firebase/firestore'

const firebaseConfig = {
  databaseURL: "https://savesign-f7de7-default-rtdb.europe-west1.firebasedatabase.app/",
};

initializeApp(firebaseConfig);

const Buttons = ({id, action, type = 'button', val, out=''}) => (
        <>
            <td><button className='buttons' id={id} onClick={action} type={type} value={val}>{out}</button></td>
        </>
    )

const Output = ({output, colour}) => (
        <>
            <p className="output" style={{color: colour}}>{output}</p>
        </>
    )

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

const Dropdown = ({value, options, action, kurwa}) => {
    const database = getDatabase();
    const usersList = get(ref(database)).then((snapshot) => {
         console.log(Object.getOwnPropertyNames(snapshot.val()).map((option) => option) ) 
 })

 console.log(kurwa)
 //usersList.then(function(result){  console.log(result)})
//console.log(Object.getOwnPropertyNames(get(ref(database))))
//console.log(usersList)
//console.log(options.then((skurwiel) => skurwiel))
/*
return(
    <>
        <select value={value} onChange={action}>
            {options.then((skurwiel) =>{ skurwiel.map((option) =>(
                    <option value={option.value}>{option.value}</option>
                ))
                
})}
        </select>
    </>
)
}
*/



    return(
        <>
            <select value={value} onChange={action}>
                {kurwa.map((option) =>(
                    <option value={option}>{option}</option>
                ))}
            </select>
        </>
    )
}

const NewName = ({action}) => {

    return (
        <>
            <label htmlFor="newName"/>
            <input id="newName" type="text" onKeyPress={action}/>
        </>
    )
}

const App = () => {

    const [kurwa, skurwiel] = React.useState()

    const database = getDatabase();
    const kurwoJebana = () =>{
    get(ref(database)).then((snapshot) => {
        skurwiel(Object.getOwnPropertyNames(snapshot.val()))
        return Object.getOwnPropertyNames(snapshot.val())      
 })
}
//const codokurwy =  usersList.then(function(result){  return result})

//usersList.then(function(result){  console.log( result)})
useEffect(() => {
    kurwoJebana()},[])

//console.log(kurwoJebana())

//useEffect(() => {
  //  console.log(kurwa)},[kurwa])

console.log(kurwa)
const help = Object(kurwa);  /////////DZIAŁA?
const arr = Object.values(help)
console.log(arr)
console.log(String(help[0]).length) ///////////////CO SIĘ ODPIERDALA????????
let arr2 = []
for (let i = 0; i<help.length; i++){
    arr2.push(String(help[i]))
    
    
}
console.log(arr2[0])

//console.log(codokurwy)
/*
onValue(ref(database, (snapshot)=>{
    let niggers = [];
    snapshot.forEach(childSnapshot=>{
        let data = childSnapshot.val
        niggers.push({"data": data})
        
    })
    
}))
*/
/*
firebase.database().ref('data').on('value',(snap)=>{
    console.log(snap.val());})
*/
const options = [
    { label: 'Fruit', value: 'fruit' },
    { label: 'Vegetable', value: 'vegetable' },
    { label: 'Meat', value: 'meat' },
  ];



    const [sign, setSign] = React.useState()
    const [color, setColor] = React.useState()
    const [user, setUser] = React.useState()
    const [kurwo, ustawKurwe] = React.useState() 




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
        if (figure.color !== undefined && figure.sign !== undefined){
            update(ref(database, user), {
            color: figure.color,
            sign: figure.sign
         })}
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
                    user: value
                })
                document.getElementById('newName').value = ''
            }
        }   


        const [value, setValue] = React.useState();
        const handleChange = (event) => {
            ustawKurwe(get(ref(database)).then((snapshot) => {
                return Object.getOwnPropertyNames(snapshot.val()).map((option) => option) 
        }))
          setValue(event.target.value);
        };
        console.log(kurwo)
        console.log(JSON.stringify(kurwo))
    return (
        <>
            <h1 id='niggers'>nigger</h1>
            <hr/>
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
                        <td><NewName action={handleNewName}/></td>
                        <td><Dropdown options={options} kurwa={arr} value={value} action={handleChange}/></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default App;