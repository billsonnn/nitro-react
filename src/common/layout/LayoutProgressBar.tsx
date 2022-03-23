import { FC, useMemo } from 'react';
import { Base, BaseProps, Flex } from '..';

interface LayoutProgressBarProps extends BaseProps<HTMLDivElement>
{
    text: string;
    progress: number;
    maxProgress?: number;
}

export const LayoutProgressBar: FC<LayoutProgressBarProps> = props =>
{
    const { text = '', progress = 0, maxProgress = 0, position = 'relative', classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'progress', 'text-black' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Base position={ position } classNames={ getClassNames } { ...rest }>
            <Flex fit center position="absolute">{ text }</Flex>
            <Base className="progress-bar bg-success" style={ { width: (~~((((progress - 0) * (100 - 0)) / (maxProgress - 0)) + 0) + '%') }} />
            { children }
        </Base>
    );
}
