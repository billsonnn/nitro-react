import { FC, useMemo } from 'react';
import { Flex, FlexProps } from '../../../common';

export const NitroCardSubHeaderView: FC<FlexProps> = props =>
{
    const { justifyContent = 'center', classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'container-fluid', 'bg-muted', 'p-1' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Flex justifyContent={ justifyContent } classNames={ getClassNames } { ...rest } />
    );
}
