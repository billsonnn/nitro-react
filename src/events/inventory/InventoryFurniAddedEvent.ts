import { NitroEvent } from '@nitrots/nitro-renderer';

export class InventoryFurniAddedEvent extends NitroEvent
{
    public static FURNI_ADDED: string = 'IFAE_FURNI_ADDED';

    constructor(
        public readonly id: number,
        public readonly spriteId: number,
        public readonly category: number)
    {
        super(InventoryFurniAddedEvent.FURNI_ADDED);
    }
}
