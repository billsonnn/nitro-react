import { AvatarEditorFigureCategory, AvatarScaleType, AvatarSetType, FigureData, IAvatarImageListener } from 'nitro-renderer';
import { GetAvatarRenderManager } from '../../../api';
import { CategoryBaseModel } from './CategoryBaseModel';

export class BodyModel extends CategoryBaseModel implements IAvatarImageListener
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
        if(!this._categories || !this._editor || !this._editor.figureData) return;

        const category = this._categories.get(name);

        if(!category) return;

        const setId = this._editor.figureData.getPartSetId(name);

        let colorIds = this._editor.figureData.getColourIds(name);

        if(!colorIds) colorIds = [];

        category.selectPartId(setId);
        category.selectColorIds(colorIds);

        for(const part of category.parts)
        {
            const figure = this._editor.figureData.getFigureStringWithFace(part.id);
            const avatarImage = GetAvatarRenderManager().createAvatarImage(figure, AvatarScaleType.LARGE, null, this);

            const sprite = avatarImage.getImageAsSprite(AvatarSetType.HEAD);

            if(sprite)
            {
                sprite.y = 10;

                part.iconImage = sprite;

                setTimeout(() => avatarImage.dispose(), 0);
            }
        }

        // if (this._Str_2271) this._Str_2271._Str_5614(k, _local_4.length);
    }

    public resetFigure(figure: string): void
    {
        if(this._imageCallBackHandled) return;

        this._imageCallBackHandled = true;

        this.updateSelectionsFromFigure(FigureData.FACE);
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
