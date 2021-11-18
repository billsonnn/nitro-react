import { FC, useMemo, useState } from 'react';
import { NitroLayoutButton, NitroLayoutFlex } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { FriendBarItemView } from '../friend-bar-item/FriendBarItemView';
import { FriendBarViewProps } from './FriendBarView.types';

export const FriendBarView: FC<FriendBarViewProps> = props =>
{
    const { onlineFriends = null } = props;

    const [ indexOffset, setIndexOffset ] = useState(0);
    const [ maxDisplayCount, setMaxDisplayCount ] = useState(3);

    const canDecreaseIndex = useMemo(() =>
    {
        if(indexOffset === 0) return false;

        return true;
    }, [ indexOffset ]);

    const canIncreaseIndex = useMemo(() =>
    {
        if((onlineFriends.length <= maxDisplayCount) || (indexOffset === (onlineFriends.length - 1))) return false;

        return true;
    }, [ maxDisplayCount, indexOffset, onlineFriends ]);

    return (
        <NitroLayoutFlex className="friend-bar align-items-center">
            <NitroLayoutButton className="friend-bar-button" variant="black" size="sm" disabled={ !canDecreaseIndex } onClick={ event => setIndexOffset(indexOffset - 1) }>
                <NitroLayoutBase className="fas fa-chevron-left" />
            </NitroLayoutButton>
            { Array.from(Array(maxDisplayCount), (e, i) =>
                {
                    return <FriendBarItemView key={ i } friend={ (onlineFriends[ indexOffset + i ] || null) } />;
                }) }
            <button type="button" className="btn btn-sm btn-black align-self-center friend-bar-button" disabled={ !canIncreaseIndex } onClick={ event => setIndexOffset(indexOffset + 1) }>
                <i className="fas fa-chevron-right" />
            </button>
        </NitroLayoutFlex>
    );
}
