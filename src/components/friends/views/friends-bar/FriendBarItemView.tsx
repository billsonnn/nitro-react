import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { GetUserProfile, LocalizeText, MessengerFriend, OpenMessengerChat } from '../../../../api';
import { LayoutAvatarImageView, LayoutBadgeImageView } from '../../../../common';
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
            <div ref={ elementRef } className="border border-black w-[130px] mx-1 rounded cursor-pointer z-0 text-sm py-2.5 px-1 relative pl-[38px] text-left friend-bar-search">
                <div className="absolute friend-bar-item-head"/>
                <div className="text-truncate">{ LocalizeText('friend.bar.find.title') }</div>
            </div>
        );
    }

    return (
        <div ref={ elementRef } className={ 'border border-black rounded cursor-pointer text-sm w-[130px] mx-1 z-0 py-2.5 px-1 relative pl-[38px] text-left' + (isVisible ? 'mb-[21px]' : '') } onClick={ event => setVisible(prevValue => !prevValue) }>
            <div className={ `absolute ${ friend.id > 0 ? 'top-[-30px] left-[-30px]': 'top-0 left-[-5px]' }` }>
                { (friend.id > 0) && <LayoutAvatarImageView direction={ 2 } figure={ friend.figure } headOnly={ true } /> }
                { (friend.id <= 0) && <LayoutBadgeImageView badgeCode={ friend.figure } isGroup={ true } /> } 
            </div>
            <div className="truncate">{ friend.name }</div>
            { isVisible &&
            <div className="flex justify-content-between">
                <div className="cursor-pointer nitro-friends-spritesheet icon-friendbar-chat" onClick={ event => OpenMessengerChat(friend.id) } />
                { friend.followingAllowed &&
                <div className="cursor-pointer nitro-friends-spritesheet icon-friendbar-visit" onClick={ event => followFriend(friend) } /> }
                <div className="cursor-pointer nitro-friends-spritesheet icon-profile" onClick={ event => GetUserProfile(friend.id) } />
            </div> }
        </div>
    );
}
