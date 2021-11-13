import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateYoutubeDisplayEvent extends RoomWidgetUpdateEvent
{
    public static UPDATE_YOUTUBE_DISPLAY: string = 'RWUEIE_UPDATE_YOUTUBE_DISPLAY';

    private _objectId: number;
    private _hasControl: boolean;

    constructor(objectId: number, hasControl = false)
    {
        super(RoomWidgetUpdateYoutubeDisplayEvent.UPDATE_YOUTUBE_DISPLAY);

        this._objectId = objectId;
        this._hasControl = hasControl;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get hasControl(): boolean
    {
        return this._hasControl;
    }
}
