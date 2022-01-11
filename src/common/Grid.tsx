import { CSSProperties, FC, useMemo } from 'react';
import { Base, BaseProps } from './Base';
import { GridContextProvider } from './context/GridContext';
import { SpacingType } from './types/SpacingType';

export interface GridProps extends BaseProps<HTMLDivElement>
{
    columnCount?: number;
    columnMinWidth?: number;
    columnMinHeight?: number;
    grow?: boolean;
    inline?: boolean;
    gap?: SpacingType;
    maxContent?: boolean;
}

export const Grid: FC<GridProps> = props =>
{
    const { columnCount = 0, columnMinWidth = 40, columnMinHeight = 40, grow = false, inline = false, gap = 2, maxContent = false, classNames = [], style = {}, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [];

        if(!grow) newClassNames.push('h-100');
        else newClassNames.push('flex-basis-fit-content');

        if(inline) newClassNames.push('inline-grid');
        else newClassNames.push('grid');

        if(gap) newClassNames.push('gap-' + gap);

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ grow, inline, gap, classNames ]);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        if(columnCount)
        {
            newStyle['--bs-columns'] = columnCount.toString();
        }

        if(grow && (!columnCount || (columnCount > 1)))
        {
            newStyle['--nitro-grid-column-min-width'] = (columnMinWidth + 'px');
            newStyle['--nitro-grid-column-min-height'] = (columnMinHeight + 'px');
            newStyle.gridTemplateColumns = 'repeat(auto-fill, minmax(var(--nitro-grid-column-min-width, 45px), 1fr)';
        }

        if(maxContent) newStyle.gridTemplateRows = 'max-content';

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ columnCount, columnMinWidth, columnMinHeight, grow, maxContent, style ]);

    return (
        <GridContextProvider value={ { isCssGrid: true } }>
            <Base classNames={ getClassNames } style={ getStyle } { ...rest } />
        </GridContextProvider>
    );
}
