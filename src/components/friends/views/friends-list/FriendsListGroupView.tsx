import { FC, MouseEvent, useState } from 'react';
import { LocalizeText, MessengerFriend, OpenMessengerChat } from '../../../../api';
import { Base, Flex, NitroCardAccordionItemView, UserProfileIconView } from '../../../../common';
import { useFriends } from '../../../../hooks';

interface FriendsListGroupViewProps
{
    list: MessengerFriend[];
    selectedFriendsIds: number[];
    selectFriend: (userId: number) => void;
}

export const FriendsListGroupView: FC<FriendsListGroupViewProps> = props =>
{
    const { list = null, selectedFriendsIds = null, selectFriend = null } = props;
    const { followFriend = null, updateRelationship = null } = useFriends();

    if(!list || !list.length) return null;

    const FriendsListGroupItemView: FC<{ friend: MessengerFriend, selected: boolean }> = props =>
    {
        const { friend = null, selected = false } = props;
        const [ isRelationshipOpen, setIsRelationshipOpen ] = useState<boolean>(false);

        const clickFollowFriend = (event: MouseEvent<HTMLDivElement>) =>
        {
            event.stopPropagation();

            followFriend(friend);
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

        const clickUpdateRelationship = (event: MouseEvent<HTMLDivElement>, type: number) =>
        {
            event.stopPropagation();

            updateRelationship(friend, type);
            
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
            <NitroCardAccordionItemView justifyContent="between" className={ `px-2 py-1 ${ selected && 'bg-primary text-white' }` } onClick={ event => selectFriend(friend.id) }>
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
                                <Base pointer onClick={ clickFollowFriend } className="nitro-friends-spritesheet icon-follow" title={ LocalizeText('friendlist.tip.follow') } /> }
                            { friend.online &&
                                <Base pointer className="nitro-friends-spritesheet icon-chat" onClick={ openMessengerChat } title={ LocalizeText('friendlist.tip.im') } /> }
                            { (friend.id > 0) &&
                                <Base className={ `nitro-friends-spritesheet icon-${ getCurrentRelationshipName() } cursor-pointer` } onClick={ openRelationship } title={ LocalizeText('infostand.link.relationship') } /> }
                        </> }
                    { isRelationshipOpen &&
                        <>
                            <Base pointer className="nitro-friends-spritesheet icon-heart" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_HEART) } />
                            <Base pointer className="nitro-friends-spritesheet icon-smile" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_SMILE) } />
                            <Base pointer className="nitro-friends-spritesheet icon-bobba" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_BOBBA) } />
                            <Base pointer className="nitro-friends-spritesheet icon-none" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_NONE) } />
                        </> }
                </Flex>
            </NitroCardAccordionItemView>
        );
    }

    return (
        <>
            { list.map((item, index) => <FriendsListGroupItemView key={ index } friend={ item } selected={ selectedFriendsIds && selectedFriendsIds.includes(item.id) } />) }
        </>  
    );
}
