export class RequestedPage
{
    public static REQUEST_TYPE_NONE: number = 0;
    public static REQUEST_TYPE_ID: number = 1;
    public static REQUEST_TYPE_OFFER: number = 2;
    public static REQUEST_TYPE_NAME: number = 3;

    private _requestType: number;
    private _requestById: number;
    private _requestedByOfferId: number;
    private _requestByName: string;

    constructor()
    {
        this._requestType = RequestedPage.REQUEST_TYPE_NONE;
    }

    public resetRequest():void
    {
        this._requestType = RequestedPage.REQUEST_TYPE_NONE;
        this._requestById = -1;
        this._requestedByOfferId = -1;
        this._requestByName = null;
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

    public get requestedByOfferId(): number
    {
        return this._requestedByOfferId;
    }

    public set requestedByOfferId(offerId: number)
    {
        this._requestType = RequestedPage.REQUEST_TYPE_OFFER;
        this._requestedByOfferId = offerId;
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
}
