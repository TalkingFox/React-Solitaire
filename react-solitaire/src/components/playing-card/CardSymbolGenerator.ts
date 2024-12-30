import { CardSuit } from "../../shared/enums";

export function GetSymbolAndColorFromSuit(suit: CardSuit): [String, String] {
    let cardColor = "red";
    let cardEmoji = "🐰";
    switch (suit) {
        case CardSuit.Clubs:
            cardEmoji = "♣";
            cardColor = "black";
            break;
        case CardSuit.Spades:
            cardEmoji = "♠";
            cardColor = "black";
            break;
        case CardSuit.Diamonds:
            cardEmoji = "♦";
            cardColor = "red";
            break;
        case CardSuit.Hearts:
            cardEmoji = "♥";
            cardColor = "red";
            break;
    }
    return [cardEmoji, cardColor]
}