import { FC, useMemo, useRef } from 'react';
import { Column, ColumnProps } from '..';
import { DraggableWindow, DraggableWindowPosition, DraggableWindowProps } from '../draggable-window';
import { NitroCardContextProvider } from './NitroCardContext';

export interface NitroCardViewProps extends DraggableWindowProps, ColumnProps
{
    theme?: string;
}

export const NitroCardView: FC<NitroCardViewProps> = props =>
{
    const { theme = 'primary', uniqueKey = null, handleSelector = '.drag-handler', windowPosition = DraggableWindowPosition.CENTER, disableDrag = false, overflow = 'hidden', position = 'relative', gap = 0, classNames = [], ...rest } = props;
    const elementRef = useRef<HTMLDivElement>();

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'resize', 'rounded', 'shadow', ];

        // Card Theme Changer
        newClassNames.push('border-[1px] border-[#283F5D]');



        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <NitroCardContextProvider value={ { theme } }>
            <DraggableWindow disableDrag={ disableDrag } handleSelector={ handleSelector } uniqueKey={ uniqueKey } windowPosition={ windowPosition }>
                <Column classNames={ getClassNames } gap={ gap } innerRef={ elementRef } overflow={ overflow } position={ position } { ...rest } />
            </DraggableWindow>
        </NitroCardContextProvider>
    );
};
