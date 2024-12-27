import './CardCenter.css'

interface CardFace {
    symbol: String,
    color?: String,
    face?: String,
    numberOfElements: number
}

interface Column {
    class: string,
    elementCount: number,
    elementClass?: string,
    applyClassToSecondHalf?: boolean
}

function CardCenter({ symbol, face, numberOfElements }: CardFace) {
    if (face) {
        return <>
            <div className='card-center card-center--centered'>
                <span className='card-face'>{symbol}</span>
            </div>
        </>
    }

    let columns: Column[] = []
    switch (numberOfElements) {
        case 2:
        case 3:
            columns.push({ class: 'card-column', elementCount: numberOfElements })
            break;
        case 4:
        case 6:
            columns.push({ class: 'card-column', elementCount: numberOfElements / 2 });
            columns.push({ class: 'card-column', elementCount: numberOfElements / 2 });
            break;
        case 5:
        case 7:
        case 9:
            columns.push({ class: 'card-column', elementCount: Math.floor(numberOfElements / 2), elementClass: 'card-symbol-rotated', applyClassToSecondHalf: true })
            columns.push({ class: 'card-column card-column--centered', elementCount: 1 })
            columns.push({ class: 'card-column', elementCount: Math.floor(numberOfElements / 2), elementClass: 'card-symbol-rotated', applyClassToSecondHalf: true })
            break;
        case 8:
        case 10:
            columns.push({ class: 'card-column', elementCount: Math.floor((numberOfElements - 1) / 2), elementClass: 'card-symbol-rotated', applyClassToSecondHalf: true })
            columns.push({ class: 'card-column card-column--centered', elementCount: 2, elementClass: 'card-symbol-big' })
            columns.push({ class: 'card-column', elementCount: Math.floor((numberOfElements - 1) / 2), elementClass: 'card-symbol-rotated', applyClassToSecondHalf: true })
            break;
    }

    let parentClassName = 'card-center';
    if (columns.length == 1) {
        parentClassName += ' card-center--centered';
    }

    return (
        <>
            <div className={parentClassName}>
                {
                    columns.map(column => {
                        return (
                            <div className={column.class}>
                                {
                                    [...Array(column.elementCount)].map((_, index) => {
                                        let className = '';
                                        if (column.applyClassToSecondHalf && index >= Math.ceil(column.elementCount / 2)) {
                                            className = column.elementClass ?? '';
                                        }
                                        return (<span className={className}>{symbol}</span>)
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default CardCenter