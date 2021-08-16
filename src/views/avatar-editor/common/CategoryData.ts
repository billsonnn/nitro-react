import { IPartColor } from '@nitrots/nitro-renderer';
import { AvatarEditorGridColorItem } from './AvatarEditorGridColorItem';
import { AvatarEditorGridPartItem } from './AvatarEditorGridPartItem';

export class CategoryData
{
    private _name: string;
    private _parts: AvatarEditorGridPartItem[];
    private _palettes: AvatarEditorGridColorItem[][];
    private _selectedPartIndex: number = -1;
    private _paletteIndexes: number[];

    constructor(name: string, partItems: AvatarEditorGridPartItem[], colorItems: AvatarEditorGridColorItem[][])
    {
        this._name = name;
        this._parts = partItems;
        this._palettes = colorItems;
        this._selectedPartIndex = -1;
    }

    private static defaultColorId(palettes: AvatarEditorGridColorItem[], clubLevel: number): number
    {
        if(!palettes || !palettes.length) return -1;

        let i = 0;

        while(i < palettes.length)
        {
            const colorItem = palettes[i];

            if(colorItem.partColor && (colorItem.partColor.clubLevel <= clubLevel))
            {
                return colorItem.partColor.id;
            }

            i++;
        }

        return -1;
    }

    public init(): void
    {
        for(const part of this._parts)
        {
            if(!part) continue;

            part.init();
        }
    }

    public dispose(): void
    {
        if(this._parts)
        {
            for(const part of this._parts) part.dispose();

            this._parts = null;
        }

        if(this._palettes)
        {
            for(const palette of this._palettes) for(const colorItem of palette) colorItem.dispose();

            this._palettes = null;
        }

        this._selectedPartIndex = -1;
        this._paletteIndexes = null;
    }

    public selectPartId(partId: number): void
    {
        if(!this._parts) return;

        let i = 0;

        while(i < this._parts.length)
        {
            const partItem = this._parts[i];

            if(partItem.id === partId)
            {
                this.selectPartIndex(i);

                return;
            }

            i++;
        }
    }

    public selectColorIds(colorIds: number[]): void
    {
        if(!colorIds || !this._palettes) return;

        this._paletteIndexes = new Array(colorIds.length);

        let i = 0;

        while(i < this._palettes.length)
        {
            const palette = this.getPalette(i);

            if(palette)
            {
                let colorId = 0;

                if(colorIds.length > i)
                {
                    colorId = colorIds[i];
                }
                else
                {
                    const colorItem = palette[0];

                    if(colorItem && colorItem.partColor) colorId = colorItem.partColor.id;
                }

                let j = 0;

                while(j < palette.length)
                {
                    const colorItem = palette[j];

                    if(colorItem.partColor.id === colorId)
                    {
                        this._paletteIndexes[i] = j;

                        colorItem.isSelected = true;
                    }
                    else
                    {
                        colorItem.isSelected = false;
                    }

                    j++;
                }
            }

            i++;
        }

        this.updatePartColors();
    }

    public selectPartIndex(partIndex: number): AvatarEditorGridPartItem
    {
        if(!this._parts) return null;

        if((this._selectedPartIndex >= 0) && (this._parts.length > this._selectedPartIndex))
        {
            const partItem = this._parts[this._selectedPartIndex];

            if(partItem) partItem.isSelected = false;
        }

        if(this._parts.length > partIndex)
        {
            const partItem = this._parts[partIndex];

            if(partItem)
            {
                partItem.isSelected = true;

                this._selectedPartIndex = partIndex;

                return partItem;
            }
        }

        return null;
    }

    public selectColorIndex(colorIndex: number, paletteId: number): AvatarEditorGridColorItem
    {
        const palette = this.getPalette(paletteId);

        if(!palette) return null;

        if(palette.length <= colorIndex) return null;

        this.deselectColorIndex(this._paletteIndexes[paletteId], paletteId);

        this._paletteIndexes[paletteId] = colorIndex;

        const colorItem = palette[colorIndex];

        if(!colorItem) return null;

        colorItem.isSelected = true;

        this.updatePartColors();

        return colorItem;
    }

    public getCurrentColorIndex(k: number): number
    {
        return this._paletteIndexes[k];
    }

    private deselectColorIndex(colorIndex: number, paletteIndex: number): void
    {
        const palette = this.getPalette(paletteIndex);

        if(!palette) return;

        if(palette.length <= colorIndex) return;

        const colorItem = palette[colorIndex];

        if(!colorItem) return;

        colorItem.isSelected = false;
    }

    public getSelectedColorIds(): number[]
    {
        if(!this._paletteIndexes || !this._paletteIndexes.length) return null;

        if(!this._palettes || !this._palettes.length) return null;

        const palette = this._palettes[0];

        if(!palette || (!palette.length)) return null;

        const colorItem = palette[0];

        if(!colorItem || !colorItem.partColor) return null;

        const colorId = colorItem.partColor.id;
        const colorIds: number[] = [];

        let i = 0;

        while(i < this._paletteIndexes.length)
        {
            const paletteSet = this._palettes[i];

            if(!((!(paletteSet)) || (paletteSet.length <= i)))
            {
                if(paletteSet.length > this._paletteIndexes[i])
                {
                    const color = paletteSet[this._paletteIndexes[i]];

                    if(color && color.partColor)
                    {
                        colorIds.push(color.partColor.id);
                    }
                    else
                    {
                        colorIds.push(colorId);
                    }
                }
                else
                {
                    colorIds.push(colorId);
                }
            }

            i++;
        }

        const partItem = this.getCurrentPart();

        if(!partItem) return null;

        return colorIds.slice(0, Math.max(partItem.maxColorIndex, 1));
    }

