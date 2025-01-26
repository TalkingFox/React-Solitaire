import { useEffect, useMemo, useRef, useState } from 'react';
import { SolitaireProps } from '../../shared/solitaire-props';
import SidePanel, { SidePanelHandles } from '../side-panel/SidePanel';
import './Crossword.css';
import { Variant } from '../../shared/variants';
import CardStack from '../card-stack/CardStack';
import DeckStack from '../deck-stack/DeckStack';
import { CardProps, CardSize, CardSource } from '../playing-card/PlayingCard';
import { DeckBuilder } from '../../shared/deck-builder';
import { CardSuit } from '../../shared/enums';
import { CARD_VALUE_BY_TEXT } from '../../shared/card-values';
import WinBanner from '../win-banner/WinBanner';

interface CrosswordStateHistory {
    drawDeck?: CardProps[],
    drawPile?: CardProps[],
    court?: CardProps[],
    courtPile?: CardProps[],
    board?: (CardProps | null)[]
}

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

function isCardAdjacentToIndex(board: (CardProps | null)[], cardIndex: number): boolean {
    // Check North.
    if (cardIndex >= 7) {
        const northCard = board[cardIndex - 7];
        if (northCard) {
            return true;
        }
    }

    // Check East
    if (cardIndex % 7 != 6) {
        const eastCard = board[cardIndex + 1];
        if (eastCard) {
            return true;
        }
    }

    // Check West
    if (cardIndex % 7 != 0) {
        const westCard = board[cardIndex - 1];
        if (westCard) {
            return true;
        }
    }

    // Check South
    if (cardIndex < 42) {
        const southCard = board[cardIndex + 7];
        if (southCard) {
            return true;
        }
    }

    return false;
}

function fetchColumnCounts(board: (CardProps | null)[], columnIndex: number): number[] {
    let sums = [0];
    let sumIndex = 0;
    for (let i = 0; i < 7; i++) {
        const columnCard = board[columnIndex + (7 * i)];
        if (columnCard?.isFaceDown) {
            if (i == 0 || i == 6) {
                continue
            }

            const lastCard = board[columnIndex + (7 * (i - 1))]
            if (lastCard?.isFaceDown) {
                continue;
            }

            sums.push(0);
            sumIndex++;
            continue
        }
        if (columnCard && !columnCard.isFaceDown) {
            sums[sumIndex] += CARD_VALUE_BY_TEXT[columnCard.text];
        }
    }
    return sums;
}

function fetchRowCounts(board: (CardProps | null)[], rowIndex: number): number[] {
    let sums = [0];
    let sumIndex = 0;
    for (let i = 0; i < 7; i++) {
        const columnCard = board[(rowIndex * 7) + i];
        if (columnCard?.isFaceDown) {
            if (i == 0 || i == 6) {
                continue
            }

            const lastCard = board[(rowIndex * 7) + (i - 1)];
            if (lastCard?.isFaceDown) {
                continue
            }
            sums.push(0);
            sumIndex++;
            continue
        }
        if (columnCard && !columnCard.isFaceDown) {
            sums[sumIndex] += CARD_VALUE_BY_TEXT[columnCard.text];
        }
    }
    return sums;
}

