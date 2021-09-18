import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateYoutubeDisplayEvent extends RoomWidgetUpdateEvent
{
    public static UPDATE_YOUTUBE_DISPLAY: string = 'RWUEIE_UPDATE_YOUTUBE_DISPLAY';

    private _objectId: number;
    private _videoUrl: string;

    constructor(objectId: number, videoUrl: string = null)
    {
        super(RoomWidgetUpdateYoutubeDisplayEvent.UPDATE_YOUTUBE_DISPLAY);

        this._objectId = objectId;
        this._videoUrl = videoUrl;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get videoUrl(): string
    {
        return this._videoUrl;
    }
}
