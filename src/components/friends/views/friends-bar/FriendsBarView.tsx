import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useState } from 'react';
import { MessengerFriend } from '../../../../api';
import { Button, Flex } from '../../../../common';
import { FriendBarItemView } from './FriendBarItemView';

const MAX_DISPLAY_COUNT = 3;

export const FriendBarView: FC<{ onlineFriends: MessengerFriend[] }> = props =>
{
    const { onlineFriends = null } = props;
    const [ indexOffset, setIndexOffset ] = useState(0);

    const canDecreaseIndex = () => (indexOffset === 0) ? false : true;
    const canIncreaseIndex = () => ((onlineFriends.length <= MAX_DISPLAY_COUNT) || (indexOffset === (onlineFriends.length - 1))) ? false : true;

    return (
        <Flex alignItems="center" className="friend-bar">
            <Button variant="black" className="friend-bar-button" disabled={ !canDecreaseIndex } onClick={ event => setIndexOffset(indexOffset - 1) }>
                <FontAwesomeIcon icon="chevron-left" />
            </Button>
            { Array.from(Array(MAX_DISPLAY_COUNT), (e, i) => <FriendBarItemView key={ i } friend={ (onlineFriends[ indexOffset + i ] || null) } />) }
            <Button variant="black" className="friend-bar-button" disabled={ !canIncreaseIndex } onClick={ event => setIndexOffset(indexOffset + 1) }>
                <FontAwesomeIcon icon="chevron-right" />
            </Button>
        </Flex>
    );
}
