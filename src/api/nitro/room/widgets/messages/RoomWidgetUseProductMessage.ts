import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetUseProductMessage extends RoomWidgetMessage
{
    public static PET_PRODUCT: string = 'RWUPM_PET_PRODUCT';
    public static MONSTERPLANT_SEED: string = 'RWUPM_MONSTERPLANT_SEED';

    private _objectId: number;
    public _petId: number;

    constructor(type: string, objectId: number, petId: number = -1)
    {
        super(type);

        this._objectId = objectId;
        this._petId = petId;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get petId(): number
    {
        return this._petId;
    }
}
