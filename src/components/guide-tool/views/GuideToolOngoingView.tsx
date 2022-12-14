import { GuideSessionGetRequesterRoomMessageComposer, GuideSessionInviteRequesterMessageComposer, GuideSessionMessageMessageComposer, GuideSessionRequesterRoomMessageEvent, GuideSessionResolvedMessageComposer } from '@nitrots/nitro-renderer';
import { FC, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { GetSessionDataManager, GuideToolMessageGroup, LocalizeText, SendMessageComposer, TryVisitRoom } from '../../../api';
import { Base, Button, ButtonGroup, Column, Flex, LayoutAvatarImageView, Text } from '../../../common';
import { useMessageEvent } from '../../../hooks';

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
            <Flex alignItems="center" justifyContent="between" gap={ 1 } className="bg-muted p-2 rounded">
                { isGuide &&
                    <ButtonGroup>
                        <Button onClick={ visit }>{ LocalizeText('guide.help.request.guide.ongoing.visit.button') }</Button>
                        <Button onClick={ invite }>{ LocalizeText('guide.help.request.guide.ongoing.invite.button') }</Button>
                    </ButtonGroup> }
                { !isGuide &&
                    <Column gap={ 0 }>
                        <Text bold>{ userName }</Text>
                        <Text>{ LocalizeText('guide.help.request.user.ongoing.guide.desc') }</Text>
                    </Column> }
                <Button variant="danger" disabled>{ LocalizeText('guide.help.common.report.link') }</Button>
            </Flex>
            <Column overflow="hidden" gap={ 1 } className="bg-muted rounded chat-messages p-2">
                <Column overflow="auto">
                    { messageGroups.map((group, index) =>
                    {
                        return (
                            <Flex key={ index } fullWidth justifyContent={ isOwnChat(group.userId) ? 'end' : 'start' } gap={ 2 }>
                                <Base shrink className="message-avatar">
                                    { (!isOwnChat(group.userId)) &&
                                    <LayoutAvatarImageView figure={ userFigure } direction={ 2 } /> }
                                </Base>
                                <Base className={ 'bg-light text-black border-radius mb-2 rounded py-1 px-2 messages-group-' + (isOwnChat(group.userId) ? 'right' : 'left') }>
                                    <Text bold>
                                        { (isOwnChat(group.userId)) && GetSessionDataManager().userName }
                                        { (!isOwnChat(group.userId)) && userName }
                                    </Text>
                                    { group.messages.map((chat, index) => <Base key={ index } pointer={ chat.roomId ? true : false } className={ chat.roomId ? 'text-break text-underline' : 'text-break' } onClick={ () => chat.roomId ? TryVisitRoom(chat.roomId) : null }>{ chat.message }</Base>) }
                                </Base>
                                { (isOwnChat(group.userId)) &&
                                <Base className="message-avatar flex-shrink-0">
                                    <LayoutAvatarImageView figure={ GetSessionDataManager().figure } direction={ 4 } />
                                </Base> }
                            </Flex>
                        );
                    }) }
                    <div ref={ scrollDiv } />
                </Column>
            </Column>
            <Column gap={ 1 }>
                <Flex gap={ 1 }>
                    <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('guide.help.request.guide.ongoing.input.empty', [ 'name' ], [ userName ]) } value={ messageText } onChange={ event => setMessageText(event.target.value) } onKeyDown={ onKeyDown } />
                    <Button variant="success" onClick={ sendMessage }>
                        { LocalizeText('widgets.chatinput.say') }
                    </Button>
                </Flex>
                { isTyping &&
                    <Text variant="muted">{ LocalizeText('guide.help.common.typing') }</Text> }
            </Column>
            <Button fullWidth variant="success" onClick={ resolve }>
                { LocalizeText('guide.help.request.' + (isGuide ? 'guide' : 'user') + '.ongoing.close.link') }
            </Button>
        </Column>
    );
};
