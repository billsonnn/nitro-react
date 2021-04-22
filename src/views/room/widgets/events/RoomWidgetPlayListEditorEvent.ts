import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetPlayListEditorEvent extends RoomWidgetUpdateEvent
{
    public static RWPLEE_SHOW_PLAYLIST_EDITOR: string = 'RWPLEE_SHOW_PLAYLIST_EDITOR';
    public static RWPLEE_HIDE_PLAYLIST_EDITOR: string = 'RWPLEE_HIDE_PLAYLIST_EDITOR';
    public static RWPLEE_INVENTORY_UPDATED: string = 'RWPLEE_INVENTORY_UPDATED';
    public static RWPLEE_SONG_DISK_INVENTORY_UPDATED: string = 'RWPLEE_SONG_DISK_INVENTORY_UPDATED';
    public static RWPLEE_PLAY_LIST_UPDATED: string = 'RWPLEE_PLAY_LIST_UPDATED';
    public static RWPLEE_PLAY_LIST_FULL: string = 'RWPLEE_PLAY_LIST_FULL';

    private _furniId: number;

    constructor(k: string, _arg_2: number = -1)
    {
        super(k);

        this._furniId = _arg_2;
    }

    public get furniId(): number
    {
        return this._furniId;
    }
}
