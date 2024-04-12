import { FC, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MessengerFriend } from '../../../../api';
import { Button } from '../../../../common';
import { FriendBarItemView } from './FriendBarItemView';

const MAX_DISPLAY_COUNT = 3;

export const FriendBarView: FC<{ onlineFriends: MessengerFriend[] }> = props =>
{
    const { onlineFriends = null } = props;
    const [ indexOffset, setIndexOffset ] = useState(0);
    const elementRef = useRef<HTMLDivElement>();

    return (
        <div ref={ elementRef } className="flex items-center friend-bar">
            <Button className="friend-bar-button" disabled={ (indexOffset <= 0) } variant="black" onClick={ event => setIndexOffset(indexOffset - 1) }>
                <FaChevronLeft className="fa-icon" />
            </Button>
            { Array.from(Array(MAX_DISPLAY_COUNT), (e, i) => <FriendBarItemView key={ i } friend={ (onlineFriends[ indexOffset + i ] || null) } />) }
            <Button className="friend-bar-button" disabled={ !((onlineFriends.length > MAX_DISPLAY_COUNT) && ((indexOffset + MAX_DISPLAY_COUNT) <= (onlineFriends.length - 1))) } variant="black" onClick={ event => setIndexOffset(indexOffset + 1) }>
                <FaChevronRight className="fa-icon" />
            </Button>
        </div>
    );
}
