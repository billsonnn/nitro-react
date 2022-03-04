export class FurnitureStickieData
{
    constructor(
        public objectId: number,
        public category: number,
        public color: string,
        public text: string,
        public canModify: boolean = false,
        public isEditing: boolean = false) {}
}
