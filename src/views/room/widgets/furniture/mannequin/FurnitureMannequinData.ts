export class FurnitureMannequinData
{
    constructor(
        public objectId: number,
        public category: number,
        public name: string,
        public figure: string,
        public gender: string,
        public clubLevel: number,
        public renderedFigure: string = null) {}
}
