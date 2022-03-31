import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { GetUserProfile, LocalizeText, MessengerFriend, OpenMessengerChat } from '../../../api';
import { Base, Button, Flex, LayoutAvatarImageView, LayoutBadgeImageView } from '../../../common';
import { useFriends } from '../../../hooks';

interface FriendBarViewProps
{
    onlineFriends: MessengerFriend[];
}

export const FriendBarView: FC<FriendBarViewProps> = props =>
{
    const { onlineFriends = null } = props;
    const [ indexOffset, setIndexOffset ] = useState(0);
    const [ maxDisplayCount, setMaxDisplayCount ] = useState(3);
    const { followFriend = null } = useFriends();

    const FriendBarItemView: FC<{ friend: MessengerFriend }> = props =>
    {
        const { friend = null } = props;
        const [ isVisible, setVisible ] = useState(false);
        const elementRef = useRef<HTMLDivElement>();

        useEffect(() =>
        {
            const onClick = (event: MouseEvent) =>
            {
                const element = elementRef.current;

                if(!element) return;

                if((event.target !== element) && !element.contains((event.target as Node)))
                {
                    setVisible(false);
                }
            }

            document.addEventListener(MouseEventType.MOUSE_CLICK, onClick);

            return () =>
            {
                document.removeEventListener(MouseEventType.MOUSE_CLICK, onClick);
            }
        }, []);

        if(!friend)
        {
            return (
                <div ref={ elementRef } className="btn btn-primary friend-bar-item friend-bar-search">
                    <div className="friend-bar-item-head position-absolute"/>
                    <div className="text-truncate">{ LocalizeText('friend.bar.find.title') }</div>
                </div>
            );
        }

        return (
            <div ref={ elementRef } className={ 'btn btn-success friend-bar-item ' + (isVisible ? 'friend-bar-item-active' : '') } onClick={ event => setVisible(prevValue => !prevValue) }>
                <div className={`friend-bar-item-head position-absolute ${friend.id > 0 ? 'avatar': 'group'}`}>
                    { friend.id > 0 && <LayoutAvatarImageView headOnly={ true } figure={ friend.figure } direction={ 2 } /> }
                    { friend.id <= 0 && <LayoutBadgeImageView isGroup={ true } badgeCode={ friend.figure} />} 
                </div>
                <div className="text-truncate">{ friend.name }</div>
                { isVisible &&
                    <div className="d-flex justify-content-between">
                        <Base className="nitro-friends-spritesheet icon-friendbar-chat cursor-pointer" onClick={ event => OpenMessengerChat(friend.id) } />
                        { friend.followingAllowed &&
                            <Base className="nitro-friends-spritesheet icon-friendbar-visit cursor-pointer" onClick={ event => followFriend(friend) } /> }
                        <Base className="nitro-friends-spritesheet icon-profile cursor-pointer" onClick={ event => GetUserProfile(friend.id) } />
                    </div> }
            </div>
        );
    }

    const canDecreaseIndex = () => (indexOffset === 0) ? false : true;
    const canIncreaseIndex = () => ((onlineFriends.length <= maxDisplayCount) || (indexOffset === (onlineFriends.length - 1))) ? false : true;

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
