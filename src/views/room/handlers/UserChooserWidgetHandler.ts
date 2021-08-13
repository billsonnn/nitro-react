import { NitroEvent, RoomObjectCategory, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { RoomWidgetHandler } from '.';
import { GetRoomEngine } from '../../../api';
import { RoomObjectItem } from '../../../events/room-widgets/choosers/RoomObjectItem';
import { RoomWidgetChooserContentEvent } from '../../../events/room-widgets/choosers/RoomWidgetChooserContentEvent';
import { dispatchUiEvent } from '../../../hooks';
import { RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage, RoomWidgetRequestWidgetMessage, RoomWidgetRoomObjectMessage } from '../messages';
import { dynamicSort } from '../widgets/choosers/utils/sorting';

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
                this.processUserChooser();
                break;
            case RoomWidgetRoomObjectMessage.SELECT_OBJECT:
                this.selectUnit(message);
                break;
        }

        return null;
    }

    private processUserChooser(): void
    {

        if(this.container == null || this.container.roomSession == null || GetRoomEngine() == null || this.container.roomSession.userDataManager == null) return;

        const roomId = this.container.roomSession.roomId;
        const categoryId = RoomObjectCategory.UNIT;
        const units : RoomObjectItem[] = [];
        
        const roomObjects = GetRoomEngine().getRoomObjects(roomId, categoryId);

        roomObjects.forEach(roomObject => {
            if(!roomObject) return;

            const unitData = this.container.roomSession.userDataManager.getUserDataByIndex(roomObject.id);

            if(!unitData) return;

            units.push(new RoomObjectItem(unitData.roomIndex, categoryId, unitData.name));
        });

        units.sort(dynamicSort('name'));
        dispatchUiEvent(new RoomWidgetChooserContentEvent(RoomWidgetChooserContentEvent.USER_CHOOSER_CONTENT, units));
    }

    private selectUnit(k: RoomWidgetMessage): void
    {
        const event = k as RoomWidgetRoomObjectMessage;

        if(event == null) return;

        if(event.category === RoomObjectCategory.UNIT)
        {
            GetRoomEngine().selectRoomObject(this.container.roomSession.roomId, event.id, event.category);
        }
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
