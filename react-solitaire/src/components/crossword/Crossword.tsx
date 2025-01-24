import { useMemo, useRef, useState } from 'react';
import { SolitaireProps } from '../../shared/solitaire-props';
import SidePanel from '../side-panel/SidePanel';
import './Crossword.css';
import { Variant } from '../../shared/variants';
import CardStack from '../card-stack/CardStack';
import DeckStack from '../deck-stack/DeckStack';
import { CardProps, CardSize, CardSource } from '../playing-card/PlayingCard';
import { DeckBuilder } from '../../shared/deck-builder';
import { CardSuit } from '../../shared/enums';

function buildDeck(): [CardProps[], CardProps] {
    const courtSet: Set<string> = new Set(['J', 'Q', 'K']);
    const deck = DeckBuilder
        .BuildDeck()
        .filter((card) => !courtSet.has(card.text));
    return [deck, deck.pop() as CardProps];
}

function buildCourt(): [CardProps[], CardProps] {
    const suits: CardSuit[] = [CardSuit.Clubs, CardSuit.Diamonds, CardSuit.Hearts, CardSuit.Spades];
    const faces: string[] = ['J', 'Q', 'K'];
    const court: CardProps[] = [];

    for (let i = 0; i < suits.length; i++) {
        const suit = suits[i];
        for (let j = 0; j < faces.length; j++) {
            const face = faces[j];
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
    return [court, court.pop() as CardProps];
}

const Crossword = ({ onVariantChanged }: SolitaireProps) => {
    const [startingDeck, startingCard] = useMemo(buildDeck, []);
    const [startingCourt, startingCourtPile] = useMemo(buildCourt, []);
    const sidepanelRef = useRef(null);

    const [courtDeck, setCourtDeck] = useState<CardProps[]>(startingCourt);
    const [courtPile, setCourtPile] = useState<CardProps[]>([startingCourtPile])
    const [drawDeck, setDrawDeck] = useState<CardProps[]>(startingDeck);
    const [drawPile, setDrawPile] = useState<CardProps[]>([startingCard]);

    const startingBoard = useMemo<(CardProps | null)[]>(() => {
        const deck: (CardProps | null)[] = new Array<CardProps | null>(49).fill(null);
        return deck;
    }, []);
    const [board, setBoard] = useState<(CardProps | null)[]>(startingBoard);

    const cardDroppedToBoard = (card: CardProps, boardIndex: number) => {
        const existingCard = board[boardIndex];
        if (existingCard) {
            return;
        }

        const newBoard = board.slice(0);
        newBoard[boardIndex] = card;
        setBoard(newBoard);
    };

    const elements: JSX.Element[] = [];
    board.forEach((boardCard, index) => {
        const cardElement = <CardStack key={crypto.randomUUID()}
            cardSize={CardSize.Small}
            cards={boardCard ? [boardCard] : []}
            isDraggable={false}
            onCardDropped={(card) => cardDroppedToBoard(card, index)}>
        </CardStack>;
        elements.push(cardElement);
    });

    const rows: JSX.Element[] = [];
    for (let i = 0; i < 7; i++) {
        const row = <div className='crossword-row' key={crypto.randomUUID()}>
            {elements.slice(7 * i, 7 * (i + 1))}
        </div>
        rows.push(row);
    }

    return (
        <div className='crossword-parent crossword-row'>
            <div className='crossword-column crossword-reserve'>
                <DeckStack cardRightClicked={() => { }}
                    deck={drawDeck}
                    drawCardsClicked={() => { }}
                    playedCards={drawPile}
                    cardSize={CardSize.Small}></DeckStack>
                <DeckStack cardRightClicked={console.log}
                    deck={courtDeck}
                    cardSize={CardSize.Small}
                    playedCards={courtPile}
                    drawCardsClicked={console.log}
                ></DeckStack>
            </div>
            <div className='crossword-column crossword-spacer'></div>
            <div className='crossword-column crossword-board'>
                {rows}
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