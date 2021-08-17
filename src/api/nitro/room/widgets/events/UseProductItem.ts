export class UseProductItem
{
    private _id: number;
    private _category: number;
    private _name: string;
    private _requestRoomObjectId: number;
    private _targetRoomObjectId: number;
    private _requestInventoryStripId: number;
    private _replace: boolean;

    constructor(id: number, category: number, name: string, requestRoomObjectId: number, targetRoomObjectId: number, requestInventoryStripId: number, replace: boolean)
    {
        this._id = id;
        this._category = category;
        this._name = name;
        this._requestRoomObjectId = requestRoomObjectId;
        this._requestInventoryStripId = requestInventoryStripId;
        this._replace = replace;
    }

    public get id(): number
    {
        return this._id;
    }

    public get category(): number
    {
        return this._category;
    }

    public get name(): string
    {
        return this._name;
    }

    public get requestRoomObjectId(): number
    {
        return this._requestRoomObjectId;
    }

    public get requestInventoryStripId(): number
    {
        return this._requestInventoryStripId;
    }

    public get replace(): boolean
    {
        return this._replace;
    }
}
