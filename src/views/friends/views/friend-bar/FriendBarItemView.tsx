import { FollowFriendMessageComposer, MouseEventType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GetUserProfile, LocalizeText, OpenMessengerChat, SendMessageComposer } from '../../../../api';
import { Base, LayoutAvatarImageView, LayoutBadgeImageView } from '../../../../common';
import { MessengerFriend } from '../../common/MessengerFriend';

interface FriendBarItemViewProps
{
    friend: MessengerFriend;
}

export const FriendBarItemView: FC<FriendBarItemViewProps> = props =>
{
    const { friend = null } = props;
    const [ isVisible, setVisible ] = useState(false);
    const elementRef = useRef<HTMLDivElement>();

    const followFriend = useCallback(() =>
    {
        SendMessageComposer(new FollowFriendMessageComposer(friend.id));
    }, [ friend ]);

    const openMessengerChat = useCallback(() =>
    {
        if(!friend) return;
        
        OpenMessengerChat(friend.id);
    }, [ friend ]);

    const onClick = useCallback((event: MouseEvent) =>
    {
        const element = elementRef.current;

        if(!element) return;

        if((event.target !== element) && !element.contains((event.target as Node)))
        {
            setVisible(false);
        }
    }, []);

    useEffect(() =>
    {
        document.addEventListener(MouseEventType.MOUSE_CLICK, onClick);

        return () =>
        {
            document.removeEventListener(MouseEventType.MOUSE_CLICK, onClick);
        }
    }, [ onClick ]);

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
        <div ref={ elementRef } className={'btn btn-success friend-bar-item ' + (isVisible ? 'friend-bar-item-active' : '')} onClick={ event => setVisible(prevValue => !prevValue) }>
            <div className={`friend-bar-item-head position-absolute ${friend.id > 0 ? 'avatar': 'group'}`}>
                { friend.id > 0 && <LayoutAvatarImageView headOnly={ true } figure={ friend.figure } direction={ 2 } /> }
                { friend.id <= 0 && <LayoutBadgeImageView isGroup={ true } badgeCode={ friend.figure} />} 
            </div>
            <div className="text-truncate">{ friend.name }</div>
            { isVisible &&
                <div className="d-flex justify-content-between">
                    <Base className="nitro-friends-spritesheet icon-friendbar-chat cursor-pointer" onClick={ openMessengerChat } />
                    { friend.followingAllowed &&
                        <Base className="nitro-friends-spritesheet icon-friendbar-visit cursor-pointer" onClick={ followFriend } /> }
                    <Base className="nitro-friends-spritesheet icon-profile cursor-pointer" onClick={ event => GetUserProfile(friend.id) } />
                </div> }
        </div>
    );
}
