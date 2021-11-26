import { FollowFriendMessageComposer, ILinkEventTracker, NewConsoleMessageEvent, SendMessageComposer } from '@nitrots/nitro-renderer';
import { FC, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AddEventLinkTracker, GetUserProfile, LocalizeText, RemoveLinkEventTracker } from '../../../../api';
import { PlaySound } from '../../../../api/utils/PlaySound';
import { FriendsMessengerIconEvent } from '../../../../events';
import { BatchUpdates, CreateMessageHook, dispatchUiEvent, SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroLayoutButton, NitroLayoutButtonGroup, NitroLayoutFlex, NitroLayoutFlexColumn } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { MessengerThread } from '../../common/MessengerThread';
import { MessengerThreadChat } from '../../common/MessengerThreadChat';
import { useFriendsContext } from '../../context/FriendsContext';
import { FriendsMessengerThreadView } from '../messenger-thread/FriendsMessengerThreadView';

export const FriendsMessengerView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ messageThreads, setMessageThreads ] = useState<MessengerThread[]>([]);
    const [ activeThreadIndex, setActiveThreadIndex ] = useState(-1);
    const [ hiddenThreadIndexes, setHiddenThreadIndexes ] = useState<number[]>([]);
    const [ messageText, setMessageText ] = useState('');
    const [ updateValue, setUpdateValue ] = useState({});
    const { friends = [] } = useFriendsContext();
    const messagesBox = useRef<HTMLDivElement>();

    const followFriend = useCallback(() =>
    {
        SendMessageHook(new FollowFriendMessageComposer(messageThreads[activeThreadIndex].participant.id));
    }, [ messageThreads, activeThreadIndex ]);

    const openProfile = useCallback(() =>
    {
        GetUserProfile(messageThreads[activeThreadIndex].participant.id);
    }, [ messageThreads, activeThreadIndex ]);

    const getFriend = useCallback((userId: number) =>
    {
        return ((friends.find(friend => (friend.id === userId))) || null);
    }, [ friends ]);

    const visibleThreads = useMemo(() =>
    {
        return messageThreads.filter((thread, index) =>
            {
                if(hiddenThreadIndexes.indexOf(index) >= 0) return false;

                return true;
            });
    }, [ messageThreads, hiddenThreadIndexes ]);

    const getMessageThreadWithIndex = useCallback<(userId: number) => [ number, MessengerThread ]>((userId: number) =>
    {
        if(messageThreads.length > 0)
        {
            for(let i = 0; i < messageThreads.length; i++)
            {
                const thread = messageThreads[i];

                if(thread.participant && (thread.participant.id === userId))
                {
                    const hiddenIndex = hiddenThreadIndexes.indexOf(i);

                    if(hiddenIndex >= 0)
                    {
                        setHiddenThreadIndexes(prevValue =>
                            {
                                const newIndexes = [ ...prevValue ];

                                newIndexes.splice(hiddenIndex, 1);

                                return newIndexes;
                            });
                    }

                    return [ i, thread ];
                }
            }
        }

        const friend = getFriend(userId);

        if(!friend) return [ -1, null ];

        const thread = new MessengerThread(friend);
        const newThreads = [ ...messageThreads, thread ];

        setMessageThreads(newThreads);

        return [ (newThreads.length - 1), thread ];
    }, [ messageThreads, hiddenThreadIndexes, getFriend ]);

    const onNewConsoleMessageEvent = useCallback((event: NewConsoleMessageEvent) =>
    {
        const parser = event.getParser();
        const [ threadIndex, thread ] = getMessageThreadWithIndex(parser.senderId);

        if((threadIndex === -1) || !thread) return;

        thread.addMessage(parser.senderId, parser.messageText, parser.secondsSinceSent, parser.extraData);

        setMessageThreads(prevValue => [ ...prevValue ]);
    }, [ getMessageThreadWithIndex ]);

    CreateMessageHook(NewConsoleMessageEvent, onNewConsoleMessageEvent);

    const sendMessage = useCallback(() =>
    {
        if(!messageText || !messageText.length) return;

        if(activeThreadIndex === -1) return;

        const thread = messageThreads[activeThreadIndex];

        if(!thread) return;

        SendMessageHook(new SendMessageComposer(thread.participant.id, messageText));

        if(messageThreads.length === 1 && thread.groups.length === 1) PlaySound('messenger_new_thread');

        thread.addMessage(0, messageText, 0, null, MessengerThreadChat.CHAT);

        BatchUpdates(() =>
        {
            setMessageThreads(prevValue => [ ...prevValue ]);
            setMessageText('');
        });
    }, [ messageThreads, activeThreadIndex, messageText ]);

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== 'Enter') return;

        sendMessage();
    }, [ sendMessage ]);

    const linkReceived = useCallback((url: string) =>
    {
        const parts = url.split('/');

        if(parts.length < 3) return;

        if(parts[2] === 'open')
        {
            setIsVisible(true);

            return;
        }

        const [ threadIndex ] = getMessageThreadWithIndex(parseInt(parts[2]));

        if(threadIndex === -1) return;

        BatchUpdates(() =>
        {
            setActiveThreadIndex(threadIndex);
            setIsVisible(true);
        });
    }, [ getMessageThreadWithIndex ]);

    const closeThread = useCallback((threadIndex: number) =>
    {
        setHiddenThreadIndexes(prevValue =>
            {
                const values = [ ...prevValue ];

                if(values.indexOf(threadIndex) === -1) values.push(threadIndex);

                return values;
            });
    }, []);

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
        if(!isVisible) return;

        if(activeThreadIndex === -1) setActiveThreadIndex(0);
    }, [ isVisible, activeThreadIndex ]);

    useEffect(() =>
    {
        if(hiddenThreadIndexes.indexOf(activeThreadIndex) >= 0) setActiveThreadIndex(0);
    }, [ activeThreadIndex, hiddenThreadIndexes ]);

    useEffect(() =>
    {
        if(!isVisible || (activeThreadIndex === -1)) return;

        const activeThread = messageThreads[activeThreadIndex];

        if(activeThread.unread)
        {
            messagesBox.current.scrollTop = messagesBox.current.scrollHeight;
            activeThread.setRead();
            setUpdateValue({});
        }
    }, [ isVisible, messageThreads, activeThreadIndex ]);

    useEffect(() =>
    {
        if(!visibleThreads.length)
        {
            setIsVisible(false);

            dispatchUiEvent(new FriendsMessengerIconEvent(FriendsMessengerIconEvent.UPDATE_ICON, FriendsMessengerIconEvent.HIDE_ICON));

            return;
        }

        let isUnread = false;

        for(const thread of visibleThreads)
        {
            if(thread.unread)
            {
                isUnread = true;

                break;
            }
        }

        if(isUnread) PlaySound('messenger_message_received');
        
        dispatchUiEvent(new FriendsMessengerIconEvent(FriendsMessengerIconEvent.UPDATE_ICON, isUnread ? FriendsMessengerIconEvent.UNREAD_ICON : FriendsMessengerIconEvent.SHOW_ICON));
    }, [ visibleThreads, updateValue ]);

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-friends-messenger" uniqueKey="nitro-friends-messenger" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('messenger.window.title', [ 'OPEN_CHAT_COUNT' ], [ visibleThreads.length.toString() ]) } onCloseClick={ event => setIsVisible(false) } />
            <NitroCardContentView>
                <NitroLayoutFlex gap={ 2 } overflow="auto">
                    { visibleThreads && (visibleThreads.length > 0) && visibleThreads.map((thread, index) =>
                        {
                            const messageThreadIndex = messageThreads.indexOf(thread);

                            return (
                                <div key={ index } className="position-relative friend-head rounded flex-shrink-0 cursor-pointer bg-muted" onClick={ event => setActiveThreadIndex(messageThreadIndex) }>
                                    { thread.unread &&
                                        <NitroLayoutBase className="position-absolute nitro-friends-spritesheet icon-new-message top-1 end-1 z-index-1" /> }
                                    <AvatarImageView figure={ thread.participant.figure } headOnly={ true } direction={ 3 } />
                                </div>
                            );
                        }) }
                </NitroLayoutFlex>
                <NitroLayoutFlex className="align-items-center my-1" position="relative">
                    { (activeThreadIndex >= 0) &&
                        <NitroLayoutBase className="text-black bg-light pe-2 flex-none">
                            { LocalizeText('messenger.window.separator', [ 'FRIEND_NAME' ], [ messageThreads[activeThreadIndex].participant.name ]) }
                        </NitroLayoutBase> }
                    <hr className="bg-dark m-0 w-100" />
                </NitroLayoutFlex>
                { (activeThreadIndex >= 0) &&
                    <>
                        <NitroLayoutFlex className="mb-2" gap={ 2 }>
                            <NitroLayoutButtonGroup>
                                <NitroLayoutButton variant="primary" size="sm" onClick={ followFriend }>
                                    <NitroLayoutBase className="nitro-friends-spritesheet icon-follow" />
                                </NitroLayoutButton>
                                <NitroLayoutButton variant="primary" size="sm" onClick={ openProfile }>
                                    <NitroLayoutBase className="nitro-friends-spritesheet icon-profile-sm" />
                                </NitroLayoutButton>
                            </NitroLayoutButtonGroup>
                            <NitroLayoutButton variant="danger" size="sm" onClick={ openProfile }>
                                { LocalizeText('messenger.window.button.report') }
                            </NitroLayoutButton>
                            <NitroLayoutButton className="ms-auto" variant="primary" size="sm" onClick={ event => closeThread(activeThreadIndex) }>
                                <NitroLayoutBase className="fas fa-times" />
                            </NitroLayoutButton>
                        </NitroLayoutFlex>
                        <NitroLayoutFlexColumn innerRef={ messagesBox } className="bg-muted p-2 rounded chat-messages mb-2">
                            <FriendsMessengerThreadView thread={ messageThreads[activeThreadIndex] } />
                        </NitroLayoutFlexColumn>
                        <NitroLayoutFlex gap={ 2 }>
                            <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('messenger.window.input.default', [ 'FRIEND_NAME' ], [ messageThreads[activeThreadIndex].participant.name ]) } value={ messageText } onChange={ event => setMessageText(event.target.value) } onKeyDown={ onKeyDown } />
                            <NitroLayoutButton variant="success" size="sm" onClick={ sendMessage }>
                                { LocalizeText('widgets.chatinput.say') }
                            </NitroLayoutButton>
                        </NitroLayoutFlex>
                    </> }
            </NitroCardContentView>
        </NitroCardView>
    );
}
