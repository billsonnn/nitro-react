import { GetSessionDataManager, GuideSessionGetRequesterRoomMessageComposer, GuideSessionInviteRequesterMessageComposer, GuideSessionMessageMessageComposer, GuideSessionRequesterRoomMessageEvent, GuideSessionResolvedMessageComposer } from '@nitrots/nitro-renderer';
import { FC, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { GuideToolMessageGroup, LocalizeText, SendMessageComposer, TryVisitRoom } from '../../../api';
import { Button, Column, Flex, LayoutAvatarImageView, Text } from '../../../common';
import { useMessageEvent } from '../../../hooks';
import { NitroInput, classNames } from '../../../layout';

interface GuideToolOngoingViewProps
{
    isGuide: boolean;
    userId: number;
    userName: string;
    userFigure: string;
    isTyping: boolean;
    messageGroups: GuideToolMessageGroup[];
}

export const GuideToolOngoingView: FC<GuideToolOngoingViewProps> = props =>
{
    const scrollDiv = useRef<HTMLDivElement>(null);

    const { isGuide = false, userId = 0, userName = null, userFigure = null, isTyping = false, messageGroups = [] } = props;

    const [ messageText, setMessageText ] = useState<string>('');

    useEffect(() =>
    {
        scrollDiv.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });

    }, [ messageGroups ]);

    const visit = useCallback(() =>
    {
        SendMessageComposer(new GuideSessionGetRequesterRoomMessageComposer());
    }, []);

    const invite = useCallback(() =>
    {
        SendMessageComposer(new GuideSessionInviteRequesterMessageComposer());
    }, []);

    const resolve = useCallback(() =>
    {
        SendMessageComposer(new GuideSessionResolvedMessageComposer());
    }, []);

    useMessageEvent<GuideSessionRequesterRoomMessageEvent>(GuideSessionRequesterRoomMessageEvent, event =>
    {
        const parser = event.getParser();

        TryVisitRoom(parser.requesterRoomId);
    });

    const sendMessage = useCallback(() =>
    {
        if(!messageText || !messageText.length) return;

        SendMessageComposer(new GuideSessionMessageMessageComposer(messageText));
        setMessageText('');
    }, [ messageText ]);

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== 'Enter') return;

        sendMessage();
    }, [ sendMessage ]);

    const isOwnChat = useCallback((userId: number) =>
    {
        return userId === GetSessionDataManager().userId;
    }, []);

    return (
        <Column fullHeight>
            <Flex alignItems="center" className="p-2 rounded bg-muted" gap={ 1 } justifyContent="between">
                { isGuide &&
                    <div className="relative inline-flex align-middle">
                        <Button onClick={ visit }>{ LocalizeText('guide.help.request.guide.ongoing.visit.button') }</Button>
                        <Button onClick={ invite }>{ LocalizeText('guide.help.request.guide.ongoing.invite.button') }</Button>
                    </div> }
                { !isGuide &&
                    <Column gap={ 0 }>
                        <Text bold>{ userName }</Text>
                        <Text>{ LocalizeText('guide.help.request.user.ongoing.guide.desc') }</Text>
                    </Column> }
                <Button disabled variant="danger">{ LocalizeText('guide.help.common.report.link') }</Button>
            </Flex>
            <Column className="p-2 rounded bg-muted chat-messages" gap={ 1 } overflow="hidden">
                <Column overflow="auto">
                    { messageGroups.map((group, index) =>
                    {
                        return (
                            <Flex key={ index } fullWidth gap={ 2 } justifyContent={ isOwnChat(group.userId) ? 'end' : 'start' }>
                                <div className="flex-shrink-0 message-avatar">
                                    { (!isOwnChat(group.userId)) &&
                                        <LayoutAvatarImageView direction={ 2 } figure={ userFigure } /> }
                                </div>
                                <div className={ 'bg-light text-black border-radius mb-2 rounded py-1 px-2 messages-group-' + (isOwnChat(group.userId) ? 'right' : 'left') }>
                                    <Text bold>
                                        { (isOwnChat(group.userId)) && GetSessionDataManager().userName }
                                        { (!isOwnChat(group.userId)) && userName }
                                    </Text>
                                    { group.messages.map((chat, index) => <div key={ index } className={ classNames(chat.roomId ? 'text-break text-underline' : 'text-break', 'chat.roomId' && 'cursor-pointer') } onClick={ () => chat.roomId ? TryVisitRoom(chat.roomId) : null }>{ chat.message }</div>) }
                                </div>
                                { (isOwnChat(group.userId)) &&
                                    <div className="flex-shrink-0 message-avatar">
                                        <LayoutAvatarImageView direction={ 4 } figure={ GetSessionDataManager().figure } />
                                    </div> }
                            </Flex>
                        );
                    }) }
                    <div ref={ scrollDiv } />
                </Column>
            </Column>
            <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                    <NitroInput placeholder={ LocalizeText('guide.help.request.guide.ongoing.input.empty', [ 'name' ], [ userName ]) } type="text" value={ messageText } onChange={ event => setMessageText(event.target.value) } onKeyDown={ onKeyDown } />
                    <Button variant="success" onClick={ sendMessage }>
                        { LocalizeText('widgets.chatinput.say') }
                    </Button>
                </div>
                { isTyping &&
                    <Text variant="muted">{ LocalizeText('guide.help.common.typing') }</Text> }
            </div>
            <Button fullWidth variant="success" onClick={ resolve }>
                { LocalizeText('guide.help.request.' + (isGuide ? 'guide' : 'user') + '.ongoing.close.link') }
            </Button>
        </Column>
    );
};
