import { RoomWidgetUpdateEvent } from 'nitro-renderer';
import { ConfirmPetBreedingPetData } from './ConfirmPetBreedingPetData';

export class RoomWidgetConfirmPetBreedingEvent extends RoomWidgetUpdateEvent
{
    public static RWPPBE_CONFIRM_PET_BREEDING_: string = 'RWPPBE_CONFIRM_PET_BREEDING_';

    private _Str_5743: number;
    private _pet1: ConfirmPetBreedingPetData;
    private _pet2: ConfirmPetBreedingPetData;
    private _Str_4447: string[];
    private _Str_6321: number;

    constructor(k: number, _arg_2: ConfirmPetBreedingPetData, _arg_3: ConfirmPetBreedingPetData, _arg_4: string[], _arg_5: number)
    {
        super(RoomWidgetConfirmPetBreedingEvent.RWPPBE_CONFIRM_PET_BREEDING_);
        this._Str_5743 = k;
        this._pet1 = _arg_2;
        this._pet2 = _arg_3;
        this._Str_4447 = _arg_4;
        this._Str_6321 = _arg_5;
    }

    public get _Str_10346(): string[]
    {
        return this._Str_4447;
    }

    public get _Str_12369(): number
    {
        return this._Str_5743;
    }

    public get pet1(): ConfirmPetBreedingPetData
    {
        return this._pet1;
    }

    public get pet2(): ConfirmPetBreedingPetData
    {
        return this._pet2;
    }

    public get _Str_16867(): number
    {
        return this._Str_6321;
    }
}
