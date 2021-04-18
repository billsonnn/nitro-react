import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetPresentDataUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWPDUE_PACKAGEINFO: string = 'RWPDUE_PACKAGEINFO';
    public static RWPDUE_CONTENTS: string = 'RWPDUE_CONTENTS';
    public static RWPDUE_CONTENTS_CLUB: string = 'RWPDUE_CONTENTS_CLUB';
    public static RWPDUE_CONTENTS_FLOOR: string = 'RWPDUE_CONTENTS_FLOOR';
    public static RWPDUE_CONTENTS_LANDSCAPE: string = 'RWPDUE_CONTENTS_LANDSCAPE';
    public static RWPDUE_CONTENTS_WALLPAPER: string = 'RWPDUE_CONTENTS_WALLPAPER';
    public static RWPDUE_CONTENTS_IMAGE: string = 'RWPDUE_CONTENTS_IMAGE';

    private _objectId: number = -1;
    private _classId: number = 0;
    private _itemType: string = '';
    private _giftMessage: string = '';
    private _extra: string = null;
    private _isController: boolean;
    private _purchaserName: string;
    private _purchaserFigure: string;
    private _placedItemId: number = -1;
    private _placedItemType: string = '';
    private _placedInRoom: boolean;

    constructor(type: string, objectId: number, giftMessage: string, isOwnerOfFurniture: boolean = false, extra: string = null, purchaserName: string = null, purchaserFigure: string = null)
    {
        super(type);

        this._objectId          = objectId;
        this._giftMessage       = giftMessage;
        this._extra             = extra;
        this._isController      = isOwnerOfFurniture;
        this._purchaserName     = purchaserName;
        this._purchaserFigure   = purchaserFigure;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get classId(): number
    {
        return this._classId;
    }

    public set classId(k: number)
    {
        this._classId = k;
    }

    public get itemType(): string
    {
        return this._itemType;
    }

    public set itemType(k: string)
    {
        this._itemType = k;
    }

    public get giftMessage(): string
    {
        return this._giftMessage;
    }

    public get extra(): string
    {
        return this._extra;
    }

    public get isController(): boolean
    {
        return this._isController;
    }

    public get purchaserName(): string
    {
        return this._purchaserName;
    }

    public get purchaserFigure(): string
    {
        return this._purchaserFigure;
    }

    public get placedItemId(): number
    {
        return this._placedItemId;
    }

    public set placedItemId(k: number)
    {
        this._placedItemId = k;
    }

    public get placedInRoom(): boolean
    {
        return this._placedInRoom;
    }

    public set placedInRoom(k: boolean)
    {
        this._placedInRoom = k;
    }

    public get placedItemType(): string
    {
        return this._placedItemType;
    }

    public set placedItemType(k: string)
    {
        this._placedItemType = k;
    }
}
