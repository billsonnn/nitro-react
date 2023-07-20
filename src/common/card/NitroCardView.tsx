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
        const newClassNames: string[] = [ 'nitro-card', 'rounded', 'shadow', ];

        newClassNames.push(`theme-${ theme || 'primary' }`);

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ theme, classNames ]);

    /* useEffect(() =>
    {
        if(!uniqueKey || !elementRef || !elementRef.current) return;

        const localStorage = GetLocalStorage<WindowSaveOptions>(`nitro.windows.${ uniqueKey }`);
        const element = elementRef.current;

        if(localStorage && localStorage.size)
        {
            //element.style.width = `${ localStorage.size.width }px`;
            //element.style.height = `${ localStorage.size.height }px`;
        }

        const observer = new ResizeObserver(event =>
        {
            const newStorage = { ...GetLocalStorage<Partial<WindowSaveOptions>>(`nitro.windows.${ uniqueKey }`) } as WindowSaveOptions;

            newStorage.size = { width: element.offsetWidth, height: element.offsetHeight };

            SetLocalStorage<WindowSaveOptions>(`nitro.windows.${ uniqueKey }`, newStorage);
        });

        observer.observe(element);

        return () =>
        {
            observer.disconnect();
        }
    }, [ uniqueKey ]); */

    return (
        <NitroCardContextProvider value={ { theme } }>
            <DraggableWindow uniqueKey={ uniqueKey } handleSelector={ handleSelector } windowPosition={ windowPosition } disableDrag={ disableDrag }>
                <Column innerRef={ elementRef } overflow={ overflow } position={ position } gap={ gap } classNames={ getClassNames } { ...rest } />
            </DraggableWindow>
        </NitroCardContextProvider>
    );
}
