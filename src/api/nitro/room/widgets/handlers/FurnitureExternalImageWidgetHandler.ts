import { NitroEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from '../../../..';
import { IPhotoData, RoomWidgetUpdateEvent, RoomWidgetUpdateExternalImageEvent } from '../events';
import { RoomWidgetMessage } from '../messages/RoomWidgetMessage';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class FurnitureExternalImageWidgetHandler extends RoomWidgetHandler
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
                const photoData = (JSON.parse(data) as IPhotoData);

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateExternalImageEvent(roomObject.id, photoData));
                return;
            }
            case RoomEngineTriggerWidgetEvent.CLOSE_WIDGET: {
                const widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                if(widgetEvent.objectId !== this._lastFurniId) return;

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateExternalImageEvent(-1));
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
        return RoomWidgetEnum.EXTERNAL_IMAGE;
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
