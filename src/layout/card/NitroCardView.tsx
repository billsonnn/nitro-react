import { FC } from 'react';
import { DraggableWindow } from '../../hooks/draggable-window/DraggableWindow';
import { NitroCardViewProps } from './NitroCardView.types';

export const NitroCardView: FC<NitroCardViewProps> = props =>
{
    const { className = '' } = props;

    return (
        <DraggableWindow handle=".drag-handler">
            <div className={ 'nitro-card d-flex flex-column ' + className }>
                { props.children }
            </div>
        </DraggableWindow>
    );
}
