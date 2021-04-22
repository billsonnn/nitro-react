import { IObjectData, RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetFurniInfostandUpdateEvent extends RoomWidgetUpdateEvent
{
    public static FURNI: string = 'RWFIUE_FURNI';

    private _id: number = 0;
    private _category: number = 0;
    private _name: string = '';
    private _description: string = '';
    private _image: HTMLImageElement = null;
    private _isWallItem: boolean = false;
    private _isStickie: boolean = false;
    private _isRoomOwner: boolean = false;
    private _roomControllerLevel: number = 0;
    private _isAnyRoomController: boolean = false;
    private _expiration: number = -1;
    private _purchaseCatalogPageId: number = -1;
    private _purchaseOfferId: number = -1;
    private _extraParam: string = '';
    private _isOwner: boolean = false;
    private _stuffData: IObjectData = null;
    private _groupId: number = 0;
    private _ownerId: number = 0;
    private _ownerName: string = '';
    private _usagePolicy: number = 0;
    private _rentCatalogPageId: number = -1;
    private _rentOfferId: number = -1;
    private _purchaseCouldBeUsedForBuyout: boolean = false;
    private _rentCouldBeUsedForBuyout: boolean = false;
    private _availableForBuildersClub: boolean = false;

    public set id(k: number)
    {
        this._id = k;
    }

    public get id(): number
    {
        return this._id;
    }

    public set category(k: number)
    {
        this._category = k;
    }

    public get category(): number
    {
        return this._category;
    }

    public set name(k: string)
    {
        this._name = k;
    }

    public get name(): string
    {
        return this._name;
    }

    public set description(k: string)
    {
        this._description = k;
    }

    public get description(): string
    {
        return this._description;
    }

    public set image(k: HTMLImageElement)
    {
        this._image = k;
    }

    public get image(): HTMLImageElement
    {
        return this._image;
    }

    public set isWallItem(k: boolean)
    {
        this._isWallItem = k;
    }

    public get isWallItem(): boolean
    {
        return this._isWallItem;
    }

    public set isStickie(k: boolean)
    {
        this._isStickie = k;
    }

    public get isStickie(): boolean
    {
        return this._isStickie;
    }

    public set isRoomOwner(k: boolean)
    {
        this._isRoomOwner = k;
    }

    public get isRoomOwner(): boolean
    {
        return this._isRoomOwner;
    }

    public set roomControllerLevel(k: number)
    {
        this._roomControllerLevel = k;
    }

    public get roomControllerLevel(): number
    {
        return this._roomControllerLevel;
    }

    public set isAnyRoomOwner(k: boolean)
    {
        this._isAnyRoomController = k;
    }

    public get isAnyRoomOwner(): boolean
    {
        return this._isAnyRoomController;
    }

    public set expiration(k: number)
    {
        this._expiration = k;
    }

    public get expiration(): number
    {
        return this._expiration;
    }

    public set purchaseOfferId(k: number)
    {
        this._purchaseOfferId = k;
    }

    public get purchaseOfferId(): number
    {
        return this._purchaseOfferId;
    }

    public set extraParam(k: string)
    {
        this._extraParam = k;
    }

    public get extraParam(): string
    {
        return this._extraParam;
    }

    public set isOwner(k: boolean)
    {
        this._isOwner = k;
    }

    public get isOwner(): boolean
    {
        return this._isOwner;
    }

    public set stuffData(k: IObjectData)
    {
        this._stuffData = k;
    }

    public get stuffData(): IObjectData
    {
        return this._stuffData;
    }

    public set groupId(k: number)
    {
        this._groupId = k;
    }

    public get groupId(): number
    {
        return this._groupId;
    }

    public set ownerId(k: number)
    {
        this._ownerId = k;
    }

    public get ownerId(): number
    {
        return this._ownerId;
    }

    public set ownerName(k: string)
    {
        this._ownerName = k;
    }

    public get ownerName(): string
    {
        return this._ownerName;
    }

    public set usagePolicy(k: number)
    {
        this._usagePolicy = k;
    }

    public get usagePolicy(): number
    {
        return this._usagePolicy;
    }

    public set rentOfferId(k: number)
    {
        this._rentOfferId = k;
    }

    public get rentOfferId(): number
    {
        return this._rentOfferId;
    }

    public get purchaseCouldBeUsedForBuyout(): boolean
    {
        return this._purchaseCouldBeUsedForBuyout;
    }

    public set purchaseCouldBeUsedForBuyout(k: boolean)
    {
        this._purchaseCouldBeUsedForBuyout = k;
    }

    public get rentCouldBeUsedForBuyout(): boolean
    {
        return this._rentCouldBeUsedForBuyout;
    }

    public set rentCouldBeUsedForBuyout(k: boolean)
    {
        this._rentCouldBeUsedForBuyout = k;
    }

    public get availableForBuildersClub(): boolean
    {
        return this._availableForBuildersClub;
    }

    public set availableForBuildersClub(k: boolean)
    {
        this._availableForBuildersClub = k;
    }
}
