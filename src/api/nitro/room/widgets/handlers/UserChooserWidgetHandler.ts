import { NitroEvent, RoomObjectCategory, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { RoomWidgetHandler } from '.';
import { GetRoomEngine } from '../../../..';
import { RoomObjectItem, RoomWidgetChooserContentEvent, RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage, RoomWidgetRequestWidgetMessage, RoomWidgetRoomObjectMessage } from '../messages';

export class UserChooserWidgetHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message) return null;

        switch(message.type)
        {
            case RoomWidgetRequestWidgetMessage.USER_CHOOSER:
                this.processChooser();
                break;
            case RoomWidgetRoomObjectMessage.SELECT_OBJECT:
                this.selectRoomObject((message as RoomWidgetRoomObjectMessage));
                break;
        }

        return null;
    }

    private processChooser(): void
    {
        const roomId = this.container.roomSession.roomId;
        const items: RoomObjectItem[] = [];

        const userItems = GetRoomEngine().getRoomObjects(roomId, RoomObjectCategory.UNIT);

        userItems.forEach(roomObject =>
            {
                const userData = this.container.roomSession.userDataManager.getUserDataByIndex(roomObject.id);

                if(!userData) return;

                items.push(new RoomObjectItem(userData.roomIndex, RoomObjectCategory.UNIT, userData.name));
            });

        items.sort((a, b) =>
        {
            return (a.name < b.name) ? -1 : 1;
        });

        this.container.eventDispatcher.dispatchEvent(new RoomWidgetChooserContentEvent(RoomWidgetChooserContentEvent.USER_CHOOSER_CONTENT, items));
    }

    private selectRoomObject(message: RoomWidgetRoomObjectMessage): void
    {
        if(message.category !== RoomObjectCategory.UNIT) return;
        
        GetRoomEngine().selectRoomObject(this.container.roomSession.roomId, message.id, message.category);
    }
    
    public get type(): string
    {
        return RoomWidgetEnum.USER_CHOOSER;
    }

    public get eventTypes(): string[]
    {
        return [];
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetRequestWidgetMessage.USER_CHOOSER,
            RoomWidgetRoomObjectMessage.SELECT_OBJECT
        ];
    }
}
