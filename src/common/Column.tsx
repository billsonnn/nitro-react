import { FC, useMemo } from 'react';
import { Flex, FlexProps } from './Flex';
import { useGridContext } from './GridContext';
import { ColumnSizesType } from './types';

export interface ColumnProps extends FlexProps
{
    size?: ColumnSizesType;
    offset?: ColumnSizesType;
    column?: boolean;
}

export const Column: FC<ColumnProps> = props =>
{
    const { size = 0, offset = 0, column = true, gap = 2, classNames = [], ...rest } = props;
    const { isCssGrid = false } = useGridContext();

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [];

        if (size)
        {
            let colClassName = `col-span-${size}`;

            if (isCssGrid) colClassName = `${colClassName}`;

            newClassNames.push(colClassName);
        }

        if (offset)
        {
            let colClassName = `offset-${offset}`;

            if (isCssGrid) colClassName = `g-start-${offset}`;

            newClassNames.push(colClassName);
        }

        if (classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [size, offset, isCssGrid, classNames]);

    return <Flex classNames={getClassNames} column={column} gap={gap} {...rest} />;
}
