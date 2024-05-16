import { FC, useMemo } from 'react';
import { Base, BaseProps } from '../Base';

interface LayoutItemCountViewProps extends BaseProps<HTMLDivElement>
{
    count: number;
}

export const LayoutItemCountView: FC<LayoutItemCountViewProps> = props =>
{
    const { count = 0, position = 'absolute', classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = ['badge', '!border-[1px] !border-[solid] !border-[#283F5D]', 'border-black', 'bg-danger', 'px-1', 'nitro-item-count'];

        if (classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [classNames]);

    return (
        <Base classNames={getClassNames} position="absolute" {...rest}>
            {count}
            {children}
        </Base>
    );
}
