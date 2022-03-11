import { FollowFriendMessageComposer, SetRelationshipStatusComposer } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useState } from 'react';
import { LocalizeText, OpenMessengerChat, SendMessageComposer } from '../../../../../api';
import { Base, Flex, NitroCardAccordionItemView, NitroCardAccordionItemViewProps, UserProfileIconView } from '../../../../../common';
import { MessengerFriend } from '../../../common/MessengerFriend';

interface FriendsListGroupItemViewProps extends NitroCardAccordionItemViewProps
{
    friend: MessengerFriend;
    selected?: boolean;
    selectFriend: () => void;
}

export const FriendsListGroupItemView: FC<FriendsListGroupItemViewProps> = props =>
{
    const { friend = null, selected = false, selectFriend = null, children = null, ...rest } = props;
    const [ isRelationshipOpen, setIsRelationshipOpen ] = useState<boolean>(false);

    const followFriend = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();

        SendMessageComposer(new FollowFriendMessageComposer(friend.id));
    }

    const openMessengerChat = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();
        
        OpenMessengerChat(friend.id);
    }

    const openRelationship = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();

        setIsRelationshipOpen(true);
    }

    const updateRelationship = (event: MouseEvent<HTMLDivElement>, type: number) =>
    {
        event.stopPropagation();

        if(type !== friend.relationshipStatus) SendMessageComposer(new SetRelationshipStatusComposer(friend.id, type));
        
        setIsRelationshipOpen(false);
    }

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
    }

    if(!friend) return null;

    return (
        <NitroCardAccordionItemView justifyContent="between" className={ `px-2 py-1 ${ selected && 'bg-primary text-white' }` } onClick={ selectFriend } { ...rest }>
            <Flex alignItems="center" gap={ 1 }>
                <Base onClick={ event => event.stopPropagation() }>
                    <UserProfileIconView userId={ friend.id } />
                </Base>
                <div>{ friend.name }</div>
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                { !isRelationshipOpen &&
                    <>
                        { friend.followingAllowed &&
                            <Base pointer onClick={ followFriend } className="nitro-friends-spritesheet icon-follow" title={ LocalizeText('friendlist.tip.follow') } /> }
                        { friend.online &&
                            <Base pointer className="nitro-friends-spritesheet icon-chat" onClick={ openMessengerChat } title={ LocalizeText('friendlist.tip.im') } /> }
                        { (friend.id > 0) &&
                            <Base className={ `nitro-friends-spritesheet icon-${ getCurrentRelationshipName() } cursor-pointer` } onClick={ openRelationship } title={ LocalizeText('infostand.link.relationship') } /> }
                    </> }
                { isRelationshipOpen &&
                    <>
                        <Base pointer className="nitro-friends-spritesheet icon-heart" onClick={ event => updateRelationship(event, MessengerFriend.RELATIONSHIP_HEART) } />
                        <Base pointer className="nitro-friends-spritesheet icon-smile" onClick={ event => updateRelationship(event, MessengerFriend.RELATIONSHIP_SMILE) } />
                        <Base pointer className="nitro-friends-spritesheet icon-bobba" onClick={ event => updateRelationship(event, MessengerFriend.RELATIONSHIP_BOBBA) } />
                        <Base pointer className="nitro-friends-spritesheet icon-none" onClick={ event => updateRelationship(event, MessengerFriend.RELATIONSHIP_NONE) } />
                    </> }
            </Flex>
            { children }
        </NitroCardAccordionItemView>
    );
}
