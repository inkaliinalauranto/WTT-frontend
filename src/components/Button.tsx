import { CSSProperties } from "react"


interface ButtonProps {
    text: string
    buttonColor: string
    onclick: () => void
}

export function Button({text, buttonColor, onclick}: ButtonProps) {

    const style: CSSProperties = {
        background: buttonColor
    }

    return <button style={style} onClick={onclick}> {text} </button>
}