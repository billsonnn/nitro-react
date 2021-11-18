import { NitroEvent, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { RoomWidgetUpdateEvent } from '..';
import { GetRoomEngine } from '../..';
import { RoomWidgetFurniToWidgetMessage, RoomWidgetMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class FurnitureTrophyWidgetHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
        return;
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        switch(message.type)
        {
            case RoomWidgetFurniToWidgetMessage.REQUEST_TROPHY: {
                const widgetMessage = (message as RoomWidgetFurniToWidgetMessage);
                const roomObject = GetRoomEngine().getRoomObject(widgetMessage.roomId, widgetMessage.objectId, widgetMessage.category);

                if(!roomObject) return;

                const color = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_COLOR);
                const extra = parseInt(roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_EXTRAS));

                let data  = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_DATA);

                const ownerName = data.substring(0, data.indexOf('\t'));

                data = data.substring((ownerName.length + 1), data.length);

                const date = data.substring(0, data.indexOf('\t'));
                const text = data.substr((date.length + 1), data.length);

                

                break;
            }
        }

        return null;
    }

    public get type(): string
    {
        return RoomWidgetEnum.FURNI_TROPHY_WIDGET;
    }

    public get eventTypes(): string[]
    {
        return [];
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetFurniToWidgetMessage.REQUEST_TROPHY
        ];
    }
}
