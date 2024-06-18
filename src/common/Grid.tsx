import { CSSProperties, FC, useMemo } from 'react';
import { Base, BaseProps } from './Base';
import { GridContextProvider } from './GridContext';
import { AlignItemType, AlignSelfType, JustifyContentType, SpacingType } from './types';

export interface GridProps extends BaseProps<HTMLDivElement>
{
    inline?: boolean;
    gap?: SpacingType;
    maxContent?: boolean;
    columnCount?: number;
    center?: boolean;
    alignSelf?: AlignSelfType;
    alignItems?: AlignItemType;
    justifyContent?: JustifyContentType;
}

export const Grid: FC<GridProps> = props =>
{
    const { inline = false, gap = 2, maxContent = false, columnCount = 0, center = false, alignSelf = null, alignItems = null, justifyContent = null, fullHeight = true, classNames = [], style = {}, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [];


        if(inline) newClassNames.push('inline-grid');
        else newClassNames.push('grid grid-rows-[repeat(var(--bs-rows,_1),_1fr)] grid-cols-[repeat(var(--bs-columns,_12),_1fr)]');

        if(gap) newClassNames.push('gap-' + gap);
        else if(gap === 0) newClassNames.push('gap-0');

        if(maxContent) newClassNames.push('[flex-basis:max-content]');

        if(alignSelf) newClassNames.push('self-' + alignSelf);

        if(alignItems) newClassNames.push('items-' + alignItems);

        if(justifyContent) newClassNames.push('justify-' + justifyContent);

        if(!alignItems && !justifyContent && center) newClassNames.push('items-center', 'justify-center');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ inline, gap, maxContent, alignSelf, alignItems, justifyContent, center, classNames ]);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        if(columnCount) newStyle['--bs-columns'] = columnCount.toString();

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ columnCount, style ]);

    return (
        <GridContextProvider value={ { isCssGrid: true } }>
            <Base classNames={ getClassNames } fullHeight={ fullHeight } style={ getStyle } { ...rest } />
        </GridContextProvider>
    );
};
