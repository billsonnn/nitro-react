export class RequestedPage 
{
    public static REQUEST_TYPE_NONE: number = 0;
    public static REQUEST_TYPE_ID: number = 1;
    public static REQUEST_TYPE_NAME: number = 2;

    private _requestType: number;
    private _requestId: number;
    private _requestedOfferId: number;
    private _requestName: string;

    constructor()
    {
        this._requestType = RequestedPage.REQUEST_TYPE_NONE;
    }

    public setRequestById(id: number):void
    {
        this._requestType = RequestedPage.REQUEST_TYPE_ID;
        this._requestId = id;
    }

    public setRequestByName(name: string):void
    {
        this._requestType = RequestedPage.REQUEST_TYPE_NAME;
        this._requestName = name;
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

    public get requestId(): number
    {
        return this._requestId;
    }

    public get requestedOfferId(): number
    {
        return this._requestedOfferId;
    }

    public set requestedOfferId(offerId: number)
    {
        this._requestedOfferId = offerId;
    }

    public get requestName(): string
    {
        return this._requestName;
    }
}
