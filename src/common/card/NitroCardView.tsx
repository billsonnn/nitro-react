import { FC, useMemo } from 'react';
import { Column, ColumnProps } from '..';
import { DraggableWindow, DraggableWindowPosition, DraggableWindowProps } from '../draggable-window';
import { NitroCardContextProvider } from './NitroCardContext';

export interface NitroCardViewProps extends DraggableWindowProps, ColumnProps
{
    simple?: boolean;
    theme?: string;
}

export const NitroCardView: FC<NitroCardViewProps> = props =>
{
    const { simple = false, theme = 'primary', uniqueKey = null, handleSelector = '.drag-handler', windowPosition = DraggableWindowPosition.CENTER, disableDrag = false, overflow = 'hidden', position = 'relative', gap = 0, classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-card', 'rounded', 'shadow', ];

        if(simple) newClassNames.push('bg-tertiary-split');

        newClassNames.push(`theme-${ theme || 'primary' }`);

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ simple, theme, classNames ]);

    return (
        <NitroCardContextProvider value={ { theme, simple } }>
            <DraggableWindow uniqueKey={ uniqueKey } handleSelector={ handleSelector } windowPosition={ windowPosition } disableDrag={ disableDrag }>
                <Column overflow={ overflow } position={ position } gap={ gap } classNames={ getClassNames } { ...rest } />
            </DraggableWindow>
        </NitroCardContextProvider>
    );
}
