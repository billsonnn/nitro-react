import { RoomWidgetUpdateEvent } from 'nitro-renderer';
import { RoomObjectItem } from './RoomObjectItem';

export class RoomWidgetChooserContentEvent extends RoomWidgetUpdateEvent
{
    public static RWCCE_USER_CHOOSER_CONTENT: string = 'RWCCE_USER_CHOOSER_CONTENT';
    public static RWCCE_FURNI_CHOOSER_CONTENT: string = 'RWCCE_FURNI_CHOOSER_CONTENT';

    private _items: RoomObjectItem[];
    private _Str_10043: boolean;

    constructor(k: string, _arg_2: RoomObjectItem[], _arg_3: boolean = false)
    {
        super(k);

        this._items = _arg_2.slice();
        this._Str_10043 = _arg_3;
    }

    public get items(): RoomObjectItem[]
    {
        return this._items;
    }

    public get _Str_2799(): boolean
    {
        return this._Str_10043;
    }
}
