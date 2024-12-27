import { useState } from 'react'
import './App.css'
import PlayingCard, { CardSuit } from '../components/playing-card/PlayingCard.tsx'


function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <PlayingCard suit={CardSuit.Hearts} text="A" />
                <PlayingCard suit={CardSuit.Spades} text="A" />
            </div>
        </>
    )
}

export default App
