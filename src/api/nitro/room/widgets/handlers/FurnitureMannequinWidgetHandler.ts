import { NitroEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { RoomWidgetUpdateMannequinEvent } from '..';
import { GetRoomEngine } from '../../GetRoomEngine';
import { RoomWidgetUpdateEvent } from '../events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../messages/RoomWidgetMessage';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class FurnitureMannequinWidgetHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_MANNEQUIN: {
                const widgetEvent = (event as RoomEngineTriggerWidgetEvent);
                const roomObject = GetRoomEngine().getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);

                if(!roomObject) return;

                const model = roomObject.model;
                const figure = model.getValue<string>(RoomObjectVariable.FURNITURE_MANNEQUIN_FIGURE);
                const gender = model.getValue<string>(RoomObjectVariable.FURNITURE_MANNEQUIN_GENDER);
                const name = model.getValue<string>(RoomObjectVariable.FURNITURE_MANNEQUIN_NAME);

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateMannequinEvent(RoomWidgetUpdateMannequinEvent.MANNEQUIN_UPDATE, roomObject.id, figure, gender, name));
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
        return RoomWidgetEnum.MANNEQUIN;
    }

    public get eventTypes(): string[]
    {
        return [ RoomEngineTriggerWidgetEvent.REQUEST_MANNEQUIN ];
    }

    public get messageTypes(): string[]
    {
        return [];
    }
}
