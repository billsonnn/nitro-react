import { GetYoutubeDisplayStatusMessageComposer, NitroEvent, RoomWidgetEnum, SecurityLevel } from '@nitrots/nitro-renderer';
import { RoomEngineTriggerWidgetEvent } from '@nitrots/nitro-renderer/';
import { RoomWidgetMessage, RoomWidgetUpdateEvent } from '..';
import { GetSessionDataManager, IsOwnerOfFurniture, SendMessageComposer } from '../../..';
import { GetRoomEngine } from '../../GetRoomEngine';
import { RoomWidgetUpdateYoutubeDisplayEvent } from '../events';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class FurnitureYoutubeDisplayWidgetHandler extends RoomWidgetHandler
{
    public static readonly CONTROL_COMMAND_PREVIOUS_VIDEO = 0;
    public static readonly CONTROL_COMMAND_NEXT_VIDEO = 1;
    public static readonly CONTROL_COMMAND_PAUSE_VIDEO = 2;
    public static readonly CONTROL_COMMAND_CONTINUE_VIDEO = 3;

    private _lastFurniId: number = -1;

    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.OPEN_WIDGET: {
                const widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                const roomObject = GetRoomEngine().getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);

                if(!roomObject) return;

                this._lastFurniId = widgetEvent.objectId;
                
                const hasControl = GetSessionDataManager().hasSecurity(SecurityLevel.EMPLOYEE) || IsOwnerOfFurniture(roomObject);
                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateYoutubeDisplayEvent(roomObject.id, hasControl));
                SendMessageComposer(new GetYoutubeDisplayStatusMessageComposer(this._lastFurniId));
                return;
            }
            case RoomEngineTriggerWidgetEvent.CLOSE_WIDGET: {
                const widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                if(widgetEvent.objectId !== this._lastFurniId) return;

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateYoutubeDisplayEvent(-1));
                return;
            }
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        switch(message.type)
        {
        }

        return null;
    }

    public get type(): string
    {
        return RoomWidgetEnum.YOUTUBE;
    }

    public get eventTypes(): string[]
    {
        return [];
    }

    public get messageTypes(): string[]
    {
        return [];
    }
}
