import { FC, useMemo } from 'react';
import { Base, Column, ColumnProps, Flex } from '..';

interface LayoutProgressBarProps extends ColumnProps
{
    text?: string;
    progress: number;
    maxProgress?: number;
}

export const LayoutProgressBar: FC<LayoutProgressBarProps> = props =>
{
    const { text = '', progress = 0, maxProgress = 100, position = 'relative', justifyContent = 'center', classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'border-[1px] border-[solid] border-[#fff] p-[2px] h-[20px] rounded-[.25rem] overflow-hidden bg-[#1E7295]        ', 'text-white' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Column classNames={ getClassNames } justifyContent={ justifyContent } position={ position } { ...rest }>
            { text && (text.length > 0) &&
                <Flex center fit className="[text-shadow:0px_4px_4px_rgba(0,_0,_0,_.25)] z-20" position="absolute">{ text }</Flex> }
            <Base className="h-full z-10 [transition:all_1s] rounded-[.125rem] bg-[repeating-linear-gradient(#2DABC2,_#2DABC2_50%,_#2B91A7_50%,_#2B91A7_100%)]" style={ { width: (~~((((progress - 0) * (100 - 0)) / (maxProgress - 0)) + 0) + '%') } } />
            { children }
        </Column>
    );
};
