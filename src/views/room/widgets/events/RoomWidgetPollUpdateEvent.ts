import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetPollUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWPUW_OFFER: string = 'RWPUW_OFFER';
    public static ERROR: string = 'RWPUW_ERROR';
    public static RWPUW_CONTENT: string = 'RWPUW_CONTENT';

    private _id: number = -1;
    private _summary: string;
    private _headline: string;
    private _Str_5366: number = 0;
    private _Str_5879: string = '';
    private _Str_4781: string = '';
    private _Str_5432: string[] = null;
    private _Str_20371: string = '';
    private _Str_4353: boolean = false;

    constructor(k: number, _arg_2: string)
    {
        super(_arg_2);

        this._id = k;
    }

    public get id(): number
    {
        return this._id;
    }

    public get summary(): string
    {
        return this._summary;
    }

    public set summary(k: string)
    {
        this._summary = k;
    }

    public get headline(): string
    {
        return this._headline;
    }

    public set headline(k: string)
    {
        this._headline = k;
    }

    public get _Str_6760(): number
    {
        return this._Str_5366;
    }

    public set _Str_6760(k: number)
    {
        this._Str_5366 = k;
    }

    public get _Str_6013(): string
    {
        return this._Str_5879;
    }

    public set _Str_6013(k: string)
    {
        this._Str_5879 = k;
    }

    public get _Str_5838(): string
    {
        return this._Str_4781;
    }

    public set _Str_5838(k: string)
    {
        this._Str_4781 = k;
    }

    public get _Str_5643(): string[]
    {
        return this._Str_5432;
    }

    public set _Str_5643(k: string[])
    {
        this._Str_5432 = k;
    }

    public get _Str_5302(): string
    {
        return this._Str_20371;
    }

    public set _Str_5302(k: string)
    {
        this._Str_20371 = k;
    }

    public get _Str_6196(): boolean
    {
        return this._Str_4353;
    }

    public set _Str_6196(k: boolean)
    {
        this._Str_4353 = k;
    }
}
