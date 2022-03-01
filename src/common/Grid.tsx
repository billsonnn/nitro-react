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
        else newClassNames.push('grid');

        if(gap) newClassNames.push('gap-' + gap);
        else if(gap === 0) newClassNames.push('gap-0');

        if(maxContent) newClassNames.push('flex-basis-max-content');

        if(alignSelf) newClassNames.push('align-self-' + alignSelf);

        if(alignItems) newClassNames.push('align-items-' + alignItems);

        if(justifyContent) newClassNames.push('justify-content-' + justifyContent);

        if(!alignItems && !justifyContent && center) newClassNames.push('align-items-center', 'justify-content-center');

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
            <Base fullHeight={ fullHeight } classNames={ getClassNames } style={ getStyle } { ...rest } />
        </GridContextProvider>
    );
}
