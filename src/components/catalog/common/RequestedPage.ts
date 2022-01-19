export class RequestedPage 
{
    public static REQUEST_TYPE_NONE: number = 0;
    public static REQUEST_TYPE_ID: number = 1;
    public static REQUEST_TYPE_NAME: number = 2;

    private _requestType: number;
    private _requestById: number;
    private _requestedOfferId: number;
    private _requestByName: string;

    constructor()
    {
        this._requestType = RequestedPage.REQUEST_TYPE_NONE;
    }

    public resetRequest():void
    {
        this._requestType = RequestedPage.REQUEST_TYPE_NONE;
        this._requestedOfferId = -1;
    }

    public get requestType(): number
    {
        return this._requestType;
    }

    public get requestById(): number
    {
        return this._requestById;
    }

    public set requestById(id: number)
    {
        this._requestType = RequestedPage.REQUEST_TYPE_ID;
        this._requestById = id;
    }

    public get requestByName(): string
    {
        return this._requestByName;
    }

    public set requestByName(name: string)
    {
        this._requestType = RequestedPage.REQUEST_TYPE_NAME;
        this._requestByName = name;
    }

    public get requestedOfferId(): number
    {
        return this._requestedOfferId;
    }

    public set requestedOfferId(offerId: number)
    {
        this._requestedOfferId = offerId;
    }
}
