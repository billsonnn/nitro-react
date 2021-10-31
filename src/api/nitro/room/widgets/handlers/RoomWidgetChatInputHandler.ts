import { AvatarExpressionEnum, HabboClubLevelEnum, NitroEvent, RoomControllerLevel, RoomSessionChatEvent, RoomSettingsComposer, RoomWidgetEnum, RoomZoomEvent, TextureUtils } from '@nitrots/nitro-renderer';
import { GetConfiguration, GetNitroInstance } from '../../..';
import { GetRoomEngine, GetSessionDataManager } from '../../../..';
import { FloorplanEditorEvent } from '../../../../../events/floorplan-editor/FloorplanEditorEvent';
import { dispatchUiEvent } from '../../../../../hooks';
import { SendMessageHook } from '../../../../../hooks/messages';
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
                        case ':d':
                        case ';d':
                            if(GetSessionDataManager().clubLevel === HabboClubLevelEnum.VIP)
                            {
                                this.container.roomSession.sendExpressionMessage(AvatarExpressionEnum.LAUGH.ordinal);
                            }

                            break;
                        case 'o/':
                        case '_o/':
                            this.container.roomSession.sendExpressionMessage(AvatarExpressionEnum.WAVE.ordinal);

                            return null;
                        case ':kiss':
                            if(GetSessionDataManager().clubLevel === HabboClubLevelEnum.VIP)
                            {
                                this.container.roomSession.sendExpressionMessage(AvatarExpressionEnum.BLOW.ordinal);

                                return null;
                            }

                            break;
                        case ':jump':
                            if(GetSessionDataManager().clubLevel === HabboClubLevelEnum.VIP)
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
                            GetRoomEngine().events.dispatchEvent(new RoomZoomEvent(this.container.roomSession.roomId, -1, true));

                            return null;
                        case ':zoom':
                            GetRoomEngine().events.dispatchEvent(new RoomZoomEvent(this.container.roomSession.roomId, parseInt(secondPart), false));

                            return null;
                        case ':screenshot':
                            const texture = GetRoomEngine().createTextureFromRoom(this.container.roomSession.roomId, 1);

                            const image = new Image();
                            
                            image.src = TextureUtils.generateImageUrl(texture);
                            
                            const newWindow = window.open('');
                            newWindow.document.write(image.outerHTML);
                            return null;
                        case ':pickall':
                            // this.container.notificationService.alertWithConfirm('${room.confirm.pick_all}', '${generic.alert.title}', () =>
                            // {
                            //     GetSessionDataManager().sendSpecialCommandMessage(':pickall');
                            // });

                            return null;
                        case ':furni':
                            this.container.processWidgetMessage(new RoomWidgetRequestWidgetMessage(RoomWidgetRequestWidgetMessage.FURNI_CHOOSER));

                            return null;
                        case ':chooser':
                            this.container.processWidgetMessage(new RoomWidgetRequestWidgetMessage(RoomWidgetRequestWidgetMessage.USER_CHOOSER));

                            return null;
                        case ':floor':
                        case ':bcfloor':
                            if(this.container.roomSession.controllerLevel >= RoomControllerLevel.ROOM_OWNER)
                            {
                                //this.container.processWidgetMessage(new RoomWidgetRequestWidgetMessage(RoomWidgetRequestWidgetMessage.FLOOR_EDITOR));
                                dispatchUiEvent(new FloorplanEditorEvent(FloorplanEditorEvent.SHOW_FLOORPLAN_EDITOR));
                            }

                            return null;
                        case ':togglefps': {
                            if(GetNitroInstance().ticker.maxFPS > 0) GetNitroInstance().ticker.maxFPS = 0;
                            else GetNitroInstance().ticker.maxFPS = GetConfiguration('system.animation.fps');

                            return null;
                        }
                        case ':client':
                        case ':nitro':
                        case ':billsonnn':
                            // this.container.notificationService.alertWithScrollableMessages([
                            //     '<div class="d-flex flex-column justify-content-center align-items-center"><div class="nitro-info-box"></div><b>Version: ' + Nitro.RELEASE_VERSION + '</b><br />This client is powered by Nitro HTML5<br /><br /><div class="d-flex"><a class="btn btn-primary" href="https://discord.gg/66UR68FPgy" target="_blank">Discord</a><a class="btn btn-primary" href="https://git.krews.org/nitro" target="_blank">Git</a></div><br /></div>'], 'Nitro HTML5');
                            return null;
                        case ':settings':
                            if(this.container.roomSession.isRoomOwner || GetSessionDataManager().isModerator)
                            {
                                SendMessageHook(new RoomSettingsComposer(this.container.roomSession.roomId));
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
