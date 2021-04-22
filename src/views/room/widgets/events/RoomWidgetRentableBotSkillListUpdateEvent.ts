import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetRentableBotSkillListUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWRBSLUE_SKILL_LIST: string = 'RWRBSLUE_SKILL_LIST';

    private _Str_2753: number;
    private _Str_6548: string[];

    constructor(k: number, _arg_2: string[])
    {
        super(RoomWidgetRentableBotSkillListUpdateEvent.RWRBSLUE_SKILL_LIST);

        this._Str_2753 = k;
        this._Str_6548 = _arg_2;
    }

    public get _Str_10833(): string[]
    {
        return this._Str_6548;
    }

    public get _Str_5455(): number
    {
        return this._Str_2753;
    }
}
