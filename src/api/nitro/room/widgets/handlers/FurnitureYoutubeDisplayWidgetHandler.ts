import { NitroEvent } from '@nitrots/nitro-renderer/src/core/events/NitroEvent';
import { GetYoutubeDisplayStatusMessageComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/furniture/youtube';
import { RoomEngineTriggerWidgetEvent } from '@nitrots/nitro-renderer/src/nitro/room/events/RoomEngineTriggerWidgetEvent';
import { RoomObjectVariable } from '@nitrots/nitro-renderer/src/nitro/room/object/RoomObjectVariable';
import { RoomWidgetEnum } from '@nitrots/nitro-renderer/src/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetMessage, RoomWidgetUpdateEvent } from '..';
import { SendMessageHook } from '../../../../../hooks';
import { GetRoomEngine } from '../../GetRoomEngine';
import { RoomWidgetUpdateYoutubeDisplayEvent } from '../events/RoomWidgetUpdateYoutubeDisplayEvent';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class FurnitureYoutubeDisplayWidgetHandler extends RoomWidgetHandler
{
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
                
                const data = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_DATA);
                
                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateYoutubeDisplayEvent(roomObject.id, data));
                SendMessageHook(new GetYoutubeDisplayStatusMessageComposer(this._lastFurniId));
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
