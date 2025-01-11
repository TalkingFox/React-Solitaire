import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import './Klondike.css';
import { CardSuit } from '../../shared/enums.ts';
import { CardProps, CardSource } from '../playing-card/PlayingCard.tsx';
import SidePanel, { SidePanelHandles } from '../side-panel/SidePanel.tsx';
import { CARD_TEXT_BY_VALUE, CARD_VALUE_BY_TEXT } from '../../shared/card-values.ts';
import CardColumn from '../card-column/CardColumn.tsx';
import CardStack from '../card-stack/CardStack.tsx';
import DeckStack from '../deck-stack/DeckStack.tsx';
import WinBanner from '../win-banner/WinBanner.tsx';
import { SolitaireProps } from '../../shared/solitaire-props.ts';
import { Variant } from '../../shared/variants.ts';
import { DeckBuilder } from '../../shared/deck-builder.ts';

function buildColumns(startingDeck: CardProps[]) {
    let columns: CardProps[][] = [[], [], [], [], [], [], []]
    for (let i = 0; i < columns.length; i++) {
        for (let j = 0; j + i < columns.length; j++) {
            const currentIndex = i + j;
            const popCard = startingDeck.pop();
            if (!popCard) {
                continue
            }
            popCard.source = CardSource.CardColumn;
            columns[currentIndex].push(popCard);
        }
    }

    columns.forEach((column) => {
        if (column.length == 0) {
            return;
        }
        column[column.length - 1].isFaceDown = false;
    });
    return columns;
}

