import { FC } from 'react';
import { DraggableWindow } from '../draggable-window/DraggableWindow';
import { NitroCardContextProvider } from './context/NitroCardContext';
import { NitroCardViewProps } from './NitroCardView.types';

export const NitroCardView: FC<NitroCardViewProps> = props =>
{
    const { className = '', simple = false, theme = 'primary', children = null, ...rest } = props;

    return (
        <NitroCardContextProvider value={ { theme, simple } }>
            <div className="nitro-card-responsive">
                <DraggableWindow { ...rest }>
                    <div className={ `nitro-card d-flex flex-column rounded shadow overflow-hidden theme-${theme} ${className}` }>
                        { children }
                    </div>
                </DraggableWindow>
            </div>
        </NitroCardContextProvider>
    );
}
