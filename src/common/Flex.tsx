import { FC, useMemo } from 'react';
import { Base, BaseProps } from './Base';
import { AlignItemType, AlignSelfType, JustifyContentType, SpacingType } from './types';

export interface FlexProps extends BaseProps<HTMLDivElement>
{
    column?: boolean;
    reverse?: boolean;
    gap?: SpacingType;
    center?: boolean;
    alignSelf?: AlignSelfType;
    alignItems?: AlignItemType;
    justifyContent?: JustifyContentType;
}

export const Flex: FC<FlexProps> = props =>
{
    const { display = 'flex', column = undefined, reverse = false, gap = null, center = false, alignSelf = null, alignItems = null, justifyContent = null, classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [];

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

        if(alignSelf) newClassNames.push('align-self-' + alignSelf);

        if(alignItems) newClassNames.push('align-items-' + alignItems);

        if(justifyContent) newClassNames.push('justify-content-' + justifyContent);

        if(!alignItems && !justifyContent && center) newClassNames.push('align-items-center', 'justify-content-center');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ column, reverse, gap, center, alignSelf, alignItems, justifyContent, classNames ]);

    return <Base display={ display } classNames={ getClassNames } { ...rest } />;
}
