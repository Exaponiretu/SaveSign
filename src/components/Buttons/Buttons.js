import React from 'react';

const Buttons = ({id, action, type = 'button', val, out=''}) => (
    <>
        <td><button className='buttons' id={id} onClick={action} type={type} value={val}>{out}</button></td>
    </>
)

const Buttons2 = ({handleClick, handleColor}) => {


  //  const handleClick = (event) => {
   //     setSign(event.target.value);
  //  }

  //  const handleColor = (event) => {
 //       setColor(event.target.value)
 //  }
    return (
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
    )
}

const Buttons3 = ({actionClick, actionColor, out='', val, colour}) => (
    <>
    <table className="center">
        <tbody>
            <tr>
                <td><button className="buttons" id="sign1" onClick={actionClick} type="button" value={val[0]}>{out[0]}</button></td>
                <td><button className="buttons" id="sign2" onClick={actionClick} type="button" value={val[1]}>{out[1]}</button></td>
                <td><button className="buttons" id="sign3" onClick={actionClick} type="button" value={val[2]}>{out[2]}</button></td>
                <td><button className="buttons" id="sign4" onClick={actionClick} type="button" value={val[3]}>{out[3]}</button></td>
                <td><button className="buttons" id="sign5" onClick={actionClick} type="button" value={val[4]}>{out[4]}</button></td>
                <td><button className="buttons" id="sign6" onClick={actionClick} type="button" value={val[5]}>{out[5]}</button></td>
            </tr>
            <tr>
            <td><button className="buttons" id="color1" onClick={actionColor} type="button" value={colour[0]}></button></td>
            <td><button className="buttons" id="color2" onClick={actionColor} type="button" value={colour[1]}></button></td>
            <td><button className="buttons" id="color3" onClick={actionColor} type="button" value={colour[2]}></button></td>
            <td><button className="buttons" id="color4" onClick={actionColor} type="button" value={colour[3]}></button></td>
            <td><button className="buttons" id="color5" onClick={actionColor} type="button" value={colour[4]}></button></td>
            <td><button className="buttons" id="color6" onClick={actionColor} type="button" value={colour[5]}></button></td>
            </tr>
        </tbody>
    </table>
        

    </>
)
    


export {Buttons, Buttons2, Buttons3}