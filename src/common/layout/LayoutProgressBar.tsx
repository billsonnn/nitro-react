import { FC, useMemo } from 'react';
import { Column, ColumnProps } from '../Column';

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
        const newClassNames: string[] = [ 'nitro-progress-bar', 'text-white' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Column classNames={ getClassNames } justifyContent={ justifyContent } position={ position } { ...rest }>
            { text && (text.length > 0) &&
                <div className="flex items-center justify-center size-full p-absolute nitro-progress-bar-text small">{ text }</div> }
            <div className="nitro-progress-bar-inner" style={ { width: (~~((((progress - 0) * (100 - 0)) / (maxProgress - 0)) + 0) + '%') } } />
            { children }
        </Column>
    );
}
