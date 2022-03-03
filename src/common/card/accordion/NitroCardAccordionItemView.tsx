import { FC, useMemo } from 'react';
import { Flex, FlexProps } from '../..';

export const NitroCardAccordionItemView: FC<FlexProps> = props =>
{
    const { alignItems = 'center', gap = 1, classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'px-2, py-1' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Flex alignItems={ alignItems } gap={ gap } classNames={ getClassNames } { ...rest }>
            { children }
        </Flex>
    );
}
