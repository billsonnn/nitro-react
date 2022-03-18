import { RoomObjectItem } from './RoomObjectItem';
import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetChooserContentEvent extends RoomWidgetUpdateEvent
{
    public static USER_CHOOSER_CONTENT: string = 'RWCCE_USER_CHOOSER_CONTENT';
    public static FURNI_CHOOSER_CONTENT: string = 'RWCCE_FURNI_CHOOSER_CONTENT';

    private _items: RoomObjectItem[];
    private _isModerator: boolean;

    constructor(type: string, items: RoomObjectItem[], isModerator: boolean = false)
    {
        super(type);

        this._items = items;
        this._isModerator = isModerator;
    }

    public get items(): RoomObjectItem[]
    {
        return this._items;
    }

    public get isModerator(): boolean
    {
        return this._isModerator;
    }
}
