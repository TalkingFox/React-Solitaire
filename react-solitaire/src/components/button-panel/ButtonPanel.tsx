import './ButtonPanel.css';

export interface ButtonPanelProps {
    newGameClicked: () => void,
    undoClicked: () => void
}

function ButtonPanel({ newGameClicked, undoClicked }: ButtonPanelProps) {
    return (
        <div id='button-panel'>
            <div className='button-column'>
                <button onClick={newGameClicked} className='panel-button'>New Game</button>
                <button onClick={undoClicked} className='panel-button'>Undo Move</button>
            </div>
        </div>
    )
}

export default ButtonPanel;