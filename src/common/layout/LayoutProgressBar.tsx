import { FC, useMemo } from 'react';
import { Base } from '../Base';
import { Column, ColumnProps } from '../Column';
import { Flex } from '../Flex';

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
        <Column position={ position } justifyContent={ justifyContent } classNames={ getClassNames } { ...rest }>
            { text && (text.length > 0) &&
                <Flex fit center position="absolute" className="nitro-progress-bar-text small">{ text }</Flex> }
            <Base className="nitro-progress-bar-inner" style={ { width: (~~((((progress - 0) * (100 - 0)) / (maxProgress - 0)) + 0) + '%') } } />
            { children }
        </Column>
    );
}
