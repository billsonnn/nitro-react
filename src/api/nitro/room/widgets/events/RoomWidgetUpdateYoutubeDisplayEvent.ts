import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateYoutubeDisplayEvent extends RoomWidgetUpdateEvent
{
    public static UPDATE_YOUTUBE_DISPLAY: string = 'RWUEIE_UPDATE_YOUTUBE_DISPLAY';

    private _objectId: number;

    constructor(objectId: number)
    {
        super(RoomWidgetUpdateYoutubeDisplayEvent.UPDATE_YOUTUBE_DISPLAY);

        this._objectId = objectId;
    }

    public get objectId(): number
    {
        return this._objectId;
    }
}
