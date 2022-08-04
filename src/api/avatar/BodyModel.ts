import { AvatarEditorFigureCategory, AvatarScaleType, AvatarSetType } from '@nitrots/nitro-renderer';
import { GetAvatarRenderManager } from '../nitro';
import { AvatarEditorUtilities } from './AvatarEditorUtilities';
import { CategoryBaseModel } from './CategoryBaseModel';
import { FigureData } from './FigureData';

export class BodyModel extends CategoryBaseModel
{
    private _imageCallBackHandled: boolean = false;

    public init(): void
    {
        super.init();

        this.addCategory(FigureData.FACE);

        this._isInitalized = true;
    }

    public selectColor(category: string, colorIndex: number, paletteId: number): void
    {
        super.selectColor(category, colorIndex, paletteId);

        this.updateSelectionsFromFigure(FigureData.FACE);
    }

    protected updateSelectionsFromFigure(name: string): void
    {
        if(!this._categories || !AvatarEditorUtilities.CURRENT_FIGURE) return;

        const category = this._categories.get(name);

        if(!category) return;

        const setId = AvatarEditorUtilities.CURRENT_FIGURE.getPartSetId(name);

        let colorIds = AvatarEditorUtilities.CURRENT_FIGURE.getColorIds(name);

        if(!colorIds) colorIds = [];

        category.selectPartId(setId);
        category.selectColorIds(colorIds);

        for(const part of category.parts)
        {
            const resetFigure = (figure: string) =>
            {
                const figureString = AvatarEditorUtilities.CURRENT_FIGURE.getFigureStringWithFace(part.id);
                const avatarImage = GetAvatarRenderManager().createAvatarImage(figureString, AvatarScaleType.LARGE, null, { resetFigure, dispose: null, disposed: false });
    
                const sprite = avatarImage.getImageAsSprite(AvatarSetType.HEAD);
    
                if(sprite)
                {
                    sprite.y = 10;
    
                    part.thumbContainer = sprite;
    
                    setTimeout(() => avatarImage.dispose(), 0);
                }
            }

            resetFigure(null);
        }
    }

    public get canSetGender(): boolean
    {
        return true;
    }

    public get name(): string
    {
        return AvatarEditorFigureCategory.GENERIC;
    }
}