    private getSelectedColors(): IPartColor[]
    {
        const partColors: IPartColor[] = [];

        let i = 0;

        while(i < this._paletteIndexes.length)
        {
            const colorItem = this.getSelectedColor(i);

            if(colorItem)
            {
                partColors.push(colorItem.partColor);
            }
            else
            {
                partColors.push(null);
            }

            i++;
        }

        return partColors;
    }

    public getSelectedColor(paletteId: number): AvatarEditorGridColorItem
    {
        const palette = this.getPalette(paletteId);

        if(!palette || (palette.length <= this._paletteIndexes[paletteId])) return null;

        return palette[this._paletteIndexes[paletteId]];
    }

    public getSelectedColorId(paletteId: number): number
    {
        const colorItem = this.getSelectedColor(paletteId);

        if(colorItem && (colorItem.partColor)) return colorItem.partColor.id;

        return 0;
    }

    public getPalette(paletteId: number): AvatarEditorGridColorItem[]
    {
        if(!this._paletteIndexes || !this._palettes || (this._palettes.length <= paletteId))
        {
            return null;
        }

        return this._palettes[paletteId];
    }

    public getCurrentPart(): AvatarEditorGridPartItem
    {
        return this._parts[this._selectedPartIndex] as AvatarEditorGridPartItem;
    }

    private updatePartColors(): void
    {
        const partColors = this.getSelectedColors();

        for(const partItem of this._parts)
        {
            if(partItem) partItem.partColors = partColors;
        }
    }

    public hasClubSelectionsOverLevel(level: number): boolean
    {
        let hasInvalidSelections = false;

        const partColors = this.getSelectedColors();

        if(partColors)
        {
            let i = 0;

            while(i < partColors.length)
            {
                const partColor = partColors[i];

                if(partColor && (partColor.clubLevel > level)) hasInvalidSelections = true;

                i++;
            }
        }

        const partItem = this.getCurrentPart();

        if(partItem && partItem.partSet)
        {
            const partSet = partItem.partSet;

            if(partSet && (partSet.clubLevel > level)) hasInvalidSelections = true;
        }

        return hasInvalidSelections;
    }

    public hasInvalidSelectedItems(ownedItems: number[]): boolean
    {
        const part = this.getCurrentPart();

        if(!part) return false;

        const partSet = part.partSet;

        if(!partSet || !partSet.isSellable) return;

        return (ownedItems.indexOf(partSet.id) > -1);
    }

    public stripClubItemsOverLevel(level: number): boolean
    {
        const partItem = this.getCurrentPart();

        if(partItem && partItem.partSet)
        {
            const partSet = partItem.partSet;

            if(partSet.clubLevel > level)
            {
                const newPartItem = this.selectPartIndex(0);

                if(newPartItem && !newPartItem.partSet) this.selectPartIndex(1);

                return true;
            }
        }

        return false;
    }

    public stripClubColorsOverLevel(level: number): boolean
    {
        const colorIds: number[] = [];
        const partColors = this.getSelectedColors();
        const colorItems = this.getPalette(0);

        let didStrip = false;

        const colorId = CategoryData.defaultColorId(colorItems, level);

        if(colorId === -1) return false;

        let i = 0;

        while(i < partColors.length)
        {
            const partColor = partColors[i];

            if(!partColor)
            {
                colorIds.push(colorId);

                didStrip = true;
            }
            else
            {
                if(partColor.clubLevel > level)
                {
                    colorIds.push(colorId);
                    
                    didStrip = true;
                }
                else
                {
                    colorIds.push(partColor.id);
                }
            }

            i++;
        }

        if(didStrip) this.selectColorIds(colorIds);

        return didStrip;
    }

    // public stripInvalidSellableItems(k:IHabboInventory): boolean
    // {
    //     var _local_3:IFigurePartSet;
    //     var _local_4:AvatarEditorGridPartItem;
    //     var _local_2:AvatarEditorGridPartItem = this._Str_6315();
    //     if (((_local_2) && (_local_2.partSet)))
    //     {
    //         _local_3 = _local_2.partSet;
    //         if (((_local_3.isSellable) && (!(k._Str_14439(_local_3.id)))))
    //         {
    //             _local_4 = this._Str_8066(0);
    //             if (((!(_local_4 == null)) && (_local_4.partSet == null)))
    //             {
    //                 this._Str_8066(1);
    //             }
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    public get name(): string
    {
        return this._name;
    }

    public get parts(): AvatarEditorGridPartItem[]
    {
        return this._parts;
    }

    public get selectedPartIndex(): number
    {
        return this._selectedPartIndex;
    }
}
