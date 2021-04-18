import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetPetLevelUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWPLUE_PET_LEVEL_UPDATE: string = 'RWPLUE_PET_LEVEL_UPDATE';

    private _petId: number;
    private _level: number;

    constructor(petId: number, level: number)
    {
        super(RoomWidgetPetLevelUpdateEvent.RWPLUE_PET_LEVEL_UPDATE);

        this._petId = petId;
        this._level = level;
    }

    public get petId(): number
    {
        return this._petId;
    }

    public get level(): number
    {
        return this._level;
    }
}
