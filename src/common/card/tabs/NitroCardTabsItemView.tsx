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
        const newClassNames: string[] = [ 'overflow-hidden relative cursor-pointer rounded-t-md flex bg-card-tab-item px-3 py-1 z-[1] border-card-border border-t border-l border-r before:absolute before:w-[93%] before:h-[3px] before:rounded-md before:top-[1.5px] before:left-0 before:right-0 before:m-auto before:z-[1] before:bg-[#C2C9D1]',
            isActive && 'bg-card-tab-item-active -mb-[1px] before:bg-white' ];

        //if (isActive) newClassNames.push('bg-[#dfdfdf] border-b-[1px_solid_black]');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ isActive, classNames ]);

    return (
        <Flex classNames={ getClassNames } overflow={ overflow } pointer={ pointer } position={ position } { ...rest }>
            <Flex center shrink>
                { children }
            </Flex>
            { (count > 0) &&
                <LayoutItemCountView count={ count } /> }
        </Flex>
    );
};
