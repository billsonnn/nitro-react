export class FurnitureEngravingLockData
{
    constructor(
        public objectId: number,
        public category: number = 0,
        public type: number = 0,
        public usernames: string[] = [],
        public figures: string[] = [],
        public date: string = null) {}
}
