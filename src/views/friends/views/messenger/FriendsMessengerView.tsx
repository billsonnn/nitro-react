import { ILinkEventTracker, NitroEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AddEventLinkTracker, LocalizeText, RemoveLinkEventTracker } from '../../../../api';
import { FriendsEvent } from '../../../../events/friends/FriendsEvent';
import { useUiEvent } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { MessengerChat } from '../../common/MessengerChat';
import { useFriendsContext } from '../../context/FriendsContext';
import { FriendsActions } from '../../reducers/FriendsReducer';

export const FriendsMessengerView: FC<{}> = props =>
{
    const { friendsState = null, dispatchFriendsState = null } = useFriendsContext();
    const { activeChats = [] } = friendsState;

    const [ isVisible, setIsVisible ] = useState(false);
    const [ activeChatIndex, setActiveChatIndex ] = useState(0);
    
    const onNitroEvent = useCallback((event: NitroEvent) =>
    {
        switch(event.type)
        {
            case FriendsEvent.SHOW_FRIEND_MESSENGER:
                setIsVisible(true);
                return;
            case FriendsEvent.TOGGLE_FRIEND_MESSENGER:
                setIsVisible(value => !value);
                return;
        }
    }, []);

    useUiEvent(FriendsEvent.SHOW_FRIEND_MESSENGER, onNitroEvent);
    useUiEvent(FriendsEvent.TOGGLE_FRIEND_MESSENGER, onNitroEvent);

    const linkReceived = useCallback((url: string) =>
    {
        const parts = url.split('/');
        console.log(parts);
        if(parts.length < 3) return;

        const friendId = parseInt(parts[2]);
        console.log(friendId);
        let existingChatIndex = activeChats.findIndex(c => c.friendId === friendId);

        if(existingChatIndex === -1)
        {
            const clonedActiveChats = Array.from(activeChats);
            clonedActiveChats.push(new MessengerChat(friendId, true));

            dispatchFriendsState({
                type: FriendsActions.SET_ACTIVE_CHATS,
                payload: {
                    chats: clonedActiveChats
                }
            });

            existingChatIndex = clonedActiveChats.length - 1;
        }

        setActiveChatIndex(existingChatIndex);
        setIsVisible(true);
    }, [ activeChats, dispatchFriendsState ]);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived,
            eventUrlPrefix: 'friends/messenger/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ linkReceived ]);

    if(!isVisible) return null;

    return (<NitroCardView className="nitro-friends-messenger" simple={ true }>
                <NitroCardHeaderView headerText={ LocalizeText('friendlist.friends') } onCloseClick={ () => {} } />
                <NitroCardContentView className="p-0">
                    
                </NitroCardContentView>
            </NitroCardView>);
};
