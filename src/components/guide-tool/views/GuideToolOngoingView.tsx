import { GuideSessionGetRequesterRoomMessageComposer, GuideSessionInviteRequesterMessageComposer, GuideSessionRequesterRoomMessageEvent, GuideSessionResolvedMessageComposer } from '@nitrots/nitro-renderer';
import { GuideSessionMessageMessageComposer } from '@nitrots/nitro-renderer/src';
import { FC, KeyboardEvent, useCallback, useState } from 'react';
import { GetSessionDataManager, LocalizeText, TryVisitRoom } from '../../../api';
import { Base, Button, ButtonGroup, Column, Flex, Text } from '../../../common';
import { CreateMessageHook, SendMessageHook } from '../../../hooks';
import { NitroLayoutBase } from '../../../layout/base';
import { AvatarImageView } from '../../../views/shared/avatar-image/AvatarImageView';
import { GuideToolMessageGroup } from '../common/GuideToolMessageGroup';

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
    const { isGuide = false, userId = 0, userName = null, userFigure = null, isTyping = false, messageGroups = [] } = props;

    const [ messageText, setMessageText ] = useState<string>('');

    const visit = useCallback(() =>
    {
        SendMessageHook(new GuideSessionGetRequesterRoomMessageComposer());
    }, []);

    const invite = useCallback(() =>
    {
        SendMessageHook(new GuideSessionInviteRequesterMessageComposer());
    }, []);

    const resolve = useCallback(() =>
    {
        SendMessageHook(new GuideSessionResolvedMessageComposer());
    }, []);

    const onGuideSessionRequesterRoomMessageEvent = useCallback((event: GuideSessionRequesterRoomMessageEvent) =>
    {
        const parser = event.getParser();
        
        TryVisitRoom(parser.requesterRoomId);
    }, []);

    CreateMessageHook(GuideSessionRequesterRoomMessageEvent, onGuideSessionRequesterRoomMessageEvent);

    const sendMessage = useCallback(() =>
    {
        if(!messageText || !messageText.length) return;

        SendMessageHook(new GuideSessionMessageMessageComposer(messageText));
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
                        <Button disabled onClick={ invite }>{ LocalizeText('guide.help.request.guide.ongoing.invite.button') }</Button>
                    </ButtonGroup> }
                { !isGuide &&
                    <Column gap={ 0 }>
                        <Text bold>{ userName }</Text>
                        <Text>{ LocalizeText('guide.help.request.user.ongoing.guide.desc') }</Text>
                    </Column> }
                <Button variant="danger" disabled>{ LocalizeText('guide.help.common.report.link') }</Button>
            </Flex>
            <Column fullHeight overflow="hidden" gap={ 1 } className="bg-muted rounded chat-messages p-2">
                <Column overflow="auto">
                    { messageGroups.map((group, index) =>
                        {
                            return (
                                <Flex fullWidth justifyContent={ isOwnChat(group.userId) ? 'end' : 'start' } gap={ 2 }>
                                    <Base shrink className="message-avatar">
                                        { (!isOwnChat(group.userId)) &&
                                            <AvatarImageView figure={ userFigure } direction={ 2 } /> }
                                    </Base>
                                    <Base className={ 'bg-light text-black border-radius mb-2 rounded py-1 px-2 messages-group-' + (isOwnChat(group.userId) ? 'right' : 'left') }>
                                        <Text bold>
                                            { (isOwnChat(group.userId)) && GetSessionDataManager().userName }
                                            { (!isOwnChat(group.userId)) && userName }
                                        </Text>
                                        { group.messages.map((chat, index) => <Base key={ index } className="text-break">{ chat.message }</Base>) }
                                    </Base>
                                    { (isOwnChat(group.userId)) &&
                                        <NitroLayoutBase className="message-avatar flex-shrink-0">
                                            <AvatarImageView figure={ GetSessionDataManager().figure } direction={ 4 } />
                                        </NitroLayoutBase> }
                                </Flex>
                            );
                        }) } 
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
