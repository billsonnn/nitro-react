import { FurnitureExchangeComposer, NitroEvent, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { RoomWidgetCreditFurniRedeemMessage, RoomWidgetUpdateCreditFurniEvent, RoomWidgetUpdateEvent } from '..';
import { GetRoomEngine } from '../..';
import { IsOwnerOfFurniture } from '../../..';
import { RoomWidgetFurniToWidgetMessage, RoomWidgetMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class FurnitureCreditWidgetHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
        return;
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        switch(message.type)
        {
            case RoomWidgetFurniToWidgetMessage.REQUEST_CREDITFURNI: {
                const creditMessage = (message as RoomWidgetFurniToWidgetMessage);

                const roomObject = GetRoomEngine().getRoomObject(creditMessage.roomId, creditMessage.objectId, creditMessage.category);

                if(!roomObject || !IsOwnerOfFurniture(roomObject)) return;

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateCreditFurniEvent(RoomWidgetUpdateCreditFurniEvent.CREDIT_FURNI_UPDATE, creditMessage.objectId, roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_CREDIT_VALUE), (roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_TYPE_ID) + '_' + creditMessage.type + '_' + creditMessage.objectId)));

                break;
            }
            case RoomWidgetCreditFurniRedeemMessage.REDEEM: {
                const redeemMessage = (message as RoomWidgetCreditFurniRedeemMessage);

                this.container.roomSession.connection.send(new FurnitureExchangeComposer(redeemMessage.objectId));

                break;
            }
        }

        return null;
    }

    public get type(): string
    {
        return RoomWidgetEnum.FURNI_CREDIT_WIDGET;
    }

    public get eventTypes(): string[]
    {
        return [];
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetFurniToWidgetMessage.REQUEST_CREDITFURNI,
            RoomWidgetCreditFurniRedeemMessage.REDEEM
        ];
    }
}
