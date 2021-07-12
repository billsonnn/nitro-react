import { FC } from 'react';
import { RarityLevelViewProps } from './RarityLevelView.types';

export const RarityLevelView: FC<RarityLevelViewProps> = props =>
{
    const { level = 0 } = props;

    return (
        <div className="nitro-rarity-level">
            <div>{ level }</div>
        </div>
    );
}
