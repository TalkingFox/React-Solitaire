import './PauseModal.css';

export interface PauseModalProps {
    resumeGameClicked: () => void
};

const PauseModal = ({ resumeGameClicked }: PauseModalProps) => {
    return (<div id='pause-parent'>
        <div className='pause-container'>
            <div className='pause-text-container'>
                <span>⏳ Game Paused ⏳</span>
            </div>
            <div className='pause-button-container'>
                <button onClick={resumeGameClicked} className='pause-button'>Resume Game</button>
            </div>
        </div>
    </div>)
};

export default PauseModal;