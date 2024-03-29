import { FC, useMemo } from 'react';
import { Base, BaseProps } from '../Base';

interface LayoutRarityLevelViewProps extends BaseProps<HTMLDivElement>
{
    level: number;
}

export const LayoutRarityLevelView: FC<LayoutRarityLevelViewProps> = props =>
{
    const { level = 0, classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-rarity-level' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Base classNames={ getClassNames } { ...rest }>
            <div>{ level }</div>
            { children }
        </Base>
    );
}
