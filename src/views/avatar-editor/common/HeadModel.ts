import { AvatarEditorFigureCategory, FigureData } from 'nitro-renderer';
import { CategoryBaseModel } from './CategoryBaseModel';

export class HeadModel extends CategoryBaseModel
{
    public init(): void
    {
        super.init();

        this.addCategory(FigureData.HAIR);
        this.addCategory(FigureData.HAT);
        this.addCategory(FigureData.HEAD_ACCESSORIES);
        this.addCategory(FigureData.EYE_ACCESSORIES);
        this.addCategory(FigureData.FACE_ACCESSORIES);

        this._isInitalized = true;
    }

    public get name(): string
    {
        return AvatarEditorFigureCategory.HEAD;
    }
}
