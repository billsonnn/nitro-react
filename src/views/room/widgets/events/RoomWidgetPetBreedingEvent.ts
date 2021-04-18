import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetPetBreedingEvent extends RoomWidgetUpdateEvent
{
    public static _Str_18166: number = 0;
    public static _Str_16941: number = 1;
    public static _Str_17835: number = 2;
    public static _Str_16930: number = 3;
    public static RWPPBE_PET_BREEDING_: string = 'RWPPBE_PET_BREEDING_';

    private _state: number;
    private _Str_6614: number;
    private _Str_6649: number;

    constructor()
    {
        super(RoomWidgetPetBreedingEvent.RWPPBE_PET_BREEDING_);
    }

    public get state(): number
    {
        return this._state;
    }

    public set state(k: number)
    {
        this._state = k;
    }

    public get _Str_7440(): number
    {
        return this._Str_6614;
    }

    public set _Str_7440(k: number)
    {
        this._Str_6614 = k;
    }

    public get _Str_7663(): number
    {
        return this._Str_6649;
    }

    public set _Str_7663(k: number)
    {
        this._Str_6649 = k;
    }
}
