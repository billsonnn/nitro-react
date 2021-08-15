import { NitroEvent } from '@nitrots/nitro-renderer';

export class InventoryBadgesUpdatedEvent extends NitroEvent
{
    public static BADGES_UPDATED: string = 'IBUE_BADGES_UPDATED';

    private _badges: string[] = [];

    constructor(type: string, badges: string[] = [])
    {
        super(type);

        this._badges = badges;
    }

    public get badges(): string[]
    {
        return this._badges;
    }
}
