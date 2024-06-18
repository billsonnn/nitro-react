import { FC, useMemo } from 'react';
import { Flex, FlexProps } from '../..';

export const NitroCardTabsView: FC<FlexProps> = props =>
{
    const { justifyContent = 'center', gap = 1, classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'justify-center gap-0.5 flex bg-card-tabs min-h-card-tabs max-h-card-tabs pt-1 border-b border-card-border px-2' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Flex classNames={ getClassNames } gap={ gap } justifyContent={ justifyContent } { ...rest }>
            { children }
        </Flex>
    );
};
