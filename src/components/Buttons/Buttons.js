import React from 'react';

const Buttons = ({id, action, type = 'button', val, out=''}) => (
    <>
        <td><button className='buttons' id={id} onClick={action} type={type} value={val}>{out}</button></td>
    </>
)

const Buttons2 = () => {
    const [sign, setSign] = React.useState()
    const [color, setColor] = React.useState()

    const handleClick = (event) => {
        setSign(event.target.value);
    }

    const handleColor = (event) => {
        setColor(event.target.value)
   }
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

export default Buttons2;