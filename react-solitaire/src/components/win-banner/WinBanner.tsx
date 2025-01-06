import Confetti from './Confetti/Confetti';
import './WinBanner.css';

export interface WinBannerProps {
    showConfetti: boolean,
    onHideBanner: () => void
}

function WinBanner({ showConfetti, onHideBanner }: WinBannerProps) {
    const confettiElement = showConfetti ? <Confetti /> : undefined
    return (
        <div id='banner-parent'>
            <div className='banner-container'>
                <div className='banner-text-container'>
                    <span>🎉 YEY! 🎉</span>
                </div>
                <div className='banner-button-container'>
                    <button onClick={onHideBanner} className='banner-button'>Close</button>
                    <button className='banner-button'>Play New Game</button>
                </div>
            </div>
            {confettiElement}
        </div>

    )
}

export default WinBanner;