import React, {useEffect, useState} from "react";
import {Container, Spinner} from "react-bootstrap";

const LoadingPage: React.FC<{ whiteBackground?: boolean }> = ({whiteBackground = false}) => {
    const [text, setText] = useState<string>("Loading");
    const points = 4;
    const elapsed = 500;

    useEffect(() => {
        const initSize = text.length;
        const interval = setInterval(() => {
            setText(text + ".");
            if (text.length > initSize + points)
                setText(text.substring(initSize));
        }, elapsed)

        return clearInterval(interval);
    }, [])

    return (
        <Container className={`
            ${whiteBackground ? "bg-white" : "background-default"} 
            d-flex flex-column p-5 text-center align-items-center
        `}>
            <h3>{text}</h3>
            <Spinner animation={"border"} variant={"primary"}>
                <span className={"visually-hidden"}>Loading spinner</span>
            </Spinner>
        </Container>
    )
}

export default LoadingPage;