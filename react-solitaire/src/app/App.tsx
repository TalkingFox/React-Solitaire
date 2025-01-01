import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { CardProps } from '../components/playing-card/PlayingCard.tsx'
import { CardSuit } from '../shared/enums.ts';
import DeckStack from '../components/deck-stack/DeckStack.tsx';
import CardStack from '../components/card-stack/CardStack.tsx';
import CardColumn from '../components/card-column/CardColumn.tsx';
import { CARD_TEXT_BY_VALUE, CARD_VALUE_BY_TEXT } from '../shared/card-values.ts';

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

    const startingColumns = useMemo<CardProps[][]>(() => {
        let columns: CardProps[][] = [[], [], [], [], [], [], []]
        for (let i = 0; i < columns.length; i++) {
            for (let j = 0; j + i < columns.length; j++) {
                const currentIndex = i + j;
                const popCard = startingDeck.pop();
                if (!popCard) {
                    continue
                }
                columns[currentIndex].push(popCard);
            }
        }
        return columns;
    }, []);

    const [cardStacks, setCardStacks] = useState<CardProps[][]>([[], [], [], []]);
    const [cardColumns, setCardColumns] = useState<CardProps[][]>(startingColumns);

    const canSendCardToStack: (card: CardProps) => [boolean, CardProps[] | null] = (card: CardProps) => {
        let foundMatch: Boolean = false;
        let stackMatch: CardProps[] = [];

        // find appropriate stack
        cardStacks.forEach((stack: CardProps[]) => {
            if (stack.length > 0 && stack[0].suit == card.suit) {
                stackMatch = stack;
                foundMatch = true;
                return [false, null];
            }
            if (stack.length == 0 && !foundMatch) {
                stackMatch = stack;
                foundMatch = true;
            }
        });

        if (!foundMatch) {
            // Shouldn't happen, but who knows, eh?
            return [false, null];
        }

        // Check that the card belongs at the top of the stack.
        let expectedValue: number = 0;
        if (stackMatch.length == 0) {
            expectedValue = 1
        } else {
            const cardToIncrement = stackMatch[stackMatch.length - 1];
            expectedValue = CARD_VALUE_BY_TEXT[cardToIncrement.text] + 1
        }

        const expectedText = CARD_TEXT_BY_VALUE[expectedValue]
        if (card.text == expectedText) {
            return [true, stackMatch]
        }
        return [false, null]
    }

    const columnCardRightClicked = (card: CardProps, columnIndex: number) => {
        const [canSendCard, matchingStack] = canSendCardToStack(card);
        if (!canSendCard || !matchingStack) {
            return;
        }

        // Add card to stack
        const newStacks = cardStacks.splice(0);
        matchingStack.push(card);
        setCardStacks(newStacks);

        // Remove card from column
        const newColumns = cardColumns.slice(0);
        newColumns[columnIndex].pop();
        setCardColumns(newColumns);
    };

    const trySendDeckCardFromDeck = (card: CardProps) => {
        const [canSendCard, matchingStack] = canSendCardToStack(card);
        if (!canSendCard || !matchingStack) {
            return false;
        }

        // Add card to stack
        const newStacks = cardStacks.splice(0);
        matchingStack.push(card);
        setCardStacks(newStacks);

        // Remove card from deck
        return true;
    };

    return (
        <>
            <div className="top-row">
                <DeckStack startingDeck={startingDeck} trySendCardToStack={trySendDeckCardFromDeck}/>
                <div className="deck-spacer"></div>
                <div className="card-stacks row">
                    <CardStack cards={cardStacks[0]}></CardStack>
                    <CardStack cards={cardStacks[1]}></CardStack>
                    <CardStack cards={cardStacks[2]}></CardStack>
                    <CardStack cards={cardStacks[3]}></CardStack>
                </div>
            </div>
            <div>
                <div className='card-columns'>
                    <CardColumn cards={cardColumns[0]} cardRightClicked={(card) => columnCardRightClicked(card, 0)}></CardColumn>
                    <CardColumn cards={cardColumns[1]} cardRightClicked={(card) => columnCardRightClicked(card, 1)}></CardColumn>
                    <CardColumn cards={cardColumns[2]} cardRightClicked={(card) => columnCardRightClicked(card, 2)}></CardColumn>
                    <CardColumn cards={cardColumns[3]} cardRightClicked={(card) => columnCardRightClicked(card, 3)}></CardColumn>
                    <CardColumn cards={cardColumns[4]} cardRightClicked={(card) => columnCardRightClicked(card, 4)}></CardColumn>
                    <CardColumn cards={cardColumns[5]} cardRightClicked={(card) => columnCardRightClicked(card, 5)}></CardColumn>
                    <CardColumn cards={cardColumns[6]} cardRightClicked={(card) => columnCardRightClicked(card, 6)}></CardColumn>
                </div>
            </div>
        </>
    )
}

export default App
