import { useEffect } from 'react'
import './App.css'
import PlayingCard from '../components/playing-card/PlayingCard.tsx'
import { CardSuit } from '../shared/enums.ts';
import DeckStack from '../components/deck-stack/DeckStack.tsx';
import CardStack from '../components/card-stack/CardStack.tsx';


function App() {
    useEffect(() => {
        document.body.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
    });

    return (
        <>
            <div className="top-row">
                <DeckStack />
                <div className="deck-spacer"></div>
                <div className="card-stacks row">
                    <CardStack ></CardStack>
                    <CardStack ></CardStack>
                    <CardStack ></CardStack>
                    <CardStack ></CardStack>
                </div>
            </div>
            <div>
                <div className='card-columns'>
                    <PlayingCard suit={CardSuit.Clubs} text="A" />
                    <PlayingCard suit={CardSuit.Clubs} text="2" />
                    <PlayingCard suit={CardSuit.Clubs} text="3" />
                    <PlayingCard suit={CardSuit.Clubs} text="4" />
                    <PlayingCard suit={CardSuit.Clubs} text="5" />
                    <PlayingCard suit={CardSuit.Clubs} text="6" />
                    <PlayingCard suit={CardSuit.Clubs} text="7" />
                </div>
            </div>
        </>
    )
}

export default App
