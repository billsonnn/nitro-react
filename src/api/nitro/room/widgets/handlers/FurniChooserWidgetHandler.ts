import { NitroEvent, RoomObjectCategory, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { GetRoomEngine, GetSessionDataManager } from '../../../..';
import { LocalizeText } from '../../../../utils';
import { RoomObjectItem, RoomWidgetChooserContentEvent, RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage, RoomWidgetRequestWidgetMessage, RoomWidgetRoomObjectMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class FurniChooserWidgetHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message) return null;

        switch(message.type)
        {
            case RoomWidgetRequestWidgetMessage.FURNI_CHOOSER:
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

        const wallItems = GetRoomEngine().getRoomObjects(roomId, RoomObjectCategory.WALL);
        const floorItems = GetRoomEngine().getRoomObjects(roomId, RoomObjectCategory.FLOOR);

        wallItems.forEach(roomObject =>
            {
                let name = roomObject.type;

                if(name.startsWith('poster'))
                {
                    name = LocalizeText(`poster_${ name.replace('poster', '') }_name`);
                }
                else
                {
                    const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);
                    const furniData = GetSessionDataManager().getWallItemData(typeId);

                    if(furniData && furniData.name.length) name = furniData.name;
                }

                items.push(new RoomObjectItem(roomObject.id, RoomObjectCategory.WALL, name));
            });

        floorItems.forEach(roomObject =>
            {
                let name = roomObject.type;

                const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);
                const furniData = GetSessionDataManager().getFloorItemData(typeId);

                if(furniData && furniData.name.length) name = furniData.name;

                items.push(new RoomObjectItem(roomObject.id, RoomObjectCategory.FLOOR, name));
            });

        items.sort((a, b) =>
            {
                return (a.name < b.name) ? -1 : 1;
            });

        this.container.eventDispatcher.dispatchEvent(new RoomWidgetChooserContentEvent(RoomWidgetChooserContentEvent.FURNI_CHOOSER_CONTENT, items));
    }

    private selectRoomObject(message: RoomWidgetRoomObjectMessage): void
    {
        if((message.category !== RoomObjectCategory.WALL) && (message.category !== RoomObjectCategory.FLOOR)) return;
        
        GetRoomEngine().selectRoomObject(this.container.roomSession.roomId, message.id, message.category);
    }
    
    public get type(): string
    {
        return RoomWidgetEnum.FURNI_CHOOSER;
    }

    public get eventTypes(): string[]
    {
        return [];
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetRequestWidgetMessage.FURNI_CHOOSER,
            RoomWidgetRoomObjectMessage.SELECT_OBJECT
        ];
    }
}
