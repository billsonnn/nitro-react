import { FC, useMemo } from 'react';
import { Base } from '../../../common/Base';
import { RarityLevelViewProps } from './RarityLevelView.types';

export const RarityLevelView: FC<RarityLevelViewProps> = props =>
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
