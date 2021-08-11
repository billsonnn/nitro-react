import { NitroEvent, RoomObjectCategory, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { GetNitroInstance, GetRoomEngine, GetSessionDataManager } from '../../../api';
import { RoomObjectItem } from '../../../events/room-widgets/choosers/RoomObjectItem';
import { RoomWidgetChooserContentEvent } from '../../../events/room-widgets/choosers/RoomWidgetChooserContentEvent';
import { dispatchUiEvent } from '../../../hooks';
import { RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage, RoomWidgetRequestWidgetMessage, RoomWidgetRoomObjectMessage } from '../messages';
import { dynamicSort } from '../widgets/choosers/utils/sorting';
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
                this.processFurniChooser();
                break;
            case RoomWidgetRoomObjectMessage.SELECT_OBJECT:
                this.selectFurni(message);
                break;
        }

        return null;
    }

    private selectFurni(message: RoomWidgetMessage): void
    {
        const event = message as RoomWidgetRoomObjectMessage;

        if(event == null) return;

        if(event.category === RoomObjectCategory.WALL || event.category === RoomObjectCategory.FLOOR)
        {
            GetRoomEngine().selectRoomObject(this.container.roomSession.roomId, event.id, event.category);
        }
    }

    private processFurniChooser(): void
    {

        if(this.container == null || this.container.roomSession == null || GetRoomEngine() == null || this.container.roomSession.userDataManager == null) return;

        const roomId = this.container.roomSession.roomId;
        const furniInRoom : RoomObjectItem[] = [];

        furniInRoom.push(...GetRoomEngine().getRoomObjects(roomId, RoomObjectCategory.WALL).map<RoomObjectItem>(roomObject => {
            const type = roomObject.type;
            let name = null;
            if(type.startsWith('poster'))
            {
                const posterNumber = Number.parseInt(type.replace('poster', ''));
                name = GetNitroInstance().localization.getValue('poster_' + posterNumber + '_name');
            }
            else
            {
                const furniTypeId = Number.parseInt(roomObject.model.getValue(RoomObjectVariable.FURNITURE_TYPE_ID));
                const wallItemData = GetSessionDataManager().getWallItemData(furniTypeId);
                if(wallItemData != null && wallItemData.name.length > 0)
                {
                    name = wallItemData.name;
                }
                else
                {
                    name = type;
                }
            }
            return new RoomObjectItem(roomObject.id, RoomObjectCategory.WALL, name)
        }));

        furniInRoom.push(...GetRoomEngine().getRoomObjects(roomId, RoomObjectCategory.FLOOR).map<RoomObjectItem>(roomObject => {
            const furniTypeId = Number.parseInt(roomObject.model.getValue(RoomObjectVariable.FURNITURE_TYPE_ID));
            const floorItemData = GetSessionDataManager().getFloorItemData(furniTypeId);
            const name = floorItemData != null ? floorItemData.name : roomObject.type;

            return new RoomObjectItem(roomObject.id, RoomObjectCategory.FLOOR, name);
        }));

        furniInRoom.sort(dynamicSort('name'));

        dispatchUiEvent(new RoomWidgetChooserContentEvent(RoomWidgetChooserContentEvent.FURNI_CHOOSER_CONTENT, furniInRoom, false));
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
