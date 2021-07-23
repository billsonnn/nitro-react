import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';
import { UseProductItem } from './UseProductItem';

export class RoomWidgetUseProductBubbleEvent extends RoomWidgetUpdateEvent
{
    public static USE_PRODUCT_BUBBLES: string = 'RWUPBE_USE_PRODUCT_BUBBLES';

    private _items: UseProductItem[];

    constructor(type: string, items: UseProductItem[])
    {
        super(type);

        this._items = items;
    }

    public get items(): UseProductItem[]
    {
        return this._items;
    }
}
