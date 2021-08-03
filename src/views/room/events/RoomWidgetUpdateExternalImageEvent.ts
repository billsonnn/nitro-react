import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateExternalImageEvent extends RoomWidgetUpdateEvent
{
    public static UPDATE_EXTERNAL_IMAGE: string = 'RWUCSHE_UPDATE_EXTERNAL_IMAGE';

    private _objectId: number;
    private _photoData: IPhotoData;

    constructor(objectId: number, photoData: IPhotoData = null)
    {
        super(RoomWidgetUpdateExternalImageEvent.UPDATE_EXTERNAL_IMAGE);

        this._objectId = objectId;
        this._photoData = photoData;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get photoData(): IPhotoData
    {
        return this._photoData;
    }
}

export interface IPhotoData
{
    /**
     * creator username
     */
    n?: string;

    /**
     * creator user id
     */
    s?: number;

    /**
     * photo unique id
     */
    u?: number;

    /**
     * creation timestamp
     */
    t?: number;

    /**
     * photo caption
     */
    m?: string;

    /**
     * photo image url
     */
    w?: string;
}
