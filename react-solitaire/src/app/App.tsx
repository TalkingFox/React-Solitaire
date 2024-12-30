import { useEffect } from 'react'
import './App.css'
import PlayingCard from '../components/playing-card/PlayingCard.tsx'
import { CardSuit } from '../shared/enums.ts';
import DeckStack from '../components/deck-stack/DeckStack.tsx';


function App() {
    useEffect(() => {
        document.body.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
    });

    return (
        <>
            <div className="top-row">
                <DeckStack/>
            </div>
            <div>
                <div className='row'>
                </div>
                <div className='row'>
                </div>
                <div className='row'>
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
                </div>
            </div>
        </>
    )
}

export default App
