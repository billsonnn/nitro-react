import { FC, useMemo } from 'react';
import { Flex, FlexProps } from './Flex';
import { ColumnSizesType } from './types/ColumnSizesType';

export interface ColumnProps extends FlexProps
{
    size?: ColumnSizesType;
}

export const Column: FC<ColumnProps> = props =>
{
    const { size = 0, gap = 2, classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [];

        if(size) newClassNames.push('g-col-' + size);

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ size, classNames ]);

    return <Flex classNames={ getClassNames } column={ true } gap={ gap } { ...rest } />;
}
