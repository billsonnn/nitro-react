import { FC, useMemo } from 'react';
import { Base, BaseProps } from './Base';
import { AlignItemType } from './types/AlignItemType';
import { JustifyContentType } from './types/JustifyContentType';
import { SpacingType } from './types/SpacingType';

export interface FlexProps extends BaseProps<HTMLDivElement>
{
    inline?: boolean;
    column?: boolean;
    reverse?: boolean;
    gap?: SpacingType;
    center?: boolean;
    alignItems?: AlignItemType;
    justifyContent?: JustifyContentType;
}

export const Flex: FC<FlexProps> = props =>
{
    const { inline = false, column = undefined, reverse = false, gap = null, center = false, alignItems = null, justifyContent = null, classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [];

        if(inline) newClassNames.push('d-inline-flex');
        else newClassNames.push('d-flex');

        if(column)
        {
            if(reverse) newClassNames.push('flex-column-reverse');
            else newClassNames.push('flex-column');
        }
        else
        {
            if(reverse) newClassNames.push('flex-row-reverse');
        }

        if(gap) newClassNames.push('gap-' + gap);

        if(alignItems) newClassNames.push('align-items-' + alignItems);

        if(justifyContent) newClassNames.push('justify-content-' + justifyContent);

        if(!alignItems && !justifyContent && center) newClassNames.push('align-items-center', 'justify-content-center');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ inline, column, reverse, gap, center, alignItems, justifyContent, classNames ]);

    return <Base classNames={ getClassNames } { ...rest } />;
}
