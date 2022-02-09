import { FC, useMemo } from 'react';
import { Flex, FlexProps } from './Flex';
import { useGridContext } from './GridContext';
import { ColumnSizesType } from './types';

export interface ColumnProps extends FlexProps
{
    size?: ColumnSizesType;
    column?: boolean;
}

export const Column: FC<ColumnProps> = props =>
{
    const { size = 0, column = true, gap = 2, classNames = [], ...rest } = props;
    const { isCssGrid = false } = useGridContext();

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [];

        if(size)
        {
            let colClassName = `col-${ size }`;

            if(isCssGrid) colClassName = `g-${ colClassName }`;

            newClassNames.push(colClassName);
        }

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ size, isCssGrid, classNames ]);

    return <Flex classNames={ getClassNames } column={ column } gap={ gap } { ...rest } />;
}
