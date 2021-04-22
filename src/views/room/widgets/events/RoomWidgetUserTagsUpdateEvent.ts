import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetUserTagsUpdateEvent extends RoomWidgetUpdateEvent
{
    public static USER_TAGS: string = 'RWUTUE_USER_TAGS';

    private _userId: number;
    private _tags: string[];
    private _Str_8426: boolean;

    constructor(k: number, _arg_2: string[], _arg_3: boolean)
    {
        super(RoomWidgetUserTagsUpdateEvent.USER_TAGS);

        this._userId    = k;
        this._tags      = _arg_2;
        this._Str_8426  = _arg_3;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get tags(): string[]
    {
        return this._tags;
    }

    public get _Str_11453(): boolean
    {
        return this._Str_8426;
    }
}
