import { IMessageEvent, NitroEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { CreateLinkEvent } from '../../../CreateLinkEvent';
import { GetRoomEngine } from '../../GetRoomEngine';
import { RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class FurnitureRoomLinkHandler extends RoomWidgetHandler
{
    private static readonly INTERNALLINK = 'internalLink';

    private onRoomInfo(event: IMessageEvent): void
    {
        //todo
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_ROOM_LINK:
                const roomLinkEvent = (event as RoomEngineTriggerWidgetEvent);
                const roomEngine = GetRoomEngine();

                if(!roomLinkEvent || !roomEngine) return;

                const object = roomEngine.getRoomObject(roomLinkEvent.roomId, roomLinkEvent.objectId, roomLinkEvent.category);
                if(object)
                {
                    const data = object.model.getValue<any>(RoomObjectVariable.FURNITURE_DATA);
                    let roomId = data[FurnitureRoomLinkHandler.INTERNALLINK];
                    if(!roomId || !roomId.length) roomId = object.model.getValue<string>(RoomObjectVariable.FURNITURE_INTERNAL_LINK);
                    if(roomId && roomId.length) CreateLinkEvent('navigator/goto/' + roomId);
                }
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public get type(): string
    {
        return RoomWidgetEnum.ROOM_LINK;
    }

    public get eventTypes(): string[]
    {
        return [ RoomEngineTriggerWidgetEvent.REQUEST_ROOM_LINK ];
    }

    public get messageTypes(): string[]
    {
        return [];
    }
}
