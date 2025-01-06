import { useState } from 'react';
import Confetti from './Confetti/Confetti';
import './WinBanner.css';

export interface WinBannerProps {
    onHideBanner: () => void,
    onNewGame: () => void
}

function WinBanner({ onHideBanner, onNewGame }: WinBannerProps) {
    const [showConfetti, setShowConfetti] = useState(true);
    setTimeout(() => { setShowConfetti(false) }, 10000);

    const confettiElement = showConfetti ? <Confetti /> : undefined
    return (
        <div id='banner-parent'>
            <div className='banner-container'>
                <div className='banner-text-container'>
                    <span>🎉 YEY! 🎉</span>
                </div>
                <div className='banner-button-container'>
                    <button onClick={onHideBanner} className='banner-button'>Close</button>
                    <button onClick={onNewGame} className='banner-button'>Play New Game</button>
                </div>
            </div>
            {confettiElement}
        </div>

    )
}

export default WinBanner;