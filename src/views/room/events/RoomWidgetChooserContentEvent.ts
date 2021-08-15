import { RoomObjectItem } from './RoomObjectItem';
import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetChooserContentEvent extends RoomWidgetUpdateEvent
{
    public static USER_CHOOSER_CONTENT: string = 'RWCCE_USER_CHOOSER_CONTENT';
    public static FURNI_CHOOSER_CONTENT: string = 'RWCCE_FURNI_CHOOSER_CONTENT';

    private _items: RoomObjectItem[];

    constructor(type: string, items: RoomObjectItem[])
    {
        super(type);

        this._items = items;
    }

    public get items(): RoomObjectItem[]
    {
        return this._items;
    }
}
