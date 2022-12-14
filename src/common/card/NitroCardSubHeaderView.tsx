import { FC, useMemo } from 'react';
import { Flex, FlexProps } from '..';

interface NitroCardSubHeaderProps extends FlexProps {
    variant?: string;
}
export const NitroCardSubHeaderView: FC<NitroCardSubHeaderProps> = props =>
{
    const { justifyContent = 'center', classNames = [], variant = 'muted', ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'container-fluid', 'p-1' ];

        if(classNames.length) newClassNames.push(...classNames);

        newClassNames.push('bg-' + variant);

        return newClassNames;
    }, [ classNames, variant ]);

    return <Flex justifyContent={ justifyContent } classNames={ getClassNames } { ...rest } />;
}
