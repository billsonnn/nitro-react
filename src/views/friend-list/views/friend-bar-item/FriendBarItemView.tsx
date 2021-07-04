import { FollowFriendComposer, MouseEventType, Nitro } from 'nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { FriendBarItemViewProps } from './FriendBarItemView.types';

export const FriendBarItemView: FC<FriendBarItemViewProps> = props =>
{
    const { friend = null } = props;
    const [isVisible, setVisible] = useState(false);

    const toggleVisible = () => setVisible(prevCheck => !prevCheck);

    const elementRef = useRef<HTMLDivElement>();

    useEffect(() =>
    {
        function onClick(event: MouseEvent): void
        {
            const element = elementRef.current;

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
    }, [ elementRef, setVisible ]);
    

    const followFriend = () =>
    {

        Nitro.instance.communication.connection.send(new FollowFriendComposer(friend.id));
    }

    if(!friend)
    {
        return (
            <div ref={ elementRef } className="btn btn-primary friend-bar-item friend-bar-search">
                <div className="friend-bar-item-head position-absolute"/>
                <div className="text-truncate">{ LocalizeText("friend.bar.find.title") }</div>
            </div>
        );
    }

    return (
        <div ref={ elementRef } className={"btn btn-success friend-bar-item " + (isVisible ? "friend-bar-item-active" : "")} onClick={ event => toggleVisible()}>
            <div className="friend-bar-item-head position-absolute">
                <AvatarImageView headOnly={true} figure={friend.figure} direction={2} />
            </div>
            <div className="text-truncate">{friend.name}</div>
            {isVisible && <div className="d-flex justify-content-between">
                <i className="icon icon-fb-chat cursor-pointer" />
                {friend.followingAllowed && <i onClick={ event => followFriend() } className="icon icon-fb-visit cursor-pointer" />}
                <i className="icon icon-fb-profile cursor-pointer" />
            </div>}
        </div>
    );
}
