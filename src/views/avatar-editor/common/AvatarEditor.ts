import { FigureData, IPalette, IPartColor, ISetType, IStructureData } from 'nitro-renderer';
import { GetAvatarRenderManager, GetConfiguration, GetSessionDataManager } from '../../../api';
import { AvatarEditorGridColorItem } from './AvatarEditorGridColorItem';
import { AvatarEditorGridPartItem } from './AvatarEditorGridPartItem';
import { CategoryBaseModel } from './CategoryBaseModel';
import { CategoryData } from './CategoryData';

const MAX_PALETTES: number = 2;
const DEFAULT_MALE_FIGURE: string = 'hr-100.hd-180-7.ch-215-66.lg-270-79.sh-305-62.ha-1002-70.wa-2007';
const DEFAULT_FEMALE_FIGURE: string = 'hr-515-33.hd-600-1.ch-635-70.lg-716-66-62.sh-735-68';

export class AvatarEditor
{
    private _figureStructureData: IStructureData;
    private _figures: Map<string, FigureData>;
    private _gender: string;

    constructor()
    {
        this._figureStructureData = GetAvatarRenderManager().structureData;
        this._figures = new Map();
        this._gender = FigureData.MALE;

        const maleFigure = new FigureData();
        const femaleFigure = new FigureData();

        maleFigure.loadAvatarData(DEFAULT_MALE_FIGURE, FigureData.MALE);
        femaleFigure.loadAvatarData(DEFAULT_FEMALE_FIGURE, FigureData.FEMALE);

        this._figures.set(FigureData.MALE, maleFigure);
        this._figures.set(FigureData.FEMALE, femaleFigure);
    }

    public getSetType(setType: string): ISetType
    {
        if(!this._figureStructureData) return null;

        return this._figureStructureData.getSetType(setType);
    }

    public getPalette(paletteId: number): IPalette
    {
        if(!this._figureStructureData) return null;

        return this._figureStructureData.getPalette(paletteId);
    }

    public createCategory(model: CategoryBaseModel, name: string): CategoryData
    {
        if(!model || !name) return null;

        const partItems: AvatarEditorGridPartItem[] = [];
        const colorItems: AvatarEditorGridColorItem[][] = [];

        let i = 0;

        while(i < MAX_PALETTES)
        {
            colorItems.push([]);

            i++;
        }

        const setType = this.getSetType(name);

        if(!setType) return null;

        const palette = this.getPalette(setType.paletteID);

        if(!palette) return null;

        let colorIds = this.figureData.getColourIds(name);

        if(!colorIds) colorIds = [];

        const partColors: IPartColor[] = new Array(colorIds.length);
        const clubItemsDimmed = this.clubItemsDimmed;

        for(const partColor of palette.colors.values())
        {
            if(partColor.isSelectable && (clubItemsDimmed || (this.clubMemberLevel >= partColor.clubLevel)))
            {
                let i = 0;

                while(i < MAX_PALETTES)
                {
                    const isDisabled = (this.clubMemberLevel < partColor.clubLevel);
                    const colorItem = new AvatarEditorGridColorItem(partColor, isDisabled);

                    colorItems[i].push(colorItem);

                    i++;
                }

                if(name !== FigureData.FACE)
                {
                    let i = 0;

                    while(i < colorIds.length)
                    {
                        if(partColor.id === colorIds[i]) partColors[i] = partColor;

                        i++;
                    }
                }
            }
        }

        let mandatorySetIds: string[] = [];

        if(clubItemsDimmed)
        {
            mandatorySetIds = GetAvatarRenderManager().getMandatoryAvatarPartSetIds(this._gender, 2);
        }
        else
        {
            mandatorySetIds = GetAvatarRenderManager().getMandatoryAvatarPartSetIds(this._gender, this.clubMemberLevel);
        }

        const isntMandatorySet = (mandatorySetIds.indexOf(name) === -1);

        if(isntMandatorySet)
        {
            const partItem = new AvatarEditorGridPartItem(null, null, false);

            partItem.isClear = true;

            partItems.push(partItem);
        }

        const usesColors = (name !== FigureData.FACE);
        const partSets = setType.partSets;
        const totalPartSets = partSets.length;

        i = (totalPartSets - 1);

        while(i >= 0)
        {
            const partSet = partSets.getWithIndex(i);

            let isValidGender = false;

            if(partSet.gender === FigureData.UNISEX)
            {
                isValidGender = true;
            }
            else
            {
                if(partSet.gender === this._gender)
                {
                    isValidGender = true;
                }
            }

            if(partSet.isSelectable && isValidGender && (clubItemsDimmed || (this.clubMemberLevel >= partSet.clubLevel)))
            {
                const isDisabled = (this.clubMemberLevel < partSet.clubLevel);

                let isValid = true;

                if(partSet.isSellable)
                {
                    //isValid = (this._inventoryService && this._inventoryService.hasFigureSetId(partSet.id));
                }

                if(isValid)
                {
                    partItems.push(new AvatarEditorGridPartItem(partSet, partColors, usesColors, isDisabled));
                }
            }

            i--;
        }

        partItems.sort(this.clubItemsFirst ? this.clubSorter : this.noobSorter);

        // if(this._forceSellableClothingVisibility || Nitro.instance.getConfiguration<boolean>("avatareditor.support.sellablefurni", false))
        // {
        //     _local_31 = (this._manager.windowManager.assets.getAssetByName("camera_zoom_in") as BitmapDataAsset);
        //     _local_32 = (_local_31.content as BitmapData).clone();
        //     _local_33 = (AvatarEditorView._Str_6802.clone() as IWindowContainer);
        //     _local_33.name = AvatarEditorGridView.GET_MORE;
        //     _local_7 = new AvatarEditorGridPartItem(_local_33, k, null, null, false);
        //     _local_7._Str_3093 = _local_32;
        //     _local_3.push(_local_7);
        // }

        i = 0;

        while(i < MAX_PALETTES)
        {
            colorItems[i].sort(this.colorSorter);

            i++;
        }

        return new CategoryData(name, partItems, colorItems);
    }

