import { CSSProperties, FC, useMemo } from 'react';
import { Base, BaseProps } from './Base';
import { SpacingType } from './types/SpacingType';

export interface GridProps extends BaseProps<HTMLDivElement>
{
    columnCount?: number;
    columnMinWidth?: number;
    grow?: boolean;
    inline?: boolean;
    gap?: SpacingType;
}

export const Grid: FC<GridProps> = props =>
{
    const { columnCount = 0, columnMinWidth = 45, grow = false, inline = false, gap = 2, classNames = [], style = {}, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [];

        if(!grow) newClassNames.push('h-100');

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

        if(grow)
        {
            newStyle['--nitro-grid-column-min-width'] = (columnMinWidth + 'px');
            newStyle.gridTemplateColumns = 'repeat(auto-fill, minmax(var(--nitro-grid-column-min-width, 45px), 1fr)';
        }

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ columnCount, columnMinWidth, grow, style ]);

    return <Base classNames={ getClassNames } style={ getStyle } { ...rest } />;
}
