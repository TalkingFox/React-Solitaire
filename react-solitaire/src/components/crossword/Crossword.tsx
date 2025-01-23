import { useMemo, useRef, useState } from 'react';
import { SolitaireProps } from '../../shared/solitaire-props';
import SidePanel from '../side-panel/SidePanel';
import './Crossword.css';
import { Variant } from '../../shared/variants';
import CardStack from '../card-stack/CardStack';
import DeckStack from '../deck-stack/DeckStack';
import { CardProps, CardSource } from '../playing-card/PlayingCard';
import { DeckBuilder } from '../../shared/deck-builder';
import { CardSuit } from '../../shared/enums';

function buildDeck(): CardProps[] {
    const courtSet: Set<string> = new Set(['J', 'Q', 'K']);
    const deck = DeckBuilder
        .BuildDeck()
        .filter((card) => !courtSet.has(card.text));
    return deck;
}

function buildCourt(): CardProps[] {
    const suits: CardSuit[] = [CardSuit.Clubs, CardSuit.Diamonds, CardSuit.Hearts, CardSuit.Spades];
    const faces: string[] = ['J', 'Q', 'K'];
    const court: CardProps[] = [];

    for (let i = 0; i < suits.length; i++) {
        const suit = suits[i];
        for (let j = 0; j < faces.length; j++) {
            const face = faces[i];
            const card: CardProps = {
                source: CardSource.Reserve,
                suit: suit,
                text: face,
                isDraggable: true,
                isFaceDown: false
            };
            court.push(card)
        }
    }
    return court;
}

const Crossword = ({ onVariantChanged }: SolitaireProps) => {
    const startingDeck = useMemo(buildDeck, []);
    const startingCourt = useMemo(buildCourt, []);
    const sidepanelRef = useRef(null);
    const startingCard = startingDeck.pop() as CardProps;
    
    const [court, setCourt] = useState<CardProps[]>(startingCourt);
    const [drawDeck, setDrawDeck] = useState<CardProps[]>(startingDeck);
    const [drawPile, setDrawPile] = useState<CardProps[]>([startingCard]);

    return (
        <div className='crossword-parent crossword-row'>
            <div className='crossword-column crossword-reserve'>
                <DeckStack cardRightClicked={console.log}
                    deck={drawDeck}
                    drawCardsClicked={() => {}}
                    playedCards={drawPile}></DeckStack>
            </div>
            <div className='crossword-column'></div>
            <div className='crossword-column'>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
            </div>
            <div className='crossword-column'>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
            </div>
            <div className='crossword-column'>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
            </div>
            <div className='crossword-column'>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
            </div>
            <div className='crossword-column'>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
            </div>
            <div className='crossword-column'>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
            </div>
            <div className='crossword-column'>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
                <CardStack cards={[]} isDraggable={false} onCardDropped={console.log}></CardStack>
            </div>
            <SidePanel ref={sidepanelRef}
                activeVariant={Variant.Crossword}
                autoSolveClicked={console.log}
                newGameClicked={console.log}
                restartClicked={console.log}
                showAutoSolve={false}
                undoClicked={console.log}
                variantSelected={onVariantChanged}
            ></SidePanel>
        </div>

    )
};

export default Crossword;