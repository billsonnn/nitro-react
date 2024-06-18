import { FC, MouseEvent, useState } from 'react';
import { LocalizeText, MessengerFriend, OpenMessengerChat } from '../../../../../api';
import { NitroCardAccordionItemView, UserProfileIconView } from '../../../../../common';
import { useFriends } from '../../../../../hooks';

export const FriendsListGroupItemView: FC<{ friend: MessengerFriend, selected: boolean, selectFriend: (userId: number) => void }> = props =>
{
    const { friend = null, selected = false, selectFriend = null } = props;
    const [ isRelationshipOpen, setIsRelationshipOpen ] = useState<boolean>(false);
    const { followFriend = null, updateRelationship = null } = useFriends();

    const clickFollowFriend = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();

        followFriend(friend);
    };

    const openMessengerChat = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();

        OpenMessengerChat(friend.id);
    };

    const openRelationship = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();

        setIsRelationshipOpen(true);
    };

    const clickUpdateRelationship = (event: MouseEvent<HTMLDivElement>, type: number) =>
    {
        event.stopPropagation();

        updateRelationship(friend, type);

        setIsRelationshipOpen(false);
    };

    const getCurrentRelationshipName = () =>
    {
        if(!friend) return 'none';

        switch(friend.relationshipStatus)
        {
            case MessengerFriend.RELATIONSHIP_HEART: return 'heart';
            case MessengerFriend.RELATIONSHIP_SMILE: return 'smile';
            case MessengerFriend.RELATIONSHIP_BOBBA: return 'bobba';
            default: return 'none';
        }
    };

    if(!friend) return null;

    return (
        <NitroCardAccordionItemView className={ `px-2 py-1 ${ selected && 'bg-primary text-white' }` } justifyContent="between" onClick={ event => selectFriend(friend.id) }>
            <div className="flex items-center gap-1">
                <div onClick={ event => event.stopPropagation() }>
                    <UserProfileIconView userId={ friend.id } />
                </div>
                <div>{ friend.name }</div>
            </div>
            <div className="flex items-center gap-1">
                { !isRelationshipOpen &&
                    <>
                        { friend.followingAllowed &&
                            <div className="nitro-friends-spritesheet icon-follow cursor-pointer" title={ LocalizeText('friendlist.tip.follow') } onClick={ clickFollowFriend } /> }
                        { friend.online &&
                            <div className="nitro-friends-spritesheet icon-chat cursor-pointer" title={ LocalizeText('friendlist.tip.im') } onClick={ openMessengerChat } /> }
                        { (friend.id > 0) &&
                            <div className={ `nitro-friends-spritesheet icon-${ getCurrentRelationshipName() } cursor-pointer` } title={ LocalizeText('infostand.link.relationship') } onClick={ openRelationship } /> }
                    </> }
                { isRelationshipOpen &&
                    <>
                        <div className="nitro-friends-spritesheet icon-heart cursor-pointer" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_HEART) } />
                        <div className="nitro-friends-spritesheet icon-smile cursor-pointer" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_SMILE) } />
                        <div className="nitro-friends-spritesheet icon-bobba cursor-pointer" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_BOBBA) } />
                        <div className="nitro-friends-spritesheet icon-none cursor-pointer" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_NONE) } />
                    </> }
            </div>
        </NitroCardAccordionItemView>
    );
};
