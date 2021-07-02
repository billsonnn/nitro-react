import { NitroEvent, RoomSessionDanceEvent, RoomSessionUserDataUpdateEvent } from 'nitro-renderer';
import { GetRoomSession, GetSessionDataManager } from '../../../api';
import { RoomWidgetAvatarInfoEvent, RoomWidgetUpdateDanceStatusEvent, RoomWidgetUpdateEvent, RoomWidgetUserDataUpdateEvent } from '../events';
import { RoomWidgetAvatarExpressionMessage, RoomWidgetChangePostureMessage, RoomWidgetDanceMessage, RoomWidgetMessage, RoomWidgetRoomObjectMessage, RoomWidgetUserActionMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class RoomWidgetAvatarInfoHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomSessionUserDataUpdateEvent.USER_DATA_UPDATED:
                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUserDataUpdateEvent());
                return;
            case RoomSessionDanceEvent.RSDE_DANCE:
                const danceEvent = (event as RoomSessionDanceEvent);

                let isDancing = false;

                const userData = GetRoomSession().userDataManager.getUserData(GetSessionDataManager().userId);

                if(userData && (userData.roomIndex === danceEvent.roomIndex)) isDancing = (danceEvent.danceId !== 0);

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateDanceStatusEvent(isDancing));
                return;
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        let userId = 0;

        if(message instanceof RoomWidgetUserActionMessage) userId = message.userId;

        switch(message.type)
        {
            case RoomWidgetRoomObjectMessage.GET_OWN_CHARACTER_INFO:
                this.processOwnCharacterInfo();
                break;
            case RoomWidgetDanceMessage.DANCE: {
                const danceMessage = (message as RoomWidgetDanceMessage);

                GetRoomSession().sendDanceMessage(danceMessage.style);
                break;
            }
            case RoomWidgetAvatarExpressionMessage.AVATAR_EXPRESSION: {
                const expressionMessage = (message as RoomWidgetAvatarExpressionMessage);

                GetRoomSession().sendExpressionMessage(expressionMessage.animation.ordinal)
                break;
            }
            case RoomWidgetChangePostureMessage.CHANGE_POSTURE: {
                const postureMessage = (message as RoomWidgetChangePostureMessage);

                GetRoomSession().sendPostureMessage(postureMessage.posture);
                break;
            }
        }

        return null;
    }

    private processOwnCharacterInfo(): void
    {
        const userId = GetSessionDataManager().userId;
        const userName = GetSessionDataManager().userName;
        const allowNameChange = GetSessionDataManager().canChangeName;
        const userData = GetRoomSession().userDataManager.getUserData(userId);

        if(userData) this.container.eventDispatcher.dispatchEvent(new RoomWidgetAvatarInfoEvent(userId, userName, userData.type, userData.roomIndex, allowNameChange));
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionUserDataUpdateEvent.USER_DATA_UPDATED,
            RoomSessionDanceEvent.RSDE_DANCE
        ];
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetRoomObjectMessage.GET_OWN_CHARACTER_INFO,
            RoomWidgetDanceMessage.DANCE,
            RoomWidgetAvatarExpressionMessage.AVATAR_EXPRESSION,
            RoomWidgetChangePostureMessage.CHANGE_POSTURE
        ];
    }
}