    private clubSorter(a: AvatarEditorGridPartItem, b: AvatarEditorGridPartItem): number
    {
        const clubLevelA = (!a.partSet ? 9999999999 : a.partSet.clubLevel);
        const clubLevelB = (!b.partSet ? 9999999999 : b.partSet.clubLevel);
        const isSellableA = (!a.partSet ? false : a.partSet.isSellable);
        const isSellableB = (!b.partSet ? false : b.partSet.isSellable);

        if(isSellableA && !isSellableB) return 1;

        if(isSellableB && !isSellableA) return -1;

        if(clubLevelA > clubLevelB) return -1;

        if(clubLevelA < clubLevelB) return 1;

        if(a.partSet.id > b.partSet.id) return -1;

        if(a.partSet.id < b.partSet.id) return 1;

        return 0;
    }

    private noobSorter(a: AvatarEditorGridPartItem, b: AvatarEditorGridPartItem): number
    {
        const clubLevelA = (!a.partSet ? -1 : a.partSet.clubLevel);
        const clubLevelB = (!b.partSet ? -1 : b.partSet.clubLevel);
        const isSellableA = (!a.partSet ? false : a.partSet.isSellable);
        const isSellableB = (!b.partSet ? false : b.partSet.isSellable);

        if(isSellableA && !isSellableB) return 1;

        if(isSellableB && !isSellableA) return -1;

        if(clubLevelA < clubLevelB) return -1;

        if(clubLevelA > clubLevelB) return 1;

        if(a.partSet.id < b.partSet.id) return -1;

        if(a.partSet.id > b.partSet.id) return 1;

        return 0;
    }

    private colorSorter(a: AvatarEditorGridColorItem, b: AvatarEditorGridColorItem): number
    {
        const clubLevelA = (!a.partColor ? -1 : a.partColor.clubLevel);
        const clubLevelB = (!b.partColor ? -1 : b.partColor.clubLevel);

        if(clubLevelA < clubLevelB) return -1;

        if(clubLevelA > clubLevelB) return 1;

        if(a.partColor.index < b.partColor.index) return -1;

        if(a.partColor.index > b.partColor.index) return 1;

        return 0;
    }

    public get clubMemberLevel(): number
    {
        return GetSessionDataManager().clubLevel;
    }

    private get clubItemsFirst(): boolean
    {
        return GetConfiguration<boolean>('avatareditor.show.clubitems.first', true);
    }

    private get clubItemsDimmed(): boolean
    {
        return GetConfiguration<boolean>('avatareditor.show.clubitems.dimmed', true);
    }

    public get figureData(): FigureData
    {
        return this._figures.get(this._gender);
    }

    public get gender(): string
    {
        return this._gender;
    }

    public set gender(gender: string)
    {
        this._gender = gender;
    }
}
