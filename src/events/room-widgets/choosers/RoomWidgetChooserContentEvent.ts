import { RoomWidgetUpdateEvent } from '../../../views/room/events';
import { RoomObjectItem } from './RoomObjectItem';

export class RoomWidgetChooserContentEvent extends RoomWidgetUpdateEvent
{
    public static USER_CHOOSER_CONTENT: string = 'RWCCE_USER_CHOOSER_CONTENT';
    public static FURNI_CHOOSER_CONTENT: string = 'RWCCE_FURNI_CHOOSER_CONTENT';

    private _items: RoomObjectItem[];
    private _isAnyRoomController: boolean;

    constructor(type: string, items: RoomObjectItem[], isAnyRoomController: boolean = false)
    {
        super(type);

        this._items = items.slice();
        this._isAnyRoomController = isAnyRoomController;
    }

    public get items(): RoomObjectItem[]
    {
        return this._items;
    }

    public get isAnyRoomController(): boolean
    {
        return this._isAnyRoomController;
    }
}
