import { FC } from 'react';
import { ColorUtils } from '../../../../api';
import { DraggableWindow, DraggableWindowPosition } from '../../../../common';
import { useFurnitureSpamWallPostItWidget } from '../../../../hooks';

const STICKIE_COLORS = [ '9CCEFF', 'FF9CFF', '9CFF9C', 'FFFF33' ];
const STICKIE_COLOR_NAMES = [ 'blue', 'pink', 'green', 'yellow' ];

const getStickieColorName = (color: string) =>
{
    let index = STICKIE_COLORS.indexOf(color);

    if(index === -1) index = 0;

    return STICKIE_COLOR_NAMES[index];
};

export const FurnitureSpamWallPostItView: FC<{}> = props =>
{
    const { objectId = -1, color = '0', setColor = null, text = '', setText = null, canModify = false, onClose = null } = useFurnitureSpamWallPostItWidget();

    if(objectId === -1) return null;

    return (
        <DraggableWindow handleSelector=".drag-handler" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <div className={ 'nitro-stickie nitro-stickie-image stickie-' + getStickieColorName(color) }>
                <div className="flex items-center stickie-header drag-handler">
                    <div className="flex items-center !flex-grow h-full">
                        { canModify &&
                            <>
                                <div className="nitro-stickie-image stickie-trash header-trash" onClick={ onClose }></div>
                                { STICKIE_COLORS.map(color =>
                                {
                                    return <div key={ color } className="stickie-color ms-1" style={ { backgroundColor: ColorUtils.makeColorHex(color) } } onClick={ event => setColor(color) } />;
                                }) }
                            </> }
                    </div>
                    <div className="flex items-center nitro-stickie-image stickie-close header-close" onClick={ onClose }></div>
                </div>
                <div className="stickie-context">
                    <textarea autoFocus className="context-text" tabIndex={ 0 } value={ text } onChange={ event => setText(event.target.value) }></textarea>
                </div>
            </div>
        </DraggableWindow>
    );
};