function canSendCardToStack(card: CardProps, stacks: CardProps[][]): [boolean, CardProps[] | null] {
    let foundMatch: Boolean = false;
    let stackMatch: CardProps[] = [];

    // find appropriate stack
    stacks.forEach((stack: CardProps[]) => {
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

interface KlondikeStateHistory {
    drawDeck?: CardProps[],
    drawPile?: CardProps[],
    cardStacks?: CardProps[][],
    cardColumns?: CardProps[][],
}

function canAutoSolve(currentSnapshot: KlondikeStateHistory): boolean {
    if (!currentSnapshot.cardColumns) {
        return false;
    }
    if ((currentSnapshot.drawDeck ?? []).length > 0) {
        return false;
    }
    if ((currentSnapshot.drawPile ?? []).length > 0) {
        return false;
    }

    for (let i = 0; i < currentSnapshot.cardColumns.length; i++) {
        const column = currentSnapshot.cardColumns[i];
        if (column.some(card => card.isFaceDown ?? true)) {
            return false;
        }
    }

    return true;
}

function Klondike({ onVariantChanged }: SolitaireProps) {
    const startingDeck = useMemo(DeckBuilder.BuildDeck, []);
    const startingColumns = useMemo<CardProps[][]>(() => buildColumns(startingDeck), []);

    const [cardStacks, setCardStacks] = useState<CardProps[][]>([[], [], [], []]);
    const [cardColumns, setCardColumns] = useState<CardProps[][]>(startingColumns);
    const [showWinBanner, setShowWinBanner] = useState(false);
    const [drawDeck, setDrawDeck] = useState<CardProps[]>(startingDeck.slice(0));
    const [drawPile, setDrawPile] = useState<CardProps[]>([]);
    const [undoStack, setUndoStack] = useState<KlondikeStateHistory[]>([
        {
            cardColumns: cardColumns.map((col) => col.map(item => structuredClone(item))),
            cardStacks: cardStacks.map((stack) => stack.map(item => structuredClone(item))),
            drawDeck: drawDeck.map(item => structuredClone(item)),
            drawPile: drawPile.map(item => structuredClone(item))
        }
    ]);
    const [showAutoSolve, setShowAutoSolve] = useState(false);
    const [isSolving, setSolving] = useState(false);
    const solveIntervalRef = useRef<number | null>(null);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const sidepanelRef = useRef<SidePanelHandles>(null);

    const onHideWinBanner = () => {
        sidepanelRef.current?.setTimerPaused(true);
        setShowWinBanner(false);
    };

    const startNewGame = () => {
        const newDeck = DeckBuilder.BuildDeck();
        const newColumns = buildColumns(newDeck);

        setCardColumns(newColumns);

        const newStacks = [[], [], [], []];
        setCardStacks(newStacks);

        setDrawDeck(newDeck);
        setDrawPile([]);

        updateUndoStack({
            cardColumns: newColumns,
            cardStacks: newStacks,
            drawDeck: newDeck,
            drawPile: []
        }, true);

        sidepanelRef.current?.setTimerPaused(false);
        sidepanelRef.current?.resetTimer();

        setShowWinBanner(false);
        setShowAutoSolve(false);
    };

    const updateUndoStack = (sourceData: KlondikeStateHistory, clearStack: boolean = false) => {
        const snapshot: KlondikeStateHistory = {
            cardColumns: (sourceData.cardColumns ?? cardColumns).map((col) => col.map(item => structuredClone(item))),
            cardStacks: (sourceData.cardStacks ?? cardStacks).map((stack) => stack.map(item => structuredClone(item))),
            drawDeck: (sourceData.drawDeck ?? drawDeck).map((item) => structuredClone(item)),
            drawPile: (sourceData.drawPile ?? drawPile).map((item) => structuredClone(item))
        };

        const newStack = clearStack ? [] : undoStack.slice(0);
        newStack.push(snapshot);
        setUndoStack(newStack);
        setShowAutoSolve(
            canAutoSolve(snapshot)
        );
    }

    useEffect(() => {
        const isGameWon = cardStacks.every((cardStack) => {
            return cardStack.length == 13;
        });

        if (!isGameWon) {
            return;
        }

        setShowWinBanner(true);
        sidepanelRef.current?.setTimerPaused(true);
    }, [cardStacks]);

    const columnCardRightClicked = (card: CardProps, columnIndex: number) => {
        const [canSendCard, matchingStack] = canSendCardToStack(card, cardStacks);
        if (!canSendCard || !matchingStack) {
            return;
        }

        // Add card to stack
        const newStacks = cardStacks.slice(0);
        matchingStack.push(card);
        setCardStacks(newStacks);

        // Remove card from column
        const newColumns = cardColumns.slice(0);
        const newColumn = newColumns[columnIndex];
        newColumn.pop();
        if (newColumn.length > 0) {
            newColumn[newColumn.length - 1].isFaceDown = false;
        }
        setCardColumns(newColumns);
        updateUndoStack({
            cardColumns: newColumns,
            cardStacks: newStacks
        });
    };

    function onStackCardDrop(card: CardProps, stackIndex: number) {
        if ((card.children ?? []).length > 0) {
            return;
        }

        const stack = cardStacks[stackIndex];
        const [canSendCard, _] = canSendCardToStack(card, [stack]);
        if (!canSendCard) {
            return;
        }

        // Add card to stack
        const newStacks = cardStacks.slice(0);

        const snapshot: KlondikeStateHistory = {};
        // find card's source and remove it.
        if (card.source == CardSource.DrawPile) {
            const newPile = drawPile.slice(0);
            newPile.pop();
            setDrawPile(newPile);
            snapshot.drawPile = newPile;
        }
        else if (card.source == CardSource.CardColumn) {
            const newColumns = cardColumns.slice(0);
            for (let i = 0; i < newColumns.length; i++) {
                const column = newColumns[i];
                if (column.length == 0) {
                    continue
                }
                const topCard = column[column.length - 1];
                if (card.suit == topCard.suit && card.text == topCard.text) {
                    column.pop();
                    if (column.length > 0) {
                        column[column.length - 1].isFaceDown = false;
                    }
                    setCardColumns(newColumns);
                    snapshot.cardColumns = newColumns;
                    break;
                }
            }
        }
        else if (card.source == CardSource.CardStack) {
            for (let i = 0; i < newStacks.length; i++) {
                const stack = newStacks[i];
                if (stack.length == 0) {
                    continue;
                }
                const topCard = stack[stack.length - 1];
                if (card.suit == topCard.suit && card.text == topCard.text) {
                    stack.pop();
                    setCardStacks(newStacks);
                    break;
                }
            }
        }
        card.source = CardSource.CardStack;
        stack.push(card);
        setCardStacks(newStacks);
        snapshot.cardStacks = newStacks;
        updateUndoStack(snapshot);

    };

    function onColumnCardDrop(card: CardProps, columnIndex: number) {
        const column = cardColumns[columnIndex];
        const topCard = column[column.length - 1];

        let expectedValue = CARD_VALUE_BY_TEXT['K'];
        if (column.length > 0) {

            // check if card can be dropped on the column.
            // Must follow alternating suit and descending value rules.
            const isCardRed = card.suit in [CardSuit.Diamonds, CardSuit.Hearts];
            const isTopCardRed = topCard.suit in [CardSuit.Diamonds, CardSuit.Hearts];
            if (isCardRed == isTopCardRed) {
                return;
            }

            const topCardValue = CARD_VALUE_BY_TEXT[topCard.text];
            expectedValue = topCardValue - 1;
        }

        const expectedText = CARD_TEXT_BY_VALUE[expectedValue];
        if (card.text != expectedText) {
            return;
        }

        const snapshot: KlondikeStateHistory = {};

        // Add card to stack
        const newColumns = cardColumns.slice(0);
        card.isFaceDown = false;

        // find card's source and remove it.
        if (card.source == CardSource.DrawPile) {
            const newPile = drawPile.slice(0);
            newPile.pop();
            setDrawPile(newPile);
            snapshot.drawPile = newPile;
        }
        else if (card.source == CardSource.CardColumn) {
            let sourceTopCard = card;
            const childCards = card.children ?? [];
            let cardsToPop = 1 + childCards.length;

            if (childCards.length > 0) {
                sourceTopCard = childCards[childCards.length - 1];
            }
            for (let i = 0; i < newColumns.length; i++) {
                const column = newColumns[i];
                if (column.length == 0) {
                    continue
                }
                const topCard = column[column.length - 1];
                if (sourceTopCard.suit == topCard.suit && sourceTopCard.text == topCard.text) {
                    for (let j = 0; j < cardsToPop; j++) {
                        column.pop();
                    }
                    if (column.length > 0) {
                        column[column.length - 1].isFaceDown = false;
                    }
                    break;
                }
            }
        }
        else if (card.source == CardSource.CardStack) {
            const newStacks = cardStacks.slice(0);
            for (let i = 0; i < newStacks.length; i++) {
                const stack = newStacks[i];
                if (stack.length == 0) {
                    continue;
                }
                const topCard = stack[stack.length - 1];
                if (card.suit == topCard.suit && card.text == topCard.text) {
                    stack.pop();
                    setCardStacks(newStacks);
                    snapshot.cardStacks = newStacks;
                    break;
                }
            }
        }
        card.source = CardSource.CardColumn
        column.push(card)
        if (card.children) {
            card.children.forEach((childCard) => {
                childCard.source = CardSource.CardColumn;
                column.push(childCard);
            });
        }
        setCardColumns(newColumns);
        snapshot.cardColumns = newColumns;
        updateUndoStack(snapshot);
    };

    const deckCardRightClicked = (card: CardProps) => {
        const [canSendCard, matchingStack] = canSendCardToStack(card, cardStacks);
        if (!canSendCard || !matchingStack) {
            return;
        }

        // Add card to stack
        const newStacks = cardStacks.slice(0);
        matchingStack.push(card);
        setCardStacks(newStacks);

        const newPile = drawPile.slice(0);
        newPile.pop();
        setDrawPile(newPile);
        updateUndoStack({ cardStacks: newStacks, drawPile: newPile });
    };

    const drawCardsClicked = () => {
        let newDeck: CardProps[];
        let newPile: CardProps[];
        if (drawDeck.length == 0) {
            newDeck = drawPile.slice(0).reverse();
            newPile = [];
        }
        else {
            newDeck = drawDeck.slice(0)
            newPile = drawPile.slice(0);
        }

        const poppedCards = [
            newDeck.pop(),
            newDeck.pop(),
            newDeck.pop()
        ].filter(x => x !== null && x !== undefined);
        newPile.push(...poppedCards);

        setDrawDeck(newDeck);
        setDrawPile(newPile);
        updateUndoStack({ drawDeck: newDeck, drawPile: newPile });
    };

    const undoClicked = () => {
        if (undoStack.length < 2) {
            return;
        }

        const newStack = undoStack.slice(0);
        newStack.pop();
        if (newStack.length == 0) {
            return;
        }

        const revertState = newStack[newStack.length - 1];
        setCardColumns(
            revertState.cardColumns!.map((col) => col.map(item => structuredClone(item)))
        );
        setCardStacks(
            revertState.cardStacks!.map((stack) => stack.map(item => structuredClone(item)))
        );

        setDrawDeck(revertState.drawDeck!.map(item => structuredClone(item)));
        setDrawPile(revertState.drawPile!.map(item => structuredClone(item)));

        setUndoStack(newStack);
        setShowAutoSolve(
            canAutoSolve(revertState)
        );
    }

    const solveNextCard = () => {
        if (solveIntervalRef.current) {
            clearInterval(solveIntervalRef.current);
        }
        solveIntervalRef.current = setInterval(() => {
            let allStacksEmpty = true;
            for (let i = 0; i < cardColumns.length; i++) {
                const column = cardColumns[i];
                if (column.length == 0) {
                    continue;
                }
                allStacksEmpty = false;
                const card = column[column.length - 1];
                const [canBank, stack] = canSendCardToStack(card, cardStacks);
                if (!canBank) {
                    continue
                }

                // Remove from column
                column.pop();
                // Add to stack
                stack!.push(card);

                setCardColumns(cardColumns);
                setCardStacks(cardStacks);
                break;
            }
            forceUpdate();


            if (allStacksEmpty) {
                setSolving(false);
                setShowWinBanner(true);
                sidepanelRef.current?.setTimerPaused(true);
                if (solveIntervalRef.current) {
                    clearInterval(solveIntervalRef.current);
                }
            }
        }, 100);
    }

    if (isSolving) {
        solveNextCard();
    }

    const autoSolveClicked = () => {
        setSolving(true);
        solveNextCard();
        setShowAutoSolve(false);
    };

    return (
        <>
            <div className="top-row">
                <DeckStack deck={drawDeck} playedCards={drawPile} cardRightClicked={deckCardRightClicked} drawCardsClicked={drawCardsClicked} />
                <div className="deck-spacer"></div>
                <div className="card-stacks row">
                    <CardStack cards={cardStacks[0]} isDraggable={true} onCardDropped={(card) => onStackCardDrop(card, 0)}></CardStack>
                    <CardStack cards={cardStacks[1]} isDraggable={true} onCardDropped={(card) => onStackCardDrop(card, 1)}></CardStack>
                    <CardStack cards={cardStacks[2]} isDraggable={true} onCardDropped={(card) => onStackCardDrop(card, 2)}></CardStack>
                    <CardStack cards={cardStacks[3]} isDraggable={true} onCardDropped={(card) => onStackCardDrop(card, 3)}></CardStack>
                </div>
            </div>
            <div>
                <div className='card-columns'>
                    <CardColumn cards={cardColumns[0]} cardRightClicked={(card) => columnCardRightClicked(card, 0)} onCardDropped={(card) => onColumnCardDrop(card, 0)}></CardColumn>
                    <CardColumn cards={cardColumns[1]} cardRightClicked={(card) => columnCardRightClicked(card, 1)} onCardDropped={(card) => onColumnCardDrop(card, 1)}></CardColumn>
                    <CardColumn cards={cardColumns[2]} cardRightClicked={(card) => columnCardRightClicked(card, 2)} onCardDropped={(card) => onColumnCardDrop(card, 2)}></CardColumn>
                    <CardColumn cards={cardColumns[3]} cardRightClicked={(card) => columnCardRightClicked(card, 3)} onCardDropped={(card) => onColumnCardDrop(card, 3)}></CardColumn>
                    <CardColumn cards={cardColumns[4]} cardRightClicked={(card) => columnCardRightClicked(card, 4)} onCardDropped={(card) => onColumnCardDrop(card, 4)}></CardColumn>
                    <CardColumn cards={cardColumns[5]} cardRightClicked={(card) => columnCardRightClicked(card, 5)} onCardDropped={(card) => onColumnCardDrop(card, 5)}></CardColumn>
                    <CardColumn cards={cardColumns[6]} cardRightClicked={(card) => columnCardRightClicked(card, 6)} onCardDropped={(card) => onColumnCardDrop(card, 6)}></CardColumn>
                </div>
            </div>
            <SidePanel ref={sidepanelRef} activeVariant={Variant.Klondike} newGameClicked={startNewGame} undoClicked={undoClicked} showAutoSolve={showAutoSolve} autoSolveClicked={autoSolveClicked} variantSelected={onVariantChanged}></SidePanel>
            {showWinBanner ? <WinBanner onHideBanner={onHideWinBanner} onNewGame={startNewGame}></WinBanner> : undefined}
        </>
    )
}

export default Klondike;
