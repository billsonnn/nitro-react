import { NitroEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { CreateLinkEvent } from '../../../CreateLinkEvent';
import { GetRoomEngine } from '../../GetRoomEngine';
import { RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class FurnitureInternalLinkHandler extends RoomWidgetHandler
{
    private static readonly INTERNALLINK = 'internalLink';

    public processEvent(event: NitroEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_INTERNAL_LINK:
                const linkEvent = event as RoomEngineTriggerWidgetEvent;
                const roomEngine = GetRoomEngine();
                if(!linkEvent || !roomEngine) return;

                const object = roomEngine.getRoomObject(linkEvent.roomId, linkEvent.objectId, linkEvent.category);
                if(object)
                {
                    let data = object.model.getValue<any>(RoomObjectVariable.FURNITURE_DATA);
                    let link = data[FurnitureInternalLinkHandler.INTERNALLINK];
                    if(!link || !link.length) link = object.model.getValue<string>(RoomObjectVariable.FURNITURE_INTERNAL_LINK);
                    if(link && link.length) CreateLinkEvent(link);
                }
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public get type(): string
    {
        return RoomWidgetEnum.INTERNAL_LINK;
    }

    public get eventTypes(): string[]
    {
        return [ RoomEngineTriggerWidgetEvent.REQUEST_INTERNAL_LINK ];
    }

    public get messageTypes(): string[]
    {
        return [];
    }
}
