import { useEffect, useMemo } from 'react'
import './App.css'
import PlayingCard, { CardProps } from '../components/playing-card/PlayingCard.tsx'
import { CardSuit } from '../shared/enums.ts';
import DeckStack from '../components/deck-stack/DeckStack.tsx';
import CardStack from '../components/card-stack/CardStack.tsx';
import CardColumn from '../components/card-column/CardColumn.tsx';


function App() {
    useEffect(() => {
        document.body.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
    });

    const startingDeck = useMemo(() => {
        const suits = [
            CardSuit.Clubs,
            CardSuit.Diamonds,
            CardSuit.Hearts,
            CardSuit.Spades
        ]
        const texts = [
            "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"
        ]

        const fullDeck = suits.flatMap(suit => {
            return texts.map(text => {
                let prop: CardProps = {
                    suit: suit,
                    text: text
                };
                return prop
            });
        });


        // shuffle deck
        for (let i = fullDeck.length - 1; i > 0; i--) {
            const shuffle = Math.floor(Math.random() * i);
            [fullDeck[i], fullDeck[shuffle]] = [fullDeck[shuffle], fullDeck[i]];
        }
        return fullDeck;
    }, []);

    const cardColumns: CardProps[][] = [[], [], [], [], [], [], []]
    for (let i = 0; i < cardColumns.length; i++) {
        for (let j = 0; j + i < cardColumns.length; j++) {
            const currentIndex = i + j;
            const popCard = startingDeck.pop();
            if (!popCard) {
                continue
            }
            cardColumns[currentIndex].push(popCard);
        }
    }


    return (
        <>
            <div className="top-row">
                <DeckStack startingDeck={startingDeck} />
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
                    <CardColumn cards={cardColumns[0]}></CardColumn>
                    <CardColumn cards={cardColumns[1]}></CardColumn>
                    <CardColumn cards={cardColumns[2]}></CardColumn>
                    <CardColumn cards={cardColumns[3]}></CardColumn>
                    <CardColumn cards={cardColumns[4]}></CardColumn>
                    <CardColumn cards={cardColumns[5]}></CardColumn>
                    <CardColumn cards={cardColumns[6]}></CardColumn>
                </div>
            </div>
        </>
    )
}

export default App