const Crossword = ({ onVariantChanged }: SolitaireProps) => {
    const [startingDeck, startingCard] = useMemo(buildDeck, []);
    const [startingCourt, startingCourtPile] = useMemo(buildCourt, []);
    const sidepanelRef = useRef<SidePanelHandles>(null);

    const [courtDeck, setCourtDeck] = useState<CardProps[]>(startingCourt);
    const [courtPile, setCourtPile] = useState<CardProps[]>([startingCourtPile])
    const [drawDeck, setDrawDeck] = useState<CardProps[]>(startingDeck);
    const [drawPile, setDrawPile] = useState<CardProps[]>([startingCard]);

    const startingBoard = useMemo<(CardProps | null)[]>(() => {
        const deck: (CardProps | null)[] = new Array<CardProps | null>(49).fill(null);
        return deck;
    }, []);
    const [board, setBoard] = useState<(CardProps | null)[]>(startingBoard);
    const [showWinBanner, setShowWinBanner] = useState(false);

    const [undoStack, setUndoStack] = useState<CrosswordStateHistory[]>([{
        board: board.map((card) => card ? structuredClone(card) : card),
        court: courtDeck.map(card => structuredClone(card)),
        courtPile: courtPile.map(card => structuredClone(card)),
        drawDeck: drawDeck.map(card => structuredClone(card)),
        drawPile: drawPile.map(card => structuredClone(card))
    }]);


    useEffect(() => {
        const isBoardFull = board.every((card) => card);
        if (!isBoardFull) {
            return;
        }

        // Check for even row sums
        for (let i = 0; i < 7; i++) {
            const sums = fetchRowCounts(board, i);
            if (sums.some((sum => sum % 2 == 1))) {
                return;
            }
        }

        // Check for even column sums
        for (let i = 0; i < 7; i++) {
            const sums = fetchColumnCounts(board, i);
            if (sums.some((sum => sum % 2 == 1))) {
                return;
            }
        }

        setShowWinBanner(true);
        sidepanelRef.current?.setTimerPaused(true);

    }, [board]);

    const updateUndoStack = (sourceData: CrosswordStateHistory, clearStack: boolean = false) => {
        const snapshot: CrosswordStateHistory = {
            board: (sourceData.board ?? board).map(card => card ? structuredClone(card) : card),
            court: (sourceData.court ?? courtDeck).map(card => structuredClone(card)),
            courtPile: (sourceData.courtPile ?? courtPile).map(card => structuredClone(card)),
            drawDeck: (sourceData.drawDeck ?? drawDeck).map(card => structuredClone(card)),
            drawPile: (sourceData.drawPile ?? drawPile).map(card => structuredClone(card))
        };

        const newStack = clearStack ? [] : undoStack.slice(0);
        newStack.push(snapshot);
        setUndoStack(newStack);
    };

    const startNewGame = () => {
        const [newDeck, newStartingCard] = buildDeck();
        const [newCourt, newCourtPile] = buildCourt();

        const newBoard = new Array<CardProps | null>(49).fill(null);

        setBoard(newBoard);
        setDrawDeck(newDeck);
        setDrawPile([newStartingCard]);
        setCourtDeck(newCourt);
        setCourtPile([newCourtPile]);

        updateUndoStack({
            board: newBoard,
            court: newCourt,
            courtPile: [newCourtPile],
            drawDeck: newDeck,
            drawPile: [newStartingCard]
        }, true);

        sidepanelRef.current?.setTimerPaused(false);
        sidepanelRef.current?.resetTimer();

        setShowWinBanner(false);
    };

    const cardDroppedToBoard = (card: CardProps, boardIndex: number) => {
        const existingCard = board[boardIndex];
        if (existingCard) {
            return;
        }

        // Check if card is being placed next to another card.
        const cardsInPlay = drawDeck.length + drawPile.length + courtDeck.length + courtPile.length;
        // If no cards have been added to the board, then card may be placed anywhere.
        if (cardsInPlay < 52 && !isCardAdjacentToIndex(board, boardIndex)) {
            return;
        }

        const newBoard = board.slice(0);
        newBoard[boardIndex] = card;
        setBoard(newBoard);

        const snapshot: CrosswordStateHistory = {
            board: newBoard
        };

        let foundCard = false;
        if (drawPile.length > 0) {
            const drawPileCard = drawPile[drawPile.length - 1];
            if (drawPileCard.suit == card.suit && drawPileCard.text == card.text) {
                const newDrawDeck = drawDeck.slice(0);
                const newDrawPile = newDrawDeck.length > 0 ? [newDrawDeck.pop() as CardProps] : [];
                setDrawDeck(newDrawDeck);
                setDrawPile(newDrawPile);
                snapshot.drawDeck = newDrawDeck;
                snapshot.drawPile = newDrawPile;
                foundCard = true;
            }
        }

        if (!foundCard && courtPile.length > 0) {
            const courtPileCard = courtPile[courtPile.length - 1];
            if (courtPileCard.suit == card.suit && courtPileCard.text == card.text) {
                const newCourtDeck = courtDeck.slice(0);
                const newCourtPile = newCourtDeck.length > 0 ? [newCourtDeck.pop() as CardProps] : [];
                card.isFaceDown = true;
                setCourtDeck(newCourtDeck);
                setCourtPile(newCourtPile);
                snapshot.court = newCourtDeck;
                snapshot.courtPile = newCourtPile;
            }
        }

        updateUndoStack(snapshot);
    }

    const onHideWinBanner = () => {
        sidepanelRef.current?.setTimerPaused(true);
        setShowWinBanner(false);
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

    const loadState = (revertState: CrosswordStateHistory) => {
        setBoard(revertState.board!.map(card => card ? structuredClone(card) : card));
        setCourtDeck(revertState.court!.map(card => structuredClone(card)));
        setCourtPile(revertState.courtPile!.map(card => structuredClone(card)));
        setDrawDeck(revertState.drawDeck!.map(card => structuredClone(card)));
        setDrawPile(revertState.drawPile!.map(card => structuredClone(card)));
    };

    const undoLastMove = () => {
        if (undoStack.length < 2) {
            return;
        }

        const newStack = undoStack.slice(0);
        newStack.pop();
        if (newStack.length == 0) {
            return;
        }

        const revertState = newStack[newStack.length - 1];
        loadState(revertState);

        setUndoStack(newStack);
    };

    const rows: JSX.Element[] = [];
    for (let i = 0; i < 7; i++) {
        const counts = fetchRowCounts(board, i);
        const sumElements: JSX.Element[] = [];
        counts.forEach((count) => {
            const counterClass = (count % 2 == 0) ? 'crossword-even' : 'crossword-odd';
            const className = `crossword-row-counter ${counterClass}`;
            sumElements.push(<span className={className} key={crypto.randomUUID()}>{count}</span>)
        });
        const row = <div className='crossword-row' key={crypto.randomUUID()}>
            <div className="crossword-row-counter-container" key={crypto.randomUUID()}>
                {sumElements}
            </div>
            {elements.slice(7 * i, 7 * (i + 1))}
        </div>
        rows.push(row);
    }

    const columnCounters: JSX.Element[] = [];
    for (let i = 0; i < 7; i++) {
        const counts = fetchColumnCounts(board, i);
        const sumElements: JSX.Element[] = [];
        counts.forEach((count) => {
            const counterClass = (count % 2 == 0) ? 'crossword-even' : 'crossword-odd';
            const className = `crossword-counter ${counterClass}`;
            sumElements.push(<span key={crypto.randomUUID()} className={className}>{count}</span>)
        });
        columnCounters.push(<div style={{ marginTop: -sumElements.length * 10 }} className='crossword-column-counter-container' key={crypto.randomUUID()}>{sumElements}</div>)
    }
    const counterRow = <div className='crossword-row crossword-counter-row'>{columnCounters}</div>;

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
                {counterRow}
                {rows}
            </div>
            <SidePanel ref={sidepanelRef}
                activeVariant={Variant.Crossword}
                autoSolveClicked={() => { }}
                newGameClicked={startNewGame}
                restartClicked={console.log}
                showAutoSolve={false}
                undoClicked={undoLastMove}
                variantSelected={onVariantChanged}
            ></SidePanel>
            {showWinBanner ? <WinBanner onHideBanner={onHideWinBanner} onNewGame={startNewGame}></WinBanner> : undefined}
        </div>

    )
};

export default Crossword;