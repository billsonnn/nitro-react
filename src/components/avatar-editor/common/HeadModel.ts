import { AvatarEditorFigureCategory } from '@nitrots/nitro-renderer';
import { CategoryBaseModel } from './CategoryBaseModel';
import { FigureData } from './FigureData';

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
