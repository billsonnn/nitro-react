import { AvatarEditor } from './AvatarEditor';
import { CategoryData } from './CategoryData';
import { IAvatarEditorCategoryModel } from './IAvatarEditorCategoryModel';

export class CategoryBaseModel implements IAvatarEditorCategoryModel
{
    protected _editor: AvatarEditor;
    protected _categories: Map<string, CategoryData>;
    protected _isInitalized: boolean;
    protected _maxPaletteCount: number;
    private _disposed: boolean;

    constructor(editor: AvatarEditor)
    {
        this._editor = editor;
        this._isInitalized  = false;
        this._maxPaletteCount = 0;
    }

    public dispose(): void
    {
        this._categories = null;
        this._disposed = true;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }

    public init(): void
    {
        if(!this._categories) this._categories = new Map();
    }

    public reset(): void
    {
        this._isInitalized = false;

        if(this._categories)
        {
            for(const category of this._categories.values()) (category && category.dispose());
        }

        this._categories = new Map();
    }

    protected addCategory(name: string): void
    {
        let existing = this._categories.get(name);

        if(existing) return;

        existing = this._editor.createCategory(this, name);

        if(!existing) return;

        this._categories.set(name, existing);

        this.updateSelectionsFromFigure(name);
    }

    protected updateSelectionsFromFigure(figure: string): void
    {
        const category = this._categories.get(figure);

        if(!category) return;

        const setId = this._editor.figureData.getPartSetId(figure);

        let colorIds = this._editor.figureData.getColourIds(figure);

        if(!colorIds) colorIds = [];

        category.selectPartId(setId);
        category.selectColorIds(colorIds);
    }

    public hasClubSelectionsOverLevel(level: number): boolean
    {
        if(!this._categories) return false;

        for(const category of this._categories.values())
        {
            if(!category) continue;

            if(category.hasClubSelectionsOverLevel(level)) return true;
        }

        return false;
    }

    public hasInvalidSelectedItems(ownedItems: number[]): boolean
    {
        if(!this._categories) return false;

        for(const category of this._categories.values())
        {
            if(category.hasInvalidSelectedItems(ownedItems)) return true;
        }

        return false;
    }

    public stripClubItemsOverLevel(level: number): boolean
    {
        if(!this._categories) return false;

        let didStrip = false;

        for(const [ name, category ] of this._categories.entries())
        {
            let isValid = false;

            if(category.stripClubItemsOverLevel(level)) isValid = true;

            if(category.stripClubColorsOverLevel(level)) isValid = true;

            if(isValid)
            {
                const partItem = category.getCurrentPart();

                if(partItem && this._editor && this._editor.figureData)
                {
                    this._editor.figureData.savePartData(name, partItem.id, category.getSelectedColorIds(), true);
                }

                didStrip = true;
            }
        }

        return didStrip;
    }

    public stripInvalidSellableItems(): boolean
    {
        if(!this._categories) return false;

        let didStrip = false;

        for(const [ name, category ] of this._categories.entries())
        {
            const isValid = false;

            // if(category._Str_8360(this._Str_2278.manager.inventory)) _local_6 = true;

            if(isValid)
            {
                const partItem = category.getCurrentPart();

                if(partItem && this._editor && this._editor.figureData)
                {
                    this._editor.figureData.savePartData(name, partItem.id, category.getSelectedColorIds(), true);
                }

                didStrip = true;
            }
        }

        return didStrip;
    }

    public selectPart(category: string, partIndex: number): void
    {
        const categoryData = this._categories.get(category);

        if(!categoryData) return;

        const selectedPartIndex = categoryData.selectedPartIndex;

        categoryData.selectPartIndex(partIndex);

        const partItem = categoryData.getCurrentPart();

        if(!partItem) return;

        if(partItem.isDisabledForWearing)
        {
            categoryData.selectPartIndex(selectedPartIndex);

            // open hc window

            return;
        }

        this._maxPaletteCount = partItem.colorLayerCount;

        this._editor.figureData.savePartData(category, partItem.id, categoryData.getSelectedColorIds(), true);
    }

    public selectColor(category: string, colorIndex: number, paletteId: number): void
    {
        const categoryData = this._categories.get(category);

        if(!categoryData) return;

        const paletteIndex = categoryData.getCurrentColorIndex(paletteId);

        categoryData.selectColorIndex(colorIndex, paletteId);
        
        const colorItem = categoryData.getSelectedColor(paletteId);

        if(colorItem.isDisabled)
        {
            categoryData.selectColorIndex(paletteIndex, paletteId);

            // open hc window

            return;
        }
        
        this._editor.figureData.savePartSetColourId(category, categoryData.getSelectedColorIds(), true);
    }

    public getCategoryData(category: string): CategoryData
    {
        if(!this._isInitalized) this.init();

        if(!this._categories) return null;

        return this._categories.get(category);
    }

    public get categories(): Map<string, CategoryData>
    {
        return this._categories;
    }

    public get canSetGender(): boolean
    {
        return false;
    }

    public get maxPaletteCount(): number
    {
        return this._maxPaletteCount;
    }

    public set maxPaletteCount(count: number)
    {
        this._maxPaletteCount = count;
    }

    public get name(): string
    {
        return null;
    }
}
