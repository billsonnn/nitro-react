import { FC, useMemo } from 'react';
import { Flex, FlexProps } from '../..';

export const NitroCardTabsView: FC<FlexProps> = props =>
{
    const { justifyContent = 'center', classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'container-fluid', 'nitro-card-tabs', 'pt-1' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Flex justifyContent={ justifyContent } classNames={ getClassNames } { ...rest }>
            <ul className="nav nav-tabs border-0 gap-1">
                { children }
            </ul>
        </Flex>
    );
}
