import { FollowFriendMessageComposer, MouseEventType, UserProfileComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { LocalizeText, OpenMessengerChat } from '../../../../api';
import { SendMessageHook } from '../../../../hooks/messages';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { FriendBarItemViewProps } from './FriendBarItemView.types';

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

    const openProfile = useCallback(() =>
    {
        SendMessageHook(new UserProfileComposer(friend.id));
    }, [ friend ]);

    const onClick = useCallback((event: MouseEvent) =>
    {
        const element = elementRef.current;

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
            <div className="friend-bar-item-head position-absolute">
                <AvatarImageView headOnly={ true } figure={ friend.figure } direction={ 2 } />
            </div>
            <div className="text-truncate">{ friend.name }</div>
            { isVisible &&
                <div className="d-flex justify-content-between">
                    <i onClick={ openMessengerChat } className="icon icon-fb-chat cursor-pointer" />
                    { friend.followingAllowed && <i onClick={ followFriend } className="icon icon-fb-visit cursor-pointer" /> }
                    <i onClick={ openProfile } className="icon icon-fb-profile cursor-pointer" />
                </div> }
        </div>
    );
}
