import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetConfirmPetBreedingResultEvent extends RoomWidgetUpdateEvent
{
    public static RWPPBE_CONFIRM_PET_BREEDING_RESULT: string = 'RWPPBE_CONFIRM_PET_BREEDING_RESULT';
    public static _Str_5196: number = 0;
    public static _Str_16705: number = 1;
    public static _Str_18855: number = 2;
    public static INVALID_NAME: number = 3;

    private _Str_6143: number;
    private _result: number;

    constructor(k: number, _arg_2: number)
    {
        super(RoomWidgetConfirmPetBreedingResultEvent.RWPPBE_CONFIRM_PET_BREEDING_RESULT);
        this._Str_6143 = k;
        this._result = _arg_2;
    }

    public get _Str_12769(): number
    {
        return this._Str_6143;
    }

    public get result(): number
    {
        return this._result;
    }
}
