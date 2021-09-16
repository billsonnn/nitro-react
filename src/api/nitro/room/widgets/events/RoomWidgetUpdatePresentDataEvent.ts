import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdatePresentDataEvent extends RoomWidgetUpdateEvent
{
    public static PACKAGEINFO: string = 'RWUPDE_PACKAGEINFO';
    public static CONTENTS: string = 'RWUPDE_CONTENTS';
    public static CONTENTS_CLUB: string = 'RWUPDE_CONTENTS_CLUB';
    public static CONTENTS_FLOOR: string = 'RWUPDE_CONTENTS_FLOOR';
    public static CONTENTS_LANDSCAPE: string = 'RWUPDE_CONTENTS_LANDSCAPE';
    public static CONTENTS_WALLPAPER: string = 'RWUPDE_CONTENTS_WALLPAPER';
    public static CONTENTS_IMAGE: string = 'RWUPDE_CONTENTS_IMAGE';

    private _objectId: number = -1;
    private _classId: number = 0;
    private _itemType: string = '';
    private _giftMessage: string = '';
    private _imageUrl: string = null;
    private _isController: boolean;
    private _purchaserName: string;
    private _purchaserFigure: string;
    private _placedItemId: number = -1;
    private _placedItemType: string = '';
    private _placedInRoom: boolean;

    constructor(type: string, objectId: number, giftMessage: string, isOwnerOfFurniture: boolean = false, imageUrl: string = null, purchaserName: string = null, purchaserFigure: string = null)
    {
        super(type);

        this._objectId = objectId;
        this._giftMessage = giftMessage;
        this._imageUrl = imageUrl;
        this._isController = isOwnerOfFurniture;
        this._purchaserName = purchaserName;
        this._purchaserFigure = purchaserFigure;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get classId(): number
    {
        return this._classId;
    }

    public set classId(classId: number)
    {
        this._classId = classId;
    }

    public get itemType(): string
    {
        return this._itemType;
    }

    public set itemType(type: string)
    {
        this._itemType = type;
    }

    public get giftMessage(): string
    {
        return this._giftMessage;
    }

    public get imageUrl(): string
    {
        return this._imageUrl;
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

    public set placedItemId(itemId: number)
    {
        this._placedItemId = itemId;
    }

    public get placedInRoom(): boolean
    {
        return this._placedInRoom;
    }

    public set placedInRoom(flag: boolean)
    {
        this._placedInRoom = flag;
    }

    public get placedItemType(): string
    {
        return this._placedItemType;
    }

    public set placedItemType(type: string)
    {
        this._placedItemType = type;
    }
}
