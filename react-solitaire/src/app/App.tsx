import { useState } from 'react'
import './App.css'
import PlayingCard, { CardSuit } from '../components/playing-card/PlayingCard.tsx'


function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <div className='row'>
                    <PlayingCard suit={CardSuit.Hearts} text="A" />
                    <PlayingCard suit={CardSuit.Hearts} text="2" />
                    <PlayingCard suit={CardSuit.Hearts} text="3" />
                    <PlayingCard suit={CardSuit.Hearts} text="4" />
                    <PlayingCard suit={CardSuit.Hearts} text="5" />
                    <PlayingCard suit={CardSuit.Hearts} text="6" />
                    <PlayingCard suit={CardSuit.Hearts} text="7" />
                    <PlayingCard suit={CardSuit.Hearts} text="8" />
                    <PlayingCard suit={CardSuit.Hearts} text="9" />
                    <PlayingCard suit={CardSuit.Hearts} text="10" />
                    <PlayingCard suit={CardSuit.Hearts} text="J" />
                    <PlayingCard suit={CardSuit.Hearts} text="Q" />
                    <PlayingCard suit={CardSuit.Hearts} text="K" />
                </div>
                {/* <div className='row'>
                    <PlayingCard suit={CardSuit.Spades} text="A" />
                    <PlayingCard suit={CardSuit.Spades} text="2" />
                    <PlayingCard suit={CardSuit.Spades} text="3" />
                    <PlayingCard suit={CardSuit.Spades} text="4" />
                    <PlayingCard suit={CardSuit.Spades} text="5" />
                    <PlayingCard suit={CardSuit.Spades} text="6" />
                    <PlayingCard suit={CardSuit.Spades} text="7" />
                    <PlayingCard suit={CardSuit.Spades} text="8" />
                    <PlayingCard suit={CardSuit.Spades} text="9" />
                    <PlayingCard suit={CardSuit.Spades} text="10" />
                    <PlayingCard suit={CardSuit.Spades} text="J" />
                    <PlayingCard suit={CardSuit.Spades} text="Q" />
                    <PlayingCard suit={CardSuit.Spades} text="K" />
                </div>
                <div className='row'>
                    <PlayingCard suit={CardSuit.Diamonds} text="A" />
                    <PlayingCard suit={CardSuit.Diamonds} text="2" />
                    <PlayingCard suit={CardSuit.Diamonds} text="3" />
                    <PlayingCard suit={CardSuit.Diamonds} text="4" />
                    <PlayingCard suit={CardSuit.Diamonds} text="5" />
                    <PlayingCard suit={CardSuit.Diamonds} text="6" />
                    <PlayingCard suit={CardSuit.Diamonds} text="7" />
                    <PlayingCard suit={CardSuit.Diamonds} text="8" />
                    <PlayingCard suit={CardSuit.Diamonds} text="9" />
                    <PlayingCard suit={CardSuit.Diamonds} text="10" />
                    <PlayingCard suit={CardSuit.Diamonds} text="J" />
                    <PlayingCard suit={CardSuit.Diamonds} text="Q" />
                    <PlayingCard suit={CardSuit.Diamonds} text="K" />
                </div>
                <div className='row'>
                    <PlayingCard suit={CardSuit.Clubs} text="A" />
                    <PlayingCard suit={CardSuit.Clubs} text="2" />
                    <PlayingCard suit={CardSuit.Clubs} text="3" />
                    <PlayingCard suit={CardSuit.Clubs} text="4" />
                    <PlayingCard suit={CardSuit.Clubs} text="5" />
                    <PlayingCard suit={CardSuit.Clubs} text="6" />
                    <PlayingCard suit={CardSuit.Clubs} text="7" />
                    <PlayingCard suit={CardSuit.Clubs} text="8" />
                    <PlayingCard suit={CardSuit.Clubs} text="9" />
                    <PlayingCard suit={CardSuit.Clubs} text="10" />
                    <PlayingCard suit={CardSuit.Clubs} text="J" />
                    <PlayingCard suit={CardSuit.Clubs} text="Q" />
                    <PlayingCard suit={CardSuit.Clubs} text="K" />
                </div> */}
            </div>
        </>
    )
}

export default App
