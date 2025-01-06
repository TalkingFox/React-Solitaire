import './ButtonPanel.css';

export interface ButtonPanelProps {
    newGameClicked: () => void
}

function ButtonPanel({ newGameClicked }: ButtonPanelProps) {
    return (
        <div id='button-panel'>
            <div className='button-column'>
                <button onClick={newGameClicked} className='panel-button'>New Game</button>
            </div>
        </div>
    )
}

export default ButtonPanel;