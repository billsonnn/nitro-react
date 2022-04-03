import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useRef, useState } from 'react';
import { MessengerFriend } from '../../../../api';
import { Button, Flex } from '../../../../common';
import { FriendBarItemView } from './FriendBarItemView';

const MAX_DISPLAY_COUNT = 3;

export const FriendBarView: FC<{ onlineFriends: MessengerFriend[] }> = props =>
{
    const { onlineFriends = null } = props;
    const [ indexOffset, setIndexOffset ] = useState(0);
    const elementRef = useRef<HTMLDivElement>();

    return (
        <Flex innerRef={ elementRef } alignItems="center" className="friend-bar">
            <Button variant="black" className="friend-bar-button" disabled={ (indexOffset <= 0) } onClick={ event => setIndexOffset(indexOffset - 1) }>
                <FontAwesomeIcon icon="chevron-left" />
            </Button>
            { Array.from(Array(MAX_DISPLAY_COUNT), (e, i) => <FriendBarItemView key={ i } friend={ (onlineFriends[ indexOffset + i ] || null) } />) }
            <Button variant="black" className="friend-bar-button" disabled={ !((onlineFriends.length > MAX_DISPLAY_COUNT) && ((indexOffset + MAX_DISPLAY_COUNT) <= (onlineFriends.length - 1))) } onClick={ event => setIndexOffset(indexOffset + 1) }>
                <FontAwesomeIcon icon="chevron-right" />
            </Button>
        </Flex>
    );
}
