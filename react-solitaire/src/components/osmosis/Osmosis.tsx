import './Osmosis.css';
import { useMemo, useRef, useState } from "react";
import CardRow from "../card-row/CardRow";
import DeckStack from "../deck-stack/DeckStack";
import { CardProps, CardSource } from "../playing-card/PlayingCard";
import { DeckBuilder } from "../../shared/deck-builder";
import { Variant } from "../../shared/variants";
import SidePanel, { SidePanelHandles } from "../side-panel/SidePanel";
import { CARD_VALUE_BY_TEXT } from '../../shared/card-values';
import { SolitaireProps } from '../../shared/solitaire-props';

interface OsmosisStateHistory {
    drawDeck?: CardProps[],
    drawPile?: CardProps[],
    reserves?: CardProps[][],
    cardStacks?: CardProps[][]
}

function buildReserves(startingDeck: CardProps[]): CardProps[][] {
    console.log(startingDeck.length)
    const reserves: CardProps[][] = [[], [], [], []];
    for (let i = 0; i < reserves.length; i++) {
        const reserve = reserves[i];
        for (let j = 0; j < 4; j++) {
            const popCard = startingDeck.pop();
            if (!popCard) {
                continue
            }
            popCard.source = CardSource.Reserve;
            reserve.push(popCard);
        }
        reserve[reserve.length - 1].isFaceDown = false;
    }
    return reserves;
}

const Osmosis = ({ onVariantChanged }: SolitaireProps) => {
    const startingDeck = useMemo(DeckBuilder.BuildDeck, []);
    const startingReserves = useMemo<CardProps[][]>(() => buildReserves(startingDeck), []);
    const startingCard = startingDeck.pop() as CardProps;

    const [reserves, setReserves] = useState<CardProps[][]>(startingReserves);
    const [cardStacks, setCardStacks] = useState<CardProps[][]>([[startingCard], [], [], []]);
    const [drawDeck, setDrawDeck] = useState<CardProps[]>(startingDeck.slice(0));
    const [drawPile, setDrawPile] = useState<CardProps[]>([]);
    const [undoStack, setUndoStack] = useState<OsmosisStateHistory[]>([{
        reserves: reserves.map((res) => res.map(r => structuredClone(r))),
        cardStacks: cardStacks.map((stack) => stack.map(card => structuredClone(card))),
        drawDeck: drawDeck.map((card) => structuredClone(card)),
        drawPile: []
    }]);
    const [showWinBanner, setShowWinBanner] = useState<boolean>(false);

    const sidepanelRef = useRef<SidePanelHandles>(null);

    const startNewGame = () => {
        const newDeck = DeckBuilder.BuildDeck();
        const newReservces = buildReserves(newDeck);

        const startingCard = newDeck.pop() as CardProps;
        const newStacks = [[startingCard], [], [], []];
        setCardStacks(newStacks);

        setReserves(newReservces);
        setDrawDeck(newDeck);
        setDrawPile([]);

        updateUndoStack({
            cardStacks: newStacks,
            drawDeck: newDeck,
            drawPile: [],
            reserves: newReservces
        }, true);

        sidepanelRef.current?.setTimerPaused(false);
        sidepanelRef.current?.resetTimer();

        setShowWinBanner(false);
    };

    const updateUndoStack = (sourceData: OsmosisStateHistory, clearStack: boolean = false) => {
        const snapshot: OsmosisStateHistory = {
            cardStacks: (sourceData.cardStacks ?? cardStacks).map(stack => stack.map(card => structuredClone(card))),
            drawDeck: (sourceData.drawDeck ?? drawDeck).map(card => structuredClone(card)),
            drawPile: (sourceData.drawPile ?? drawPile).map(card => structuredClone(card)),
            reserves: (sourceData.reserves ?? reserves).map(reserve => reserve.map(card => structuredClone(card)))
        };

        const newStack = clearStack ? [] : undoStack.slice(0);
        newStack.push(snapshot);
        setUndoStack(newStack);
    };

    const drawCardsClicked = () => {
        let newDeck: CardProps[];
        let newPile: CardProps[];
        if (drawDeck.length == 0) {
            newDeck = drawPile.slice(0).reverse();
            newPile = [];
        }
        else {
            newDeck = drawDeck.slice(0);
            newPile = drawPile.slice();
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

    const canAddCardToStack = (card: CardProps, stackIndex: number): boolean => {
        // Can add any cards to the first stack so long as the suits match.
        if (stackIndex == 0) {
            const compareCard = cardStacks[0][0];
            if (compareCard.suit != card.suit) {
                return false;
            }
        }
        // Otherwise, the dropped card must match the defined suit for the row
        // and the card's face must have already been played in the parent row.
        else {
            const stack = cardStacks[stackIndex];
            // Early exit if suits don't match
            if (stack.length > 0 && stack[0].suit != card.suit) {
                return false;
            }

            // Check if this card belongs in one of its parent's rows
            for (let i = 0; i < stackIndex; i++) {
                if (cardStacks[i].length == 0 || cardStacks[i][0].suit == card.suit) {
                    return false;
                }
            }

            // Otherwise check that the dropped card's face has been placed in the parent card already.
            const parentStack = cardStacks[stackIndex - 1];
            const isCardInParent = parentStack.some((parentCard) => parentCard.text == card.text);
            if (!isCardInParent) {
                return false;
            }
        }
        return true;
    };

    const addCardToStack = (card: CardProps, stackIndex: number) => {
        const snapshot: OsmosisStateHistory = {};

        // Remove card from source
        if (card.source == CardSource.DrawPile) {
            const newPile = drawPile.slice(0)
                .filter((pileCard) => pileCard.suit != card.suit || pileCard.text != card.text);
            setDrawPile(newPile);
            snapshot.drawPile = newPile;
        }
        else if (card.source == CardSource.Reserve) {
            const newReserves = reserves.slice(0);
            for (let i = 0; i < newReserves.length; i++) {
                const newReserve = newReserves[i];
                let foundMatch = false;
                for (let j = 0; j < newReserve.length; j++) {
                    const reserveCard = newReserve[j];
                    if (reserveCard.suit == card.suit && reserveCard.text == card.text) {
                        newReserve.splice(j, 1);
                        foundMatch = true;
                        break;
                    }
                }
                if (foundMatch) {
                    break;
                }
            }
            setReserves(newReserves);
            snapshot.reserves = newReserves;
        }

        // Add card to stack
        card.source = CardSource.CardStack;
        const newStacks = cardStacks.slice(0);
        const newStack = newStacks[stackIndex];
        newStack.push(card);
        newStack.sort((a, b) => CARD_VALUE_BY_TEXT[a.text] - CARD_VALUE_BY_TEXT[b.text]);
        setCardStacks(newStacks);
        snapshot.cardStacks = newStacks;
        updateUndoStack(snapshot);
    };

    const tryAddCardToStack = (card: CardProps, stackIndex: number) => {
        const canAdd = canAddCardToStack(card, stackIndex);
        if (!canAdd) {
            return;
        }

        addCardToStack(card, stackIndex);
    };

    const trySendCardToStacks = (card: CardProps) => {
        for (let i = 0; i < cardStacks.length; i++) {
            if (canAddCardToStack(card, i)) {
                addCardToStack(card, i);
                return;
            }
        }
    };

    const loadState = (revertState: OsmosisStateHistory) => {
        setCardStacks(revertState.cardStacks!.map((stack => stack.map(card => structuredClone(card)))));
        setDrawDeck(revertState.drawDeck!.map(card => structuredClone(card)));
        setDrawPile(revertState.drawPile!.map(card => structuredClone(card)));
        setReserves(revertState.reserves!.map((reserve) => reserve.map(card => structuredClone(card))));
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

    return (
        <div className='osmosis-parent osmosis-row'>
            <div className="osmosis-column osmosis-reserve-column">
                <CardRow allVisible={false} cards={reserves[0]} onCardRightClicked={trySendCardToStacks}></CardRow>
                <CardRow allVisible={false} cards={reserves[1]} onCardRightClicked={trySendCardToStacks}></CardRow>
                <CardRow allVisible={false} cards={reserves[2]} onCardRightClicked={trySendCardToStacks}></CardRow>
                <CardRow allVisible={false} cards={reserves[3]} onCardRightClicked={trySendCardToStacks}></CardRow>
            </div>
            <div className='osmosis-column osmosis-stack-column'>
                <CardRow allowDragging={false} cards={cardStacks[0]} onCardDropped={(card) => tryAddCardToStack(card, 0)}></CardRow>
                <CardRow allowDragging={false} cards={cardStacks[1]} onCardDropped={(card) => tryAddCardToStack(card, 1)}></CardRow>
                <CardRow allowDragging={false} cards={cardStacks[2]} onCardDropped={(card) => tryAddCardToStack(card, 2)}></CardRow>
                <CardRow allowDragging={false} cards={cardStacks[3]} onCardDropped={(card) => tryAddCardToStack(card, 3)}></CardRow>
            </div>
            <div className='osmosis-column osmosis-deck-column'>
                <DeckStack
                    deck={drawDeck}
                    playedCards={drawPile}
                    cardRightClicked={trySendCardToStacks}
                    drawCardsClicked={drawCardsClicked}></DeckStack>
            </div>
            <SidePanel ref={sidepanelRef}
                activeVariant={Variant.Osmosis}
                newGameClicked={startNewGame}
                undoClicked={undoLastMove}
                showAutoSolve={false}
                autoSolveClicked={console.log}
                variantSelected={onVariantChanged}
                restartClicked={console.log}></SidePanel>
        </div>
    )
}

export default Osmosis;