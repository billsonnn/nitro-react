import { AvatarExpressionEnum, HabboClubLevelEnum, NitroEvent, RoomControllerLevel, RoomRotatingEffect, RoomSessionChatEvent, RoomSettingsComposer, RoomShakingEffect, RoomWidgetEnum, RoomZoomEvent, TextureUtils } from '@nitrots/nitro-renderer';
import { GetClubMemberLevel, GetConfiguration, GetNitroInstance, SendMessageComposer } from '../../..';
import { GetRoomEngine, GetSessionDataManager, LocalizeText, NotificationUtilities } from '../../../..';
import { CreateLinkEvent } from '../../../CreateLinkEvent';
import { RoomWidgetFloodControlEvent, RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetChatMessage, RoomWidgetChatSelectAvatarMessage, RoomWidgetChatTypingMessage, RoomWidgetMessage, RoomWidgetRequestWidgetMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class RoomWidgetChatInputHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomSessionChatEvent.FLOOD_EVENT: {
                const floodEvent = (event as RoomSessionChatEvent);

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetFloodControlEvent(parseInt(floodEvent.message)));
            }
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        switch(message.type)
        {
            case RoomWidgetChatTypingMessage.TYPING_STATUS: {
                const typingMessage = (message as RoomWidgetChatTypingMessage);

                this.container.roomSession.sendChatTypingMessage(typingMessage.isTyping);
                break;
            }
            case RoomWidgetChatMessage.MESSAGE_CHAT: {
                const chatMessage = (message as RoomWidgetChatMessage);

                if(chatMessage.text === '') return null;

                let text = chatMessage.text;
                const parts = text.split(' ');

                if(parts.length > 0)
                {
                    const firstPart = parts[0];
                    let secondPart = '';

                    if(parts.length > 1) secondPart = parts[1];

                    if((firstPart.charAt(0) === ':') && (secondPart === 'x'))
                    {
                        const selectedAvatarId = GetRoomEngine().selectedAvatarId;

                        if(selectedAvatarId > -1)
                        {
                            const userData = this.container.roomSession.userDataManager.getUserDataByIndex(selectedAvatarId);

                            if(userData)
                            {
                                secondPart = userData.name;
                                text = chatMessage.text.replace(' x', (' ' + userData.name));
                            }
                        }
                    }

                    switch(firstPart.toLowerCase())
                    {
                        case ':shake':
                            RoomShakingEffect.init(2500, 5000);
                            RoomShakingEffect.turnVisualizationOn();
                            
                            return null;

                        case ':rotate':
                            RoomRotatingEffect.init(2500, 5000);
                            RoomRotatingEffect.turnVisualizationOn();
                            
                            return null;
                        case ':d':
                        case ';d':
                            if(GetClubMemberLevel() === HabboClubLevelEnum.VIP)
                            {
                                this.container.roomSession.sendExpressionMessage(AvatarExpressionEnum.LAUGH.ordinal);
                            }

                            break;
                        case 'o/':
                        case '_o/':
                            this.container.roomSession.sendExpressionMessage(AvatarExpressionEnum.WAVE.ordinal);

                            return null;
                        case ':kiss':
                            if(GetClubMemberLevel() === HabboClubLevelEnum.VIP)
                            {
                                this.container.roomSession.sendExpressionMessage(AvatarExpressionEnum.BLOW.ordinal);

                                return null;
                            }

                            break;
                        case ':jump':
                            if(GetClubMemberLevel() === HabboClubLevelEnum.VIP)
                            {
                                this.container.roomSession.sendExpressionMessage(AvatarExpressionEnum.JUMP.ordinal);

                                return null;
                            }

                            break;
                        case ':idle':
                            this.container.roomSession.sendExpressionMessage(AvatarExpressionEnum.IDLE.ordinal);

                            return null;
                        case '_b':
                            this.container.roomSession.sendExpressionMessage(AvatarExpressionEnum.RESPECT.ordinal);

                            return null;
                        case ':sign':
                            this.container.roomSession.sendSignMessage(parseInt(secondPart));

                            return null;
                        case ':iddqd':
                        case ':flip':
                            GetRoomEngine().events.dispatchEvent(new RoomZoomEvent(this.container.roomSession.roomId, -1, true));

                            return null;
                        case ':zoom':
                            GetRoomEngine().events.dispatchEvent(new RoomZoomEvent(this.container.roomSession.roomId, parseFloat(secondPart), false));

                            return null;
                        case ':screenshot':
                            const texture = GetRoomEngine().createTextureFromRoom(this.container.roomSession.roomId, 1);

                            const image = new Image();
                            
                            image.src = TextureUtils.generateImageUrl(texture);
                            
                            const newWindow = window.open('');
                            newWindow.document.write(image.outerHTML);
                            return null;
                        case ':pickall':
                            if(this.container.roomSession.isRoomOwner || GetSessionDataManager().isModerator)
                            {
                                NotificationUtilities.confirm(LocalizeText('room.confirm.pick_all'), () =>
                                {
                                    GetSessionDataManager().sendSpecialCommandMessage(':pickall');
                                },
                                null, null, null, LocalizeText('generic.alert.title'));
                            }

                            return null;
                        case ':furni':
                            this.container.processWidgetMessage(new RoomWidgetRequestWidgetMessage(RoomWidgetRequestWidgetMessage.FURNI_CHOOSER));

                            return null;
                        case ':chooser':
                            this.container.processWidgetMessage(new RoomWidgetRequestWidgetMessage(RoomWidgetRequestWidgetMessage.USER_CHOOSER));

                            return null;
                        case ':floor':
                        case ':bcfloor':
                            if(this.container.roomSession.controllerLevel >= RoomControllerLevel.ROOM_OWNER) CreateLinkEvent('floor-editor/show');
                            
                            return null;
                        case ':togglefps': {
                            if(GetNitroInstance().ticker.maxFPS > 0) GetNitroInstance().ticker.maxFPS = 0;
                            else GetNitroInstance().ticker.maxFPS = GetConfiguration('system.animation.fps');

                            return null;
                        }
                        case ':client':
                        case ':nitro':
                        case ':billsonnn':
                            NotificationUtilities.showNitroAlert();
                            return null;
                        case ':settings':
                            if(this.container.roomSession.isRoomOwner || GetSessionDataManager().isModerator)
                            {
                                SendMessageComposer(new RoomSettingsComposer(this.container.roomSession.roomId));
                            }

                            return null;
                    }
                }

                const styleId = chatMessage.styleId;

                if(this.container && this.container.roomSession)
                {
                    switch(chatMessage.chatType)
                    {
                        case RoomWidgetChatMessage.CHAT_DEFAULT:
                            this.container.roomSession.sendChatMessage(text, styleId);
                            break;
                        case RoomWidgetChatMessage.CHAT_SHOUT:
                            this.container.roomSession.sendShoutMessage(text, styleId);
                            break;
                        case RoomWidgetChatMessage.CHAT_WHISPER:
                            this.container.roomSession.sendWhisperMessage(chatMessage.recipientName, text, styleId);
                            break;
                    }
                }

                break;
            }
            case RoomWidgetChatSelectAvatarMessage.MESSAGE_SELECT_AVATAR: {
                const selectedEvent = (message as RoomWidgetChatSelectAvatarMessage);

                GetRoomEngine().setSelectedAvatar(selectedEvent.roomId, selectedEvent.objectId);
                break;
            }
        }

        return null;
    }

    public get type(): string
    {
        return RoomWidgetEnum.CHAT_INPUT_WIDGET;
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionChatEvent.FLOOD_EVENT
        ];
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetChatTypingMessage.TYPING_STATUS,
            RoomWidgetChatMessage.MESSAGE_CHAT,
            RoomWidgetChatSelectAvatarMessage.MESSAGE_SELECT_AVATAR
        ];
    }
}
