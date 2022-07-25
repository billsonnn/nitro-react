import { AvatarEditorFigureCategory } from '@nitrots/nitro-renderer';
import { CategoryBaseModel } from './CategoryBaseModel';
import { FigureData } from './FigureData';

export class TorsoModel extends CategoryBaseModel
{
    public init(): void
    {
        super.init();

        this.addCategory(FigureData.SHIRT);
        this.addCategory(FigureData.CHEST_PRINTS);
        this.addCategory(FigureData.JACKET);
        this.addCategory(FigureData.CHEST_ACCESSORIES);

        this._isInitalized = true;
    }

    public get name(): string
    {
        return AvatarEditorFigureCategory.TORSO;
    }
}
