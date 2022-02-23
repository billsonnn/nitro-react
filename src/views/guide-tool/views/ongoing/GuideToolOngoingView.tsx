import { GuideSessionGetRequesterRoomMessageComposer, GuideSessionInviteRequesterMessageComposer, GuideSessionRequesterRoomMessageEvent, GuideSessionResolvedMessageComposer } from '@nitrots/nitro-renderer';
import { GuideSessionMessageMessageComposer } from '@nitrots/nitro-renderer/src';
import { FC, KeyboardEvent, useCallback, useState } from 'react';
import { GetSessionDataManager, LocalizeText, TryVisitRoom } from '../../../../api';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroLayoutButton, NitroLayoutFlex } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { GuideToolOngoingViewProps } from './GuideToolOngoingView.types';

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
        <NitroCardContentView className="p-0">
            <div className="d-flex gap-2 align-items-center bg-secondary p-2 text-white">
                { isGuide && <div className="btn-group">
                    <button className="btn btn-light btn-sm" onClick={ visit }>{ LocalizeText('guide.help.request.guide.ongoing.visit.button') }</button>
                    <button className="btn btn-light btn-sm" disabled onClick={ invite }>{ LocalizeText('guide.help.request.guide.ongoing.invite.button') }</button>
                </div> }
                { !isGuide && <div>
                    <div className="fw-bold">{ userName }</div>
                    <div>{ LocalizeText('guide.help.request.user.ongoing.guide.desc') }</div>
                </div> }
                <div className="ms-auto text-decoration-underline cursor-pointer text-nowrap text-muted">{ LocalizeText('guide.help.common.report.link') }</div>
            </div>
            <div className="p-2 d-flex flex-column gap-1">
                <div className="text-black d-flex flex-column gap-2 p-2 chat-messages bg-muted rounded">
                    { messageGroups.map((group, index) =>
                    {
                        return (
                            <NitroLayoutFlex className={ 'w-100 justify-content-' + (isOwnChat(group.userId) ? 'end' : 'start') } gap={ 2 }>
                                <NitroLayoutBase className="message-avatar flex-shrink-0">
                                { (!isOwnChat(group.userId)) &&
                                    <AvatarImageView figure={ userFigure } direction={ 2 } />
                                }
                                </NitroLayoutBase>
                            <NitroLayoutBase className={ 'bg-light text-black border-radius mb-2 rounded py-1 px-2 messages-group-' + (isOwnChat(group.userId) ? 'right' : 'left') }>
                                <NitroLayoutBase className='fw-bold'>
                                    { (isOwnChat(group.userId)) && GetSessionDataManager().userName }
                                    { (!isOwnChat(group.userId)) && userName }
                                </NitroLayoutBase>
                                { group.messages.map((chat, index) =><NitroLayoutBase key={ index } className="text-break">{ chat.message }</NitroLayoutBase>) }
                            </NitroLayoutBase>
                            { (isOwnChat(group.userId)) &&
                                <NitroLayoutBase className="message-avatar flex-shrink-0">
                                    <AvatarImageView figure={ GetSessionDataManager().figure } direction={ 4 } />
                                </NitroLayoutBase> }
                        </NitroLayoutFlex>
                        );
                    }) } 
                </div>
                { isTyping && <div className="text-muted">{ LocalizeText('guide.help.common.typing') }</div> }
                <NitroLayoutFlex gap={ 2 }>
                    <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('guide.help.request.guide.ongoing.input.empty', [ 'name' ], [ userName ]) } value={ messageText } onChange={ event => setMessageText(event.target.value) } onKeyDown={ onKeyDown } />
                    <NitroLayoutButton variant="success" size="sm" onClick={ sendMessage }>
                        { LocalizeText('widgets.chatinput.say') }
                    </NitroLayoutButton>
                </NitroLayoutFlex>
            </div>
            <div className="d-flex flex-column gap-2 p-2 pt-0">
                <hr className="bg-dark m-0" />
                <div className="btn btn-success" onClick={ resolve }>{ LocalizeText('guide.help.request.' + (isGuide ? 'guide' : 'user') + '.ongoing.close.link') }</div>
            </div>
        </NitroCardContentView>
    );
};
