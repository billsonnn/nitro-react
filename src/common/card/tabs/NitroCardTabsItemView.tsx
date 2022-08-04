import { FC, useMemo } from 'react';
import { Flex, FlexProps } from '../../Flex';
import { LayoutItemCountView } from '../../layout';

interface NitroCardTabsItemViewProps extends FlexProps
{
    isActive?: boolean;
    count?: number;
}

export const NitroCardTabsItemView: FC<NitroCardTabsItemViewProps> = props =>
{
    const { isActive = false, count = 0, overflow = 'hidden', position = 'relative', pointer = true, classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nav-item', 'rounded-top', 'border' ];

        if(isActive) newClassNames.push('active');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ isActive, classNames ]);

    return (
        <Flex overflow={ overflow } pointer={ pointer } position={ position } classNames={ getClassNames } { ...rest }>
            <Flex shrink center>
                { children }
            </Flex>
            { (count > 0) &&
                <LayoutItemCountView count={ count } /> }
        </Flex>
    );
}
