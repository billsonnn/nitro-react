import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateSongEvent extends RoomWidgetUpdateEvent
{
    public static PLAYING_CHANGED: string = 'RWUSE_PLAYING_CHANGED';
    public static DATA_RECEIVED: string = 'RWUSE_DATA_RECEIVED';

    private _songId: number;
    private _songName: string;
    private _songAuthor: string;

    constructor(type: string, songId: number, songName: string, songAuthor: string)
    {
        super(type);

        this._songId = songId;
        this._songName = songName;
        this._songAuthor = songAuthor;
    }

    public get songId(): number
    {
        return this._songId;
    }

    public get songName(): string
    {
        return this._songName;
    }

    public get songAuthor(): string
    {
        return this._songAuthor;
    }
}
