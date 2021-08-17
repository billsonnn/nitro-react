import { NitroEvent, RoomEngineTriggerWidgetEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage, RoomWidgetUseProductMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class FurnitureContextMenuWidgetHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        switch(message.type)
        {
            case RoomWidgetUseProductMessage.MONSTERPLANT_SEED:
                const productMessage = (message as RoomWidgetUseProductMessage);
                
                this.container.roomSession.useMultistateItem(productMessage.objectId);
                break;
        }

        return null;
    }

    public get type(): string
    {
        return RoomWidgetEnum.FURNITURE_CONTEXT_MENU;
    }

    public get eventTypes(): string[]
    {
        return [
            RoomEngineTriggerWidgetEvent.OPEN_FURNI_CONTEXT_MENU,
            RoomEngineTriggerWidgetEvent.CLOSE_FURNI_CONTEXT_MENU
        ];
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetUseProductMessage.MONSTERPLANT_SEED
        ];
    }
}
