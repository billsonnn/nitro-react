import { RoomWidgetUpdateInfostandEvent } from './RoomWidgetUpdateInfostandEvent';

export class RoomWidgetUpdateInfostandRentableBotEvent extends RoomWidgetUpdateInfostandEvent
{
    public static RENTABLE_BOT: string = 'RWUIRBE_RENTABLE_BOT';

    public name: string = '';
    public motto: string = '';
    public webID: number = 0;
    public figure: string = '';
    public badges: string[] = [];
    public carryItem: number = 0;
    public roomIndex: number = 0;
    public amIOwner: boolean = false;
    public amIAnyRoomController: boolean = false;
    public roomControllerLevel: number = 0;
    public ownerId: number = -1;
    public ownerName: string = '';
    public botSkills: number[] = [];
}
