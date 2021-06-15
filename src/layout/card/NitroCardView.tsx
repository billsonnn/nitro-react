import { FC } from 'react';
import { DraggableWindow } from '../../hooks/draggable-window/DraggableWindow';
import { NitroCardViewProps } from './NitroCardView.types';

export const NitroCardView: FC<NitroCardViewProps> = props =>
{
    const { className = '', simple = false, disableDrag = false, children = null } = props;

    if(simple)
    {
        return (
            <div className={ 'nitro-card d-flex flex-column rounded border shadow overflow-hidden ' + className }>
                { children }
            </div>
        );
    }

    return (
        <div className="nitro-card-responsive">
            <DraggableWindow handle=".drag-handler" disableDrag= { disableDrag }>
                <div className={ 'nitro-card d-flex flex-column rounded border shadow overflow-hidden ' + className }>
                    { children }
                </div>
            </DraggableWindow>
        </div>
    );
}
