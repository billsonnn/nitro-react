import { FC, useEffect, useState } from 'react';
import { ColorUtils } from '../../../../api';
import { DraggableWindow, DraggableWindowPosition } from '../../../../common';
import { useFurnitureStickieWidget } from '../../../../hooks';

const STICKIE_COLORS = [ '9CCEFF','FF9CFF', '9CFF9C','FFFF33' ];
const STICKIE_COLOR_NAMES = [ 'blue', 'pink', 'green', 'yellow' ];

const getStickieColorName = (color: string) =>
{
    let index = STICKIE_COLORS.indexOf(color);

    if(index === -1) index = 0;

    return STICKIE_COLOR_NAMES[index];
}

export const FurnitureStickieView: FC<{}> = props =>
{
    const { objectId = -1, color = '0', text = '', canModify = false, updateColor = null, updateText = null, trash = null, onClose = null } = useFurnitureStickieWidget();
    const [ isEditing, setIsEditing ] = useState(false);

    useEffect(() =>
    {
        setIsEditing(false);
    }, [ objectId, color, text ]);

    if(objectId === -1) return null;

    return (
        <DraggableWindow handleSelector=".drag-handler" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <div className={ 'nitro-stickie nitro-stickie-image stickie-' + getStickieColorName(color) }>
                <div className="d-flex align-items-center stickie-header drag-handler">
                    <div className="d-flex align-items-center flex-grow-1 h-100">
                        { canModify && 
                        <>
                            <div className="nitro-stickie-image stickie-trash header-trash" onClick={ trash }></div>
                            { STICKIE_COLORS.map(color =>
                            {
                                return <div key={ color } className="stickie-color ms-1" onClick={ event => updateColor(color) } style={ { backgroundColor: ColorUtils.makeColorHex(color) } } />
                            }) }
                        </> }
                    </div>
                    <div className="d-flex align-items-center nitro-stickie-image stickie-close header-close" onClick={ onClose }></div>
                </div>
                <div className="stickie-context">
                    { !isEditing ? <div className="context-text" onClick={ event => setIsEditing(true) }>{ text }</div> : <textarea className="context-text" defaultValue={ text } tabIndex={ 0 } onBlur={ event => updateText(event.target.value) } autoFocus></textarea> }
                </div>
            </div>
        </DraggableWindow>
    );
}
