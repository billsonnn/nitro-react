import { AvatarEditorFigureCategory } from '@nitrots/nitro-renderer';
import { CategoryBaseModel } from './CategoryBaseModel';
import { FigureData } from './FigureData';

export class LegModel extends CategoryBaseModel
{
    public init(): void
    {
        super.init();

        this.addCategory(FigureData.TROUSERS);
        this.addCategory(FigureData.SHOES);
        this.addCategory(FigureData.TROUSER_ACCESSORIES);

        this._isInitalized = true;
    }

    public get name(): string
    {
        return AvatarEditorFigureCategory.LEGS;
    }
}
