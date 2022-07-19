export class UseProductItem
{
    constructor(
        public readonly id: number,
        public readonly category: number,
        public readonly name: string,
        public readonly requestRoomObjectId: number,
        public readonly targetRoomObjectId: number,
        public readonly requestInventoryStripId: number,
        public readonly replace: boolean)
    {}
}
