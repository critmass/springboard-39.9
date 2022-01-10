import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import {v4 as uuid} from "uuid"
import Card from "./Card"

const BASE_URL = "http://deckofcardsapi.com/api/deck"

const Deck = () => {
    const [deckInfo, setDeckInfo] = useState(null)
    const [pile, setPile] = useState([])
    const [autoDraw, setAutoDraw] = useState(false)
    const timerRef = useRef(null)

    useEffect(() => {
        const getDeck = async () => {
            const { data } = await axios.get(`${BASE_URL}/new/shuffle`)
            setDeckInfo(data)
        }
        getDeck()
    }, [setDeckInfo])

    useEffect(() => {
        if(autoDraw && !timerRef.current) {
            timerRef.current = setInterval(addCard, 1000)
        }
        return () => {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }, [autoDraw, setAutoDraw])

    const addCard = async () => {
        if(deckInfo.remaining){
            const url = `${BASE_URL}/${deckInfo.deck_id}/draw`
            const {data} = await axios.get(url)
            setPile(p => [
                ...p,
                ...data.cards.map(card => ({...card, id:uuid()}))
            ])
            setDeckInfo(d => ({...d, remaining:data.remaining}))
        }
        else {
            setAutoDraw(false)
            alert("Error: no cards remaining!")
        }
    }

    const toggleAutoDraw = () => {
        setAutoDraw(state => !state)
    }

    return (<div>
        <div>
            <button onClick={addCard} disabled={autoDraw}>
                Draw Card
            </button>
            <button onClick={toggleAutoDraw}>
                {autoDraw?
                    "Stop auto drawing":
                    "Start auto drawing"
                }
            </button>
        </div>
        <div>
            {pile.length?<Card
                key = {pile[pile.length-1].id}
                data = {pile[pile.length-1]}
            />:<br/>}
        </div>
    </div>)

}

export default Deck