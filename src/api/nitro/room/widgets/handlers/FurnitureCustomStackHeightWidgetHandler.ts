import { NitroEvent, RoomEngineTriggerWidgetEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from '../../../..';
import { RoomWidgetUpdateCustomStackHeightEvent, RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class FurnitureCustomStackHeightWidgetHandler extends RoomWidgetHandler
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

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateCustomStackHeightEvent(this._lastFurniId, roomObject.getLocation().z));
                return;
            }
            case RoomEngineTriggerWidgetEvent.CLOSE_WIDGET: {
                const widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                if(widgetEvent.objectId !== this._lastFurniId) return;

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateCustomStackHeightEvent(-1));
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
        return RoomWidgetEnum.CUSTOM_STACK_HEIGHT;
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
