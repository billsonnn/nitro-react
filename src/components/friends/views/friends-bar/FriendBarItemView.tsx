import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { GetUserProfile, LocalizeText, MessengerFriend, OpenMessengerChat } from '../../../../api';
import { Button, LayoutAvatarImageView, LayoutBadgeImageView } from '../../../../common';
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
        };

        document.addEventListener(MouseEventType.MOUSE_CLICK, onClick);

        return () => document.removeEventListener(MouseEventType.MOUSE_CLICK, onClick);
    }, []);

    if(!friend)
    {
        return (
            <Button className="border w-[130px] mx-[3px] my-[0] z-0 relative pl-[37px] text-left friend-bar-search" justifyContent="start" size="md">
                <div className="absolute -top-[3px] left-[5px] w-[31px] h-[34px] bg-[url('@/assets/images/toolbar/friend-search.png')]" />
                <div className="truncate">{ LocalizeText('friend.bar.find.title') }</div>
            </Button>
        );
    }

    return (
        <Button className={ ' block w-[130px] mx-[3px] my-[0] z-0 relative pl-[37px] text-left' + (isVisible ? 'mb-[21px]' : '') } justifyContent="start" size="md" variant={ 'success' } onClick={ event => setVisible(prevValue => !prevValue) }>
            <div className={ `friend-bar-item-head absolute ${ friend.id > 0 ? '-top-[30px] -left-[30px]' : '-top-[5px] -left-[3.5px]' }` }>
                { (friend.id > 0) && <LayoutAvatarImageView direction={ 2 } figure={ friend.figure } headOnly={ true } /> }
                { (friend.id <= 0) && <LayoutBadgeImageView badgeCode={ friend.figure } isGroup={ true } /> }
            </div>
            <div className="truncate">{ friend.name }</div>
            { isVisible &&
                <div className="flex justify-between">
                    <div className="cursor-pointer nitro-friends-spritesheet icon-friendbar-chat" onClick={ event => OpenMessengerChat(friend.id) } />
                    { friend.followingAllowed &&
                        <div className="cursor-pointer nitro-friends-spritesheet icon-friendbar-visit" onClick={ event => followFriend(friend) } /> }
                    <div className="cursor-pointer nitro-friends-spritesheet icon-profile" onClick={ event => GetUserProfile(friend.id) } />
                </div> }
        </Button>
    );
};
