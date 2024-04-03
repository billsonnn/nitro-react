import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MessengerFriend } from '../../../../api';
import { Button, Flex } from '../../../../common';
import { FriendBarItemView } from './FriendBarItemView';

export const FriendBarView: FC<{ onlineFriends: MessengerFriend[] }> = props =>
{
    const { onlineFriends = null } = props;
    const [ indexOffset, setIndexOffset ] = useState(0);
    const [ MAX_DISPLAY_COUNT, setMaxDisplayCount ] = useState(1);

    const friendWidth = 150;
    const friendRef = useRef<HTMLDivElement>();

    const calculateDisplayCount = useCallback(() =>
    {
        let min = 1 + onlineFriends.length;

        if(!friendRef.current) return min;
        
        let max = Math.floor((friendRef?.current?.getBoundingClientRect().width - 60) / friendWidth);

        if(min >= max) min = max;

        setMaxDisplayCount( min );
    }, [ friendWidth, onlineFriends ])


    useEffect(() =>
    {
        if(!friendRef.current) return;

        const resizeObserver = new ResizeObserver(() =>
        {
            calculateDisplayCount();
            resizeObserver.disconnect();
        });

        resizeObserver.observe(friendRef.current);

        window.addEventListener('resize', () =>
        {
            calculateDisplayCount()
        });

        return () =>
        {
            resizeObserver.disconnect();
            window.removeEventListener('resize', () =>
            {
                calculateDisplayCount()
            });

        }
    }, [ calculateDisplayCount, friendRef ]);

    return (
        <Flex innerRef={ friendRef } className="w-100 justify-content-center align-items-center friend-bar" gap={ 1 }>
            <Button variant="black" className="friend-bar-button" disabled={ (indexOffset <= 0) } onClick={ event => setIndexOffset(indexOffset - 1) }>
                <FaChevronLeft className="fa-icon" />
            </Button>
            { Array.from(Array(MAX_DISPLAY_COUNT), (e, i) => <FriendBarItemView key={ i } friend={ (onlineFriends[ indexOffset + i ] || null) } />) }
            <Button variant="black" className="friend-bar-button" disabled={ !((onlineFriends.length > MAX_DISPLAY_COUNT) && ((indexOffset + MAX_DISPLAY_COUNT) <= (onlineFriends.length - 1))) } onClick={ event => setIndexOffset(indexOffset + 1) }>
                <FaChevronRight className="fa-icon" />
            </Button>
        </Flex>
    );
}
