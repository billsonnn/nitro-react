import { RemoveFriendComposer, SendRoomInviteComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, Flex, NitroCardAccordionSetView, NitroCardAccordionView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { MessengerFriend } from '../../common/MessengerFriend';
import { MessengerRequest } from '../../common/MessengerRequest';
import { FriendsListGroupView } from './friends-list-group/FriendsListGroupView';
import { FriendsListRequestView } from './friends-list-request/FriendsListRequestView';
import { FriendsRemoveConfirmationView } from './FriendsRemoveConfirmationView';
import { FriendsRoomInviteView } from './FriendsRoomInviteView';
import { FriendsSearchView } from './FriendsSearchView';

interface FriendsListViewProps
{
    onCloseClick: () => void;
    onlineFriends: MessengerFriend[];
    offlineFriends: MessengerFriend[];
    friendRequests: MessengerRequest[];
}

export const FriendsListView: FC<FriendsListViewProps> = props =>
{
    const { onlineFriends = [], offlineFriends = [], friendRequests = [], onCloseClick = null } = props;

    const [ selectedFriendsIds, setSelectedFriendsIds ] = useState<number[]>([]);
    
    const [ showRoomInvite, setShowRoomInvite ] = useState<boolean>(false);
    const [ showRemoveFriendsConfirmation, setShowRemoveFriendsConfirmation ] = useState<boolean>(false);

    const removeFriendsText = useMemo(() =>
    {
        if(!selectedFriendsIds || !selectedFriendsIds.length) return '';

        const userNames: string[] = [];

        for(const userId of selectedFriendsIds)
        {
            let existingFriend: MessengerFriend = onlineFriends.find(f => f.id === userId);

            if(!existingFriend) existingFriend = offlineFriends.find(f => f.id === userId);

            if(!existingFriend) continue;

            userNames.push(existingFriend.name);
        }

        return LocalizeText('friendlist.removefriendconfirm.userlist', ['user_names'], [userNames.join(', ')]);
    }, [offlineFriends, onlineFriends, selectedFriendsIds]);

    const selectFriend = useCallback((userId: number) =>
    {
        if(userId < 0) return;
        
        const existingUserIdIndex: number = selectedFriendsIds.indexOf(userId);

        if(existingUserIdIndex > -1)
        {
            const clonedFriend = [...selectedFriendsIds];
            clonedFriend.splice(existingUserIdIndex, 1)
            
            setSelectedFriendsIds([...clonedFriend]);
        }
        else
        {
            setSelectedFriendsIds([...selectedFriendsIds, userId]);
        }
    }, [ selectedFriendsIds, setSelectedFriendsIds ]);

    const sendRoomInvite = useCallback((message: string) =>
    {
        if(selectedFriendsIds.length === 0 || !message || message.length === 0) return;
        
        SendMessageComposer(new SendRoomInviteComposer(message, ...selectedFriendsIds));
        setShowRoomInvite(false);
    }, [ selectedFriendsIds, setShowRoomInvite ]);

    const removeSelectedFriends = useCallback(() =>
    {
        if(selectedFriendsIds.length === 0) return;

        SendMessageComposer(new RemoveFriendComposer(...selectedFriendsIds));
        setSelectedFriendsIds([]);
        setShowRemoveFriendsConfirmation(false);
    }, [ selectedFriendsIds ]);

    return (
        <>
            <NitroCardView className="nitro-friends" uniqueKey="nitro-friends" theme="primary-slim">
                <NitroCardHeaderView headerText={ LocalizeText('friendlist.friends') } onCloseClick={ onCloseClick } />
                <NitroCardContentView overflow="hidden" gap={ 1 } className="text-black p-0">
                    <NitroCardAccordionView fullHeight overflow="hidden">
                        <NitroCardAccordionSetView headerText={ LocalizeText('friendlist.friends') + ` (${onlineFriends.length})` } isExpanded={ true }>
                            <FriendsListGroupView list={ onlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } />
                        </NitroCardAccordionSetView>
                        <NitroCardAccordionSetView headerText={ LocalizeText('friendlist.friends.offlinecaption') + ` (${offlineFriends.length})` }>
                            <FriendsListGroupView list={ offlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } />
                        </NitroCardAccordionSetView>
                        <FriendsListRequestView headerText={ LocalizeText('friendlist.tab.friendrequests') + ` (${ friendRequests.length })` } isExpanded={ true } requests={ friendRequests } />
                        <FriendsSearchView headerText={ LocalizeText('people.search.title') } />
                    </NitroCardAccordionView>
                    { selectedFriendsIds && selectedFriendsIds.length > 0 &&
                        <Flex gap={ 1 } className="p-1">
                            <Button fullWidth onClick={ () => setShowRoomInvite(true) }>{ LocalizeText('friendlist.tip.invite') }</Button>
                            <Button fullWidth variant="danger" onClick={ event => setShowRemoveFriendsConfirmation(true) }>{ LocalizeText('generic.delete') }</Button>
                        </Flex> } 
                </NitroCardContentView>
            </NitroCardView>
            { showRoomInvite &&
                <FriendsRoomInviteView selectedFriendsIds={ selectedFriendsIds } onCloseClick={ () => setShowRoomInvite(false) } sendRoomInvite={ sendRoomInvite } /> }
            { showRemoveFriendsConfirmation && 
                <FriendsRemoveConfirmationView selectedFriendsIds={ selectedFriendsIds } removeFriendsText={ removeFriendsText } onCloseClick={ () => setShowRemoveFriendsConfirmation(false) } removeSelectedFriends={ removeSelectedFriends } /> }
        </>
    );
};
