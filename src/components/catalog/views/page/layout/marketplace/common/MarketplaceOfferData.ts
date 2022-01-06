import { IObjectData } from '@nitrots/nitro-renderer';

export class MarketplaceOfferData
{
    public static readonly TYPE_FLOOR: number = 1;
    public static readonly TYPE_WALL: number = 2;

    private _offerId: number;
    private _furniId: number;
    private _furniType: number;
    private _extraData: string;
    private _stuffData: IObjectData;
    private _price: number;
    private _averagePrice: number;
    private _imageCallback: number;
    private _status: number;
    private _timeLeftMinutes: number = -1;
    private _offerCount: number;
    private _image: string;

    constructor(offerId: number, furniId: number, furniType: number, extraData: string, stuffData: IObjectData, price: number, status: number, averagePrice: number, offerCount: number = -1)
    {
        this._offerId = offerId;
        this._furniId = furniId;
        this._furniType = furniType;
        this._extraData = extraData;
        this._stuffData = stuffData;
        this._price = price;
        this._status = status;
        this._averagePrice = averagePrice;
        this._offerCount = offerCount;
    }

    public get offerId(): number
    {
        return this._offerId;
    }

    public set offerId(offerId: number)
    {
        this._offerId = offerId;
    }

    public get furniId(): number
    {
        return this._furniId;
    }

    public get furniType(): number
    {
        return this._furniType;
    }

    public get extraData(): string
    {
        return this._extraData;
    }

    public get stuffData(): IObjectData
    {
        return this._stuffData;
    }

    public get price(): number
    {
        return this._price;
    }

    public set price(price: number)
    {
        this._price = price;
    }

    public get averagePrice(): number
    {
        return this._averagePrice;
    }

    public get image(): string
    {
        return this._image;
    }

    public set image(image: string)
    {
        this._image = image;
    }

    public get imageCallback(): number
    {
        return this._imageCallback;
    }

    public set imageCallback(callback: number)
    {
        this._imageCallback = callback;
    }

    public get status(): number
    {
        return this._status;
    }

    public get timeLeftMinutes(): number
    {
        return this._timeLeftMinutes;
    }

    public set timeLeftMinutes(minutes: number)
    {
        this._timeLeftMinutes = minutes;
    }

    public get offerCount(): number
    {
        return this._offerCount;
    }

    public set offerCount(count: number)
    {
        this._offerCount = count;
    }

    public get isUniqueLimitedItem(): boolean
    {
        return (this.stuffData && (this.stuffData.uniqueSeries > 0));
    }
}
