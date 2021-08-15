import { PetData } from '@nitrots/nitro-renderer';

export class PetItem
{
    private _petData: PetData;
    private _selected: boolean;
    private _isUnseen: boolean;

    constructor(petData: PetData)
    {
        this._petData   = petData;
        this._selected  = false;
        this._isUnseen  = false;
    }

    public get id(): number
    {
        return this._petData.id;
    }

    public get petData(): PetData
    {
        return this._petData;
    }

    public get selected(): boolean
    {
        return this._selected;
    }

    public set selected(flag: boolean)
    {
        this._selected = flag;
    }

    public get isUnseen(): boolean
    {
        return this._isUnseen;
    }

    public set isUnseen(flag: boolean)
    {
        this._isUnseen = flag;
    }
}
