import { FC, useMemo } from 'react';
import { Flex, FlexProps } from './Flex';
import { ColumnSizesType } from './types/ColumnSizesType';

export interface ColumnProps extends FlexProps
{
    size?: ColumnSizesType;
    column?: boolean;
}

export const Column: FC<ColumnProps> = props =>
{
    const { size = 0, column = true, gap = 2, classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [];

        if(size) newClassNames.push('g-col-' + size);

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ size, classNames ]);

    return <Flex classNames={ getClassNames } column={ column } gap={ gap } { ...rest } />;
}
