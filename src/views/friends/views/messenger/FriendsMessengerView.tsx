import { FollowFriendMessageComposer, ILinkEventTracker, NitroEvent, SendMessageComposer, UserProfileComposer } from '@nitrots/nitro-renderer';
import { FC, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AddEventLinkTracker, GetSessionDataManager, LocalizeText, RemoveLinkEventTracker } from '../../../../api';
import { FriendsEvent } from '../../../../events/friends/FriendsEvent';
import { SendMessageHook, useUiEvent } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { MessengerChat } from '../../common/MessengerChat';
import { MessengerChatMessage } from '../../common/MessengerChatMessage';
import { useFriendsContext } from '../../context/FriendsContext';
import { FriendsActions } from '../../reducers/FriendsReducer';

export const FriendsMessengerView: FC<{}> = props =>
{
    const { friendsState = null, dispatchFriendsState = null } = useFriendsContext();
    const { activeChats = [], friends = [] } = friendsState;

    const [ isVisible, setIsVisible ] = useState(false);
    const [ selectedChatIndex, setSelectedChatIndex ] = useState(0);
    const [ message, setMessage ] = useState('');

    const messagesBox = useRef<HTMLDivElement>();
    
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

        if(parts.length < 3) return;

        const friendId = parseInt(parts[2]);

        let existingChatIndex = activeChats.findIndex(c => c.friendId === friendId);

        if(existingChatIndex === -1)
        {
            const clonedActiveChats = Array.from(activeChats);
            clonedActiveChats.push(new MessengerChat(friendId));

            dispatchFriendsState({
                type: FriendsActions.SET_ACTIVE_CHATS,
                payload: {
                    chats: clonedActiveChats
                }
            });

            existingChatIndex = clonedActiveChats.length - 1;
        }

        setSelectedChatIndex(existingChatIndex);
        setIsVisible(true);
    }, [ activeChats, dispatchFriendsState ]);

    const getFriendFigure = useCallback((id: number) =>
    {
        const friend = friends.find(f => f.id === id);

        if(!friend) return null;

        return friend.figure;
    }, [ friends ]);

    const selectChat = useCallback((index: number) =>
    {
        const chat = activeChats[index];

        if(!chat) return;

        dispatchFriendsState({
            type: FriendsActions.SET_CHAT_READ,
            payload: {
                numberValue: chat.friendId
            }
        });
        
        setSelectedChatIndex(index);
    }, [ activeChats, dispatchFriendsState ]);

    const selectedChat = useMemo(() =>
    {        
        return activeChats[selectedChatIndex];
    }, [ activeChats, selectedChatIndex ]);

    const selectedChatFriend = useMemo(() =>
    {
        if(!selectedChat) return null;

        const friend = friends.find(f => f.id === selectedChat.friendId);

        if(!friend) return null;

        return friend;
    }, [ friends, selectedChat ]);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived,
            eventUrlPrefix: 'friends/messenger/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ linkReceived ]);

    useEffect(() =>
    {
        if(!messagesBox || !messagesBox.current) return;
        
        messagesBox.current.scrollTop = messagesBox.current.scrollHeight;

    }, [ selectedChat ]);

    const followFriend = useCallback(() =>
    {
        SendMessageHook(new FollowFriendMessageComposer(selectedChatFriend.id));
    }, [ selectedChatFriend ]);

    const openProfile = useCallback(() =>
    {
        SendMessageHook(new UserProfileComposer(selectedChatFriend.id));
    }, [ selectedChatFriend ]);

    const sendMessage = useCallback(() =>
    {
        if(message.length === 0) return;

        SendMessageHook(new SendMessageComposer(selectedChat.friendId, message));

        dispatchFriendsState({
            type: FriendsActions.ADD_CHAT_MESSAGE,
            payload: {
                chatMessage: new MessengerChatMessage(MessengerChatMessage.MESSAGE, 0, message, (new Date().getMilliseconds())),
                numberValue: selectedChat.friendId,
                boolValue: false
            }
        });
        setMessage('');
    }, [ selectedChat, message, dispatchFriendsState ]);

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== 'Enter') return;

        sendMessage();
    }, [ sendMessage ]);

    if(!isVisible) return null;

    return (<NitroCardView className="nitro-friends-messenger" simple={ true }>
                <NitroCardHeaderView headerText={ LocalizeText('messenger.window.title', ['OPEN_CHAT_COUNT'], [activeChats.length.toString()]) } onCloseClick={ () => setIsVisible(false) } />
                <NitroCardContentView>
                    <div className="d-flex gap-2 overflow-auto pb-1">
                        { activeChats && activeChats.map((chat, index) =>
                        {
                            return <div key={ index } className="friend-head rounded flex-shrink-0 cursor-pointer bg-muted" onClick={ () => selectChat(index) }>
                                { !chat.isRead && <i className="icon icon-friendlist-new-message" /> }
                                <AvatarImageView figure={ getFriendFigure(chat.friendId) } headOnly={true} direction={3} />
                            </div>;
                        }) }
                    </div>
                    <hr className="bg-dark mt-3 mb-2" />
                    { selectedChat && selectedChatFriend && <>
                        <div className="text-black chat-title bg-light pe-2 position-absolute">{ LocalizeText('messenger.window.separator', ['FRIEND_NAME'], [ selectedChatFriend.name ]) }</div>
                        <div className="d-flex gap-2 mb-2">
                            <div className="btn-group">
                                <button className="btn btn-sm btn-primary" onClick={ followFriend }>
                                    <i className="icon icon-friendlist-follow" />
                                </button>
                                <button className="btn btn-sm btn-primary" onClick={ openProfile }>
                                    <i className="icon icon-user-profile" />
                                </button>
                            </div>
                            <button className="btn btn-sm btn-danger">{ LocalizeText('messenger.window.button.report') }</button>
                            <button className="btn btn-sm btn-primary ms-auto"><i className="fas fa-times" /></button>
                        </div>
                        <div ref={ messagesBox } className="bg-muted p-2 rounded chat-messages mb-2 d-flex flex-column">
                            { selectedChat.messageGroups.map((group, groupIndex) =>
                            {
                                return <div key={ groupIndex } className={ 'd-flex gap-2 w-100 justify-content-' + (group.userId === 0 ? 'end' : 'start') }>
                                    { group.isSystem && <>
                                        { group.messages.map((message, messageIndex) =>
                                            {
                                                return <div key={ messageIndex } className="text-break">
                                                    { message.type === MessengerChatMessage.SECURITY_ALERT && <div className="bg-light rounded mb-2 d-flex gap-2 px-2 py-1 small text-muted align-items-center">
                                                        <i className="icon icon-friendlist-warning flex-shrink-0" />
                                                        <div>{ LocalizeText('messenger.moderationinfo') }</div>
                                                    </div> }
                                                </div>
                                            }) }
                                    </> }
                                    { !group.isSystem && <>
                                        { group.userId !== 0 && <div className="message-avatar flex-shrink-0">
                                            <AvatarImageView figure={ selectedChatFriend.figure } direction={ 2 } />
                                        </div> }
                                        <div className={ 'bg-light text-black border-radius mb-2 rounded py-1 px-2 messages-group-' + (group.userId === 0 ? 'right' : 'left') }>
                                            { group.messages.map((message, messageIndex) =>
                                            {
                                                return <div key={ messageIndex } className="text-break">{ message.message }</div>
                                            }) }
                                        </div>
                                        { group.userId === 0 && <div className="message-avatar flex-shrink-0">
                                            <AvatarImageView figure={ GetSessionDataManager().figure } direction={ 4 } />
                                        </div> }
                                    </> }
                                </div>;
                            }) }
                        </div>
                        <div className="d-flex gap-2">
                            <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('messenger.window.input.default', ['FRIEND_NAME'], [ selectedChatFriend.name ]) } value={ message } onChange={ (e) => setMessage(e.target.value) } onKeyDown={ onKeyDown } />
                            <button className="btn btn-sm btn-success" onClick={ sendMessage }>{ LocalizeText('widgets.chatinput.say') }</button>
                        </div>
                    </> }
                </NitroCardContentView>
            </NitroCardView>);
};
