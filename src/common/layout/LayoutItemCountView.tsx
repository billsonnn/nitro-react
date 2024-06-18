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
        const newClassNames: string[] = [ 'inline-block px-[.65em] py-[.35em] text-[.75em] font-bold leading-none text-[#fff] text-center whitespace-nowrap align-baseline rounded-[.25rem]', '!border-[1px] !border-[solid] !border-[#283F5D]', 'border-black', 'bg-danger', 'px-1', 'top-[2px] right-[2px] text-[9.5px] px-[3px] py-[2px]        ' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Base classNames={ getClassNames } position="absolute" { ...rest }>
            { count }
            { children }
        </Base>
    );
};
