import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { GetUserProfile, LocalizeText, MessengerFriend, OpenMessengerChat } from '../../../../api';
import { Base, LayoutAvatarImageView, LayoutBadgeImageView } from '../../../../common';
import { useFriends } from '../../../../hooks';

export const FriendBarItemView: FC<{ friend: MessengerFriend }> = props =>
{
    const { friend = null } = props;
    const [ isVisible, setVisible ] = useState(false);
    const { followFriend = null } = useFriends();
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

        return () => document.removeEventListener(MouseEventType.MOUSE_CLICK, onClick);
    }, []);

    if(!friend)
    {
        return (
            <div ref={ elementRef } className="btn btn-f-grey friend-bar-search">
                <div className="friend-bar-item-head position-absolute"/>
                <div className="text-truncate">{ LocalizeText('friend.bar.find.title') }</div>
            </div>
        );
    }

    return (
        <div ref={ elementRef } className={ 'friend-bar-item  d-flex align-items-center ' + (isVisible ? 'friend-bar-item-active' : '') } onMouseOver={ () => setVisible(true) } onMouseOut={ () => setVisible(false) }>
            <div className={ `friend-bar-item-head position-absolute ${ friend.id > 0 ? 'avatar': 'group' }` }>
                { (friend.id > 0) && <LayoutAvatarImageView figure={ friend.figure } direction={ isVisible ? 2 : 3 } /> }
                { (friend.id <= 0) && <LayoutBadgeImageView isGroup={ true } badgeCode={ friend.figure } /> } 
            </div>
            { isVisible ?
                <div className="d-flex justify-content-between w-100 gap-2 pe-1">
                    <Base className="nitro-friends-spritesheet icon-friendbar-chat cursor-pointer" onClick={ event => OpenMessengerChat(friend.id) } />
                    { friend.followingAllowed &&
                <Base className="nitro-friends-spritesheet icon-friendbar-visit cursor-pointer" onClick={ event => followFriend(friend) } /> }
                    <Base className="nitro-friends-spritesheet icon-profile cursor-pointer" onClick={ event => GetUserProfile(friend.id) } />
                </div> : <div className="text-truncate w-100 pe-1">{ friend.name }</div> }
        </div>
    );
}
