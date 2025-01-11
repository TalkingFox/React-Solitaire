import { useMemo, useRef, useState } from 'react';
import { SolitaireProps } from '../../shared/solitaire-props';
import { Variant } from '../../shared/variants';
import CardColumn from '../card-column/CardColumn';
import CardStack from '../card-stack/CardStack';
import SidePanel, { SidePanelHandles } from '../side-panel/SidePanel';
import WinBanner from '../win-banner/WinBanner';
import './Freecell.css';
import { CardProps, CardSource } from '../playing-card/PlayingCard';
import { DeckBuilder } from '../../shared/deck-builder';
import { CARD_VALUE_BY_TEXT, CARD_TEXT_BY_VALUE } from '../../shared/card-values';
import { CardSuit } from '../../shared/enums';
import FreeStack from '../free-stack/FreeStack';

function buildColumns(startingDeck: CardProps[]) {
    let columns: CardProps[][] = [[], [], [], [], [], [], [], []]
    while (startingDeck.length > 0) {
        for (let i = 0; i < columns.length; i++) {
            const popCard = startingDeck.pop();
            if (!popCard) {
                break;
            }
            popCard.isFaceDown = false;
            popCard.source = CardSource.CardColumn;
            columns[i].push(popCard);
        }
    }
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

function Freecell({ onVariantChanged }: SolitaireProps) {
    const startingDeck = useMemo(DeckBuilder.BuildDeck, []);
    const startingColumns = useMemo<CardProps[][]>(() => buildColumns(startingDeck), []);

    const [cardStacks, setCardStacks] = useState<CardProps[][]>([[], [], [], []]);
    const [freeCells, setFreeCells] = useState<(CardProps | null)[]>(new Array(4).fill(null));
    const [cardColumns, setCardColumns] = useState<CardProps[][]>(startingColumns);
    const [showWinBanner, setShowWinBanner] = useState(false);

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

        const newCells = new Array(4).fill(null);
        setFreeCells(newCells);

        // updateUndoStack({
        //     cardColumns: newColumns,
        //     cardStacks: newStacks,
        //     drawDeck: newDeck,
        //     drawPile: []
        // }, true);

        sidepanelRef.current?.setTimerPaused(false);
        sidepanelRef.current?.resetTimer();

        setShowWinBanner(false);
        // setShowAutoSolve(false);
    };

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
        // updateUndoStack({
        //     cardColumns: newColumns,
        //     cardStacks: newStacks
        // });
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

        // const snapshot: StateHistory = {};
        // find card's source and remove it.
        if (card.source == CardSource.CardColumn) {
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
                    // snapshot.cardColumns = newColumns;
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
        // snapshot.cardStacks = newStacks;
        // updateUndoStack(snapshot);

    };

    function onColumnCardDrop(card: CardProps, columnIndex: number) {
        const column = cardColumns[columnIndex];
        const topCard = column[column.length - 1];

        // Limit the number of dropped cards by the number of empty columns and cells present.
        const emptyFreecells = freeCells.filter((cell) => cell == null).length;
        let emptyColumns = cardColumns.filter((col) => col.length == 0).length;
        if (column.length == 0) {
            emptyColumns--;
        }
        const movingCardsLimit = (1 + emptyFreecells) * Math.pow(2, emptyColumns);
        const movingCards = 1 + (card.children ?? []).length;
        console.log(`Moving Cards: ${movingCards}. Limit: ${movingCardsLimit}`);
        if (movingCards > movingCardsLimit) {
            return;
        }

        // any card can be placed on an empty column in Freecell
        if (column.length > 0) {
            // check if card can be dropped on the column.
            // Must follow alternating suit and descending value rules.
            const isCardRed = card.suit in [CardSuit.Diamonds, CardSuit.Hearts];
            const isTopCardRed = topCard.suit in [CardSuit.Diamonds, CardSuit.Hearts];
            if (isCardRed == isTopCardRed) {
                return;
            }

            const topCardValue = CARD_VALUE_BY_TEXT[topCard.text];
            const expectedValue = topCardValue - 1;
            const expectedText = CARD_TEXT_BY_VALUE[expectedValue];
            if (card.text != expectedText) {
                return;
            }
        }

        // const snapshot: StateHistory = {};

        // Add card to stack
        const newColumns = cardColumns.slice(0);
        card.isFaceDown = false;

        // find card's source and remove it.
        if (card.source == CardSource.CardColumn) {
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
        else if (card.source == CardSource.FreeStack) {
            const newCells = freeCells.slice(0);
            const sourceIndex = newCells.findIndex((freeCard) => freeCard != null && freeCard.suit == card.suit && freeCard.text == card.text);
            newCells[sourceIndex] = null;
            setFreeCells(newCells);
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
        // snapshot.cardColumns = newColumns;
        // updateUndoStack(snapshot);
    };

    function onFreeStackCardDrop(card: CardProps, stackIndex: number) {
        console.log('onFreeStackCardDrop');
        if ((card.children ?? []).length > 0) {
            return;
        }

        const stackCard = freeCells[stackIndex];
        if (stackCard) {
            return;
        }

        const newCells = freeCells.slice(0);

        // const snapshot = 'todo';
        if (card.source == CardSource.CardColumn) {
            const newColumns = cardColumns.slice(0);
            for (let i = 0; i < newColumns.length; i++) {
                const column = newColumns[i];
                if (column.length == 0) {
                    continue;
                }
                const topCard = column[column.length - 1];
                if (card.suit == topCard.suit && card.text == topCard.text) {
                    column.pop();
                    setCardColumns(newColumns);
                    // const snapshot = 'todo'
                    break;
                }
            }
        }
        else if (card.source == CardSource.FreeStack) {
            const sourceIndex = newCells
                .findIndex((freeCard) => freeCard != null && freeCard.text == card.text && freeCard.suit == card.suit);
            newCells[sourceIndex] = null;
        }

        newCells[stackIndex] = card;
        setFreeCells(newCells);
    }

    return (
        <>
            <div className="top-row">
                <div className="free-cells row">
                    <FreeStack card={freeCells[0]} onCardDropped={(card) => onFreeStackCardDrop(card, 0)}></FreeStack>
                    <FreeStack card={freeCells[1]} onCardDropped={(card) => onFreeStackCardDrop(card, 1)}></FreeStack>
                    <FreeStack card={freeCells[2]} onCardDropped={(card) => onFreeStackCardDrop(card, 2)}></FreeStack>
                    <FreeStack card={freeCells[3]} onCardDropped={(card) => onFreeStackCardDrop(card, 3)}></FreeStack>
                </div>
                <div className='bank-spacer'></div>
                <div className="card-stacks row">
                    <CardStack isDraggable={false} cards={cardStacks[0]} onCardDropped={(card) => onStackCardDrop(card, 0)}></CardStack>
                    <CardStack isDraggable={false} cards={cardStacks[1]} onCardDropped={(card) => onStackCardDrop(card, 1)}></CardStack>
                    <CardStack isDraggable={false} cards={cardStacks[2]} onCardDropped={(card) => onStackCardDrop(card, 2)}></CardStack>
                    <CardStack isDraggable={false} cards={cardStacks[3]} onCardDropped={(card) => onStackCardDrop(card, 3)}></CardStack>
                </div>
            </div><div>
                <div className='card-columns'>
                    <div className='column-spacer'></div>
                    <CardColumn cards={cardColumns[0]} cardRightClicked={(card) => columnCardRightClicked(card, 0)} onCardDropped={(card) => onColumnCardDrop(card, 0)}></CardColumn>
                    <CardColumn cards={cardColumns[1]} cardRightClicked={(card) => columnCardRightClicked(card, 1)} onCardDropped={(card) => onColumnCardDrop(card, 1)}></CardColumn>
                    <CardColumn cards={cardColumns[2]} cardRightClicked={(card) => columnCardRightClicked(card, 2)} onCardDropped={(card) => onColumnCardDrop(card, 2)}></CardColumn>
                    <CardColumn cards={cardColumns[3]} cardRightClicked={(card) => columnCardRightClicked(card, 3)} onCardDropped={(card) => onColumnCardDrop(card, 3)}></CardColumn>
                    <CardColumn cards={cardColumns[4]} cardRightClicked={(card) => columnCardRightClicked(card, 4)} onCardDropped={(card) => onColumnCardDrop(card, 4)}></CardColumn>
                    <CardColumn cards={cardColumns[5]} cardRightClicked={(card) => columnCardRightClicked(card, 5)} onCardDropped={(card) => onColumnCardDrop(card, 5)}></CardColumn>
                    <CardColumn cards={cardColumns[6]} cardRightClicked={(card) => columnCardRightClicked(card, 6)} onCardDropped={(card) => onColumnCardDrop(card, 6)}></CardColumn>
                    <CardColumn cards={cardColumns[7]} cardRightClicked={(card) => columnCardRightClicked(card, 7)} onCardDropped={(card) => onColumnCardDrop(card, 7)}></CardColumn>
                </div>
            </div><SidePanel ref={sidepanelRef} activeVariant={Variant.Freecell} newGameClicked={startNewGame} undoClicked={console.log} showAutoSolve={false} autoSolveClicked={console.log} variantSelected={onVariantChanged}></SidePanel>
            {showWinBanner ? <WinBanner onHideBanner={onHideWinBanner} onNewGame={startNewGame}></WinBanner> : undefined}
        </>

    );
}

export default Freecell;