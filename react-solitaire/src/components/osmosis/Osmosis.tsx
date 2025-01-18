import './Osmosis.css';
import { useMemo, useRef, useState } from "react";
import CardRow from "../card-row/CardRow";
import DeckStack from "../deck-stack/DeckStack";
import { CardProps, CardSource } from "../playing-card/PlayingCard";
import { DeckBuilder } from "../../shared/deck-builder";
import { Variant } from "../../shared/variants";
import SidePanel, { SidePanelHandles } from "../side-panel/SidePanel";

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

const Osmosis = () => {
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

    const sidepanelRef = useRef<SidePanelHandles>(null);


    return (
        <div className='osmosis-parent'>
            <div className="osmosis-row">
                <CardRow allVisible={false} cards={reserves[0]}></CardRow>
                <CardRow cards={cardStacks[0]}></CardRow>
                <div className='osmosis-spacer'></div>
                <DeckStack deck={drawDeck} playedCards={drawPile} cardRightClicked={console.log} drawCardsClicked={console.log}></DeckStack>
            </div>
            <div className="osmosis-row">
                <CardRow allVisible={false} cards={reserves[1]}></CardRow>
                <CardRow cards={cardStacks[1]}></CardRow>
            </div>
            <div className="osmosis-row">
                <CardRow allVisible={false} cards={reserves[2]}></CardRow>
                <CardRow cards={cardStacks[2]}></CardRow>
            </div>
            <div className="osmosis-row">
                <CardRow allVisible={false} cards={reserves[3]}></CardRow>
                <CardRow cards={cardStacks[3]}></CardRow>
            </div>
            <SidePanel ref={sidepanelRef} activeVariant={Variant.Osmosis} newGameClicked={console.log} undoClicked={console.log} showAutoSolve={false} autoSolveClicked={console.log} variantSelected={console.log} restartClicked={console.log}></SidePanel>
        </div>
    )
}

export default Osmosis;