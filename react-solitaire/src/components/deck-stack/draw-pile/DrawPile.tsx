import { CardSuit } from '../../../shared/enums';
import PlayingCard from '../../playing-card/PlayingCard';
import './DrawPile.css';

function DrawPile() {
    return (
        <div className='draw-pile'>
            <div className='pile-card card-1'>
                <PlayingCard suit={CardSuit.Clubs} text="A"></PlayingCard>
            </div>
            <div className='pile-card card-2'>
                <PlayingCard suit={CardSuit.Diamonds} text="K"></PlayingCard>
            </div>
            <div className='pile-card card-3'>
                <PlayingCard suit={CardSuit.Spades} text="7"></PlayingCard>
            </div>
        </div>
    )
}

export default DrawPile;