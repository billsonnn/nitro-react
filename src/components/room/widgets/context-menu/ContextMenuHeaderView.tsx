import { FC, useMemo } from 'react';
import { Flex, FlexProps } from '../../../../common';

export const ContextMenuHeaderView: FC<FlexProps> = props =>
{
    const { justifyContent = 'center', alignItems = 'center', classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'bg-[#3d5f6e] text-[#fff] min-w-[117px] h-[25px] max-h-[25px] text-[16px] mb-[2px]', 'p-1' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return <Flex alignItems={ alignItems } classNames={ getClassNames } justifyContent={ justifyContent } { ...rest } />;
};
