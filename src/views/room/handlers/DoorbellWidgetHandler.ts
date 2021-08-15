import { NitroEvent, RoomSessionDoorbellEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { RoomWidgetDoorbellEvent, RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetLetUserInMessage, RoomWidgetMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class DoorbellWidgetHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
        const doorbellEvent = (event as RoomSessionDoorbellEvent);

        switch(event.type)
        {
            case RoomSessionDoorbellEvent.DOORBELL:
                this.container.eventDispatcher.dispatchEvent(new RoomWidgetDoorbellEvent(RoomWidgetDoorbellEvent.RINGING, doorbellEvent.userName));
                return;
            case RoomSessionDoorbellEvent.RSDE_REJECTED:
                this.container.eventDispatcher.dispatchEvent(new RoomWidgetDoorbellEvent(RoomWidgetDoorbellEvent.REJECTED, doorbellEvent.userName));
                return;
            case RoomSessionDoorbellEvent.RSDE_ACCEPTED:
                this.container.eventDispatcher.dispatchEvent(new RoomWidgetDoorbellEvent(RoomWidgetDoorbellEvent.ACCEPTED, doorbellEvent.userName));
                return;
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        switch(message.type)
        {
            case RoomWidgetLetUserInMessage.LET_USER_IN:
                const letUserInMessage = (message as RoomWidgetLetUserInMessage);
                
                this.container.roomSession.sendDoorbellApprovalMessage(letUserInMessage.userName, letUserInMessage.canEnter);
                break;
        }

        return null;
    }

    public get type(): string
    {
        return RoomWidgetEnum.DOORBELL;
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionDoorbellEvent.DOORBELL,
            RoomSessionDoorbellEvent.RSDE_REJECTED,
            RoomSessionDoorbellEvent.RSDE_ACCEPTED
        ];
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetLetUserInMessage.LET_USER_IN
        ];
    }
}
