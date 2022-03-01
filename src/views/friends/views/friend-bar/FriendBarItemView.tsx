import { FollowFriendMessageComposer, MouseEventType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GetUserProfile, LocalizeText, OpenMessengerChat } from '../../../../api';
import { SendMessageHook } from '../../../../hooks/messages';
import { NitroLayoutBase } from '../../../../layout/base';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';
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
        SendMessageHook(new FollowFriendMessageComposer(friend.id));
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
                { friend.id > 0 && <AvatarImageView headOnly={ true } figure={ friend.figure } direction={ 2 } /> }
                { friend.id <= 0 && <BadgeImageView isGroup={ true } badgeCode={ friend.figure} />} 
            </div>
            <div className="text-truncate">{ friend.name }</div>
            { isVisible &&
                <div className="d-flex justify-content-between">
                    <NitroLayoutBase className="nitro-friends-spritesheet icon-friendbar-chat cursor-pointer" onClick={ openMessengerChat } />
                    { friend.followingAllowed &&
                        <NitroLayoutBase className="nitro-friends-spritesheet icon-friendbar-visit cursor-pointer" onClick={ followFriend } /> }
                    <NitroLayoutBase className="nitro-friends-spritesheet icon-profile cursor-pointer" onClick={ event => GetUserProfile(friend.id) } />
                </div> }
        </div>
    );
}
