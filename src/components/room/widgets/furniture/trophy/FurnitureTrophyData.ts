export class FurnitureTrophyData
{
    constructor(
        public objectId: number,
        public category: number,
        public color: string,
        public ownerName: string,
        public date: string,
        public message: string,
        public customTitle?: string) {}
}
