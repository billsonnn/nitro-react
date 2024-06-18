import { AddLinkEventTracker, FollowFriendMessageComposer, GetSessionDataManager, ILinkEventTracker, RemoveLinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { GetUserProfile, LocalizeText, ReportType, SendMessageComposer } from '../../../../api';
import { Button, Column, Flex, Grid, LayoutAvatarImageView, LayoutBadgeImageView, LayoutGridItem, LayoutItemCountView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useHelp, useMessenger } from '../../../../hooks';
import { NitroInput } from '../../../../layout';
import { FriendsMessengerThreadView } from './messenger-thread/FriendsMessengerThreadView';

export const FriendsMessengerView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ lastThreadId, setLastThreadId ] = useState(-1);
    const [ messageText, setMessageText ] = useState('');
    const { visibleThreads = [], activeThread = null, getMessageThread = null, sendMessage = null, setActiveThreadId = null, closeThread = null } = useMessenger();
    const { report = null } = useHelp();
    const messagesBox = useRef<HTMLDivElement>();

    const followFriend = () => (activeThread && activeThread.participant && SendMessageComposer(new FollowFriendMessageComposer(activeThread.participant.id)));
    const openProfile = () => (activeThread && activeThread.participant && GetUserProfile(activeThread.participant.id));

    const send = () =>
    {
        if(!activeThread || !messageText.length) return;

        sendMessage(activeThread, GetSessionDataManager().userId, messageText);

        setMessageText('');
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== 'Enter') return;

        send();
    };

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length === 2)
                {
                    if(parts[1] === 'open')
                    {
                        setIsVisible(true);

                        return;
                    }

                    if(parts[1] === 'toggle')
                    {
                        setIsVisible(prevValue => !prevValue);

                        return;
                    }

                    const thread = getMessageThread(parseInt(parts[1]));

                    if(!thread) return;

                    setActiveThreadId(thread.threadId);
                    setIsVisible(true);
                }
            },
            eventUrlPrefix: 'friends-messenger/'
        };

        AddLinkEventTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ getMessageThread, setActiveThreadId ]);

    useEffect(() =>
    {
        if(!isVisible || !activeThread) return;

        messagesBox.current.scrollTop = messagesBox.current.scrollHeight;
    }, [ isVisible, activeThread ]);

    useEffect(() =>
    {
        if(isVisible && !activeThread)
        {
            if(lastThreadId > 0)
            {
                setActiveThreadId(lastThreadId);
            }
            else
            {
                if(visibleThreads.length > 0) setActiveThreadId(visibleThreads[0].threadId);
            }

            return;
        }

        if(!isVisible && activeThread)
        {
            setLastThreadId(activeThread.threadId);
            setActiveThreadId(-1);
        }
    }, [ isVisible, activeThread, lastThreadId, visibleThreads, setActiveThreadId ]);

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-friends-messenger" theme="primary-slim" uniqueKey="nitro-friends-messenger">
            <NitroCardHeaderView headerText={ LocalizeText('messenger.window.title', [ 'OPEN_CHAT_COUNT' ], [ visibleThreads.length.toString() ]) } onCloseClick={ event => setIsVisible(false) } />
            <NitroCardContentView>
                <Grid overflow="hidden">
                    <Column overflow="hidden" size={ 4 }>
                        <Text bold>{ LocalizeText('toolbar.icon.label.messenger') }</Text>
                        <Column fit overflow="auto">
                            <div className="flex flex-col">
                                { visibleThreads && (visibleThreads.length > 0) && visibleThreads.map(thread =>
                                {
                                    return (
                                        <LayoutGridItem key={ thread.threadId } itemActive={ (activeThread === thread) } onClick={ event => setActiveThreadId(thread.threadId) }>
                                            { thread.unread &&
                                                <LayoutItemCountView count={ thread.unreadCount } /> }
                                            <div className="flex w-full items-center gap-1">
                                                <div className="flex items-center friend-head px-1">
                                                    { (thread.participant.id > 0) &&
                                                        <LayoutAvatarImageView direction={ 3 } figure={ thread.participant.figure } headOnly={ true } /> }
                                                    { (thread.participant.id <= 0) &&
                                                        <LayoutBadgeImageView badgeCode={ thread.participant.figure } isGroup={ true } /> }
                                                </div>
                                                <Text grow truncate>{ thread.participant.name }</Text>
                                            </div>
                                        </LayoutGridItem>
                                    );
                                }) }
                            </div>
                        </Column>
                    </Column>
                    <Column overflow="hidden" size={ 8 }>
                        { activeThread &&
                            <>
                                <Text bold center>{ LocalizeText('messenger.window.separator', [ 'FRIEND_NAME' ], [ activeThread.participant.name ]) }</Text>
                                <Flex alignItems="center" gap={ 1 } justifyContent="between">
                                    <div className="flex gap-1">
                                        <div className="relative inline-flex align-middle">
                                            <Button onClick={ followFriend }>
                                                <div className="nitro-friends-spritesheet icon-follow" />
                                            </Button>
                                            <Button onClick={ openProfile }>
                                                <div className="nitro-friends-spritesheet icon-profile-sm" />
                                            </Button>
                                        </div>
                                        <Button variant="danger" onClick={ () => report(ReportType.IM, { reportedUserId: activeThread.participant.id }) }>
                                            { LocalizeText('messenger.window.button.report') }
                                        </Button>
                                    </div>
                                    <Button onClick={ event => closeThread(activeThread.threadId) }>
                                        <FaTimes className="fa-icon" />
                                    </Button>
                                </Flex>
                                <Column fit className="bg-muted p-2 rounded chat-messages">
                                    <Column innerRef={ messagesBox } overflow="auto">
                                        <FriendsMessengerThreadView thread={ activeThread } />
                                    </Column>
                                </Column>
                                <div className="flex gap-1">
                                    <NitroInput maxLength={ 255 } placeholder={ LocalizeText('messenger.window.input.default', [ 'FRIEND_NAME' ], [ activeThread.participant.name ]) } type="text" value={ messageText } onChange={ event => setMessageText(event.target.value) } onKeyDown={ onKeyDown } />
                                    <Button variant="success" onClick={ send }>
                                        { LocalizeText('widgets.chatinput.say') }
                                    </Button>
                                </div>
                            </> }
                    </Column>
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    );
};
