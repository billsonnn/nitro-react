import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetPlayListEditorNowPlayingEvent extends RoomWidgetUpdateEvent
{
    public static RWPLENPE_USER_PLAY_SONG: string = 'RWPLENPE_USER_PLAY_SONG';
    public static RWPLENPW_USER_STOP_SONG: string = 'RWPLENPW_USER_STOP_SONG';
    public static RWPLENPE_SONG_CHANGED: string = 'RWPLENPE_SONG_CHANGED';

    private _id: number;
    private _position: number;
    private _priority: number;

    constructor(k: string, _arg_2: number, _arg_3: number, _arg_4: number)
    {
        super(k);

        this._id = _arg_2;
        this._position = _arg_3;
        this._priority = _arg_4;
    }

    public get id(): number
    {
        return this._id;
    }

    public get position(): number
    {
        return this._position;
    }

    public get priority(): number
    {
        return this._priority;
    }
}
