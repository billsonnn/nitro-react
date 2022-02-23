import { RemoveFriendComposer, SendRoomInviteComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { SendMessageHook } from '../../../../hooks';
import { NitroCardAccordionSetView, NitroCardAccordionView, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../layout';
import { MessengerFriend } from '../../common/MessengerFriend';
import { FriendsGroupView } from '../friends-group/FriendsGroupView';
import { FriendsRemoveConfirmationView } from '../friends-remove-confirmation/FriendsRemoveConfirmationView';
import { FriendsRequestView } from '../friends-request/FriendsRequestView';
import { FriendsRoomInviteView } from '../friends-room-invite/FriendsRoomInviteView';
import { FriendsSearchView } from '../friends-search/FriendsSearchView';
import { FriendsListViewProps } from './FriendsListView.types';

const MODE_FRIENDS: number = 0;
const MODE_SEARCH: number = 1;

export const FriendsListView: FC<FriendsListViewProps> = props =>
{
    const { onlineFriends = [], offlineFriends = [], friendRequests = [], onCloseClick = null } = props;

    const [ selectedFriendsIds, setSelectedFriendsIds ] = useState<number[]>([]);
    const [ mode, setMode ] = useState<number>(0);
    
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
        
        SendMessageHook(new SendRoomInviteComposer(message, ...selectedFriendsIds));
        setShowRoomInvite(false);
    }, [ selectedFriendsIds, setShowRoomInvite ]);

    const removeSelectedFriends = useCallback(() =>
    {
        if(selectedFriendsIds.length === 0) return;

        SendMessageHook(new RemoveFriendComposer(...selectedFriendsIds));
        setSelectedFriendsIds([]);
        setShowRemoveFriendsConfirmation(false);
    }, [ selectedFriendsIds ]);

    return (
        <>
            <NitroCardView className="nitro-friends" uniqueKey="nitro-friends">
                <NitroCardHeaderView headerText={ LocalizeText('friendlist.friends') } onCloseClick={ onCloseClick } />
                <NitroCardTabsView>
                    <NitroCardTabsItemView isActive={ (mode === MODE_FRIENDS) } count={ friendRequests.length } onClick={ event => setMode(MODE_FRIENDS) }>
                        { LocalizeText('friendlist.friends') }
                    </NitroCardTabsItemView>
                    <NitroCardTabsItemView isActive={ (mode === MODE_SEARCH) } onClick={ event => setMode(MODE_SEARCH) }>
                        { LocalizeText('generic.search') }
                    </NitroCardTabsItemView>
                </NitroCardTabsView>
                <NitroCardContentView className="p-0 text-black">
                    { (mode === MODE_FRIENDS) &&
                        <>
                            <NitroCardAccordionView className="overflow-y-auto">
                                <NitroCardAccordionSetView headerText={ LocalizeText('friendlist.friends') + ` (${onlineFriends.length})` } isExpanded={ true }>
                                    <FriendsGroupView list={ onlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } />
                                </NitroCardAccordionSetView>
                                <NitroCardAccordionSetView headerText={ LocalizeText('friendlist.friends.offlinecaption') + ` (${offlineFriends.length})` }>
                                    <FriendsGroupView list={ offlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } />
                                </NitroCardAccordionSetView>
                                <FriendsRequestView requests={ friendRequests } />
                            </NitroCardAccordionView>
                            { selectedFriendsIds && selectedFriendsIds.length > 0 && <div className="d-flex gap-2 p-2">
                                <button className="btn btn-primary w-100" onClick={ () => setShowRoomInvite(true) }>Invite</button>
                                <button className="btn btn-danger w-100" onClick={ () => setShowRemoveFriendsConfirmation(true) }>Delete</button>
                            </div> } 
                        </>
                        }
                    { (mode === MODE_SEARCH) &&
                        <FriendsSearchView /> }
                </NitroCardContentView>
            </NitroCardView>
            { showRoomInvite &&
            <FriendsRoomInviteView selectedFriendsIds={ selectedFriendsIds } onCloseClick={ () => setShowRoomInvite(false) } sendRoomInvite={ sendRoomInvite } /> }
            { showRemoveFriendsConfirmation && 
            <FriendsRemoveConfirmationView selectedFriendsIds={ selectedFriendsIds } removeFriendsText={ removeFriendsText } onCloseClick={ () => setShowRemoveFriendsConfirmation(false) } removeSelectedFriends={ removeSelectedFriends } /> }
        </>
    );
};
