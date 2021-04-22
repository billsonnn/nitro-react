import { RoomWidgetUpdateEvent } from 'nitro-renderer';
import { _Str_3801 } from './_Str_3801';

export class RoomWidgetPetBreedingResultEvent extends RoomWidgetUpdateEvent
{
    public static RWPBRE_PET_BREEDING_RESULT: string = 'RWPBRE_PET_BREEDING_RESULT';

    private _Str_3111: _Str_3801;
    private _resultData2: _Str_3801;

    constructor(k: _Str_3801, _arg_2: _Str_3801)
    {
        super(RoomWidgetPetBreedingResultEvent.RWPBRE_PET_BREEDING_RESULT);

        this._Str_3111 = k;
        this._resultData2 = _arg_2;
    }

    public get _Str_3713(): _Str_3801
    {
        return this._Str_3111;
    }

    public get resultData2(): _Str_3801
    {
        return this._resultData2;
    }
}
