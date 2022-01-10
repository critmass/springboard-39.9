import React from "react";

const Card = ({data}) => {
    const {image} = data

    return (<img src = {image}/>)
}

export default Card