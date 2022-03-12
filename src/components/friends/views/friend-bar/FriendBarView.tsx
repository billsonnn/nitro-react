import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useMemo, useState } from 'react';
import { Button } from '../../../../common';
import { Flex } from '../../../../common/Flex';
import { MessengerFriend } from '../../common/MessengerFriend';
import { FriendBarItemView } from './FriendBarItemView';

interface FriendBarViewProps
{
    onlineFriends: MessengerFriend[];
}

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
        <Flex alignItems="center" className="friend-bar">
            <Button variant="black" className="friend-bar-button" disabled={ !canDecreaseIndex } onClick={ event => setIndexOffset(indexOffset - 1) }>
                <FontAwesomeIcon icon="chevron-left" />
            </Button>
            { Array.from(Array(maxDisplayCount), (e, i) =>
                {
                    return <FriendBarItemView key={ i } friend={ (onlineFriends[ indexOffset + i ] || null) } />;
                }) }
            <Button variant="black" className="friend-bar-button" disabled={ !canIncreaseIndex } onClick={ event => setIndexOffset(indexOffset + 1) }>
                <FontAwesomeIcon icon="chevron-right" />
            </Button>
        </Flex>
    );
}
