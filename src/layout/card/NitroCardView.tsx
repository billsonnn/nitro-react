import { FC } from 'react';
import { DraggableWindow } from '../../hooks/draggable-window/DraggableWindow';
import { NitroCardContextProvider } from './context/NitroCardContext';
import { NitroCardViewProps } from './NitroCardView.types';

export const NitroCardView: FC<NitroCardViewProps> = props =>
{
    const { className = '', disableDrag = false, simple = false, theme = 'primary', children = null } = props;

    return (
        <NitroCardContextProvider value={ { theme } }>
            { simple &&
                <div className={ 'nitro-card d-flex flex-column rounded border shadow overflow-hidden ' + className }>
                    { children }
                </div> }
            { !simple &&
                <div className="nitro-card-responsive">
                    <DraggableWindow handle=".drag-handler" disableDrag= { disableDrag }>
                        <div className={ 'nitro-card d-flex flex-column rounded border shadow overflow-hidden ' + className }>
                            { children }
                        </div>
                    </DraggableWindow>
                </div> }
        </NitroCardContextProvider>
    );
}
