import { GetAvatarRenderManager, IPartColor } from '@nitrots/nitro-renderer';
import { GetClubMemberLevel, GetConfigurationValue } from '../nitro';
import { AvatarEditorGridColorItem } from './AvatarEditorGridColorItem';
import { AvatarEditorGridPartItem } from './AvatarEditorGridPartItem';
import { CategoryBaseModel } from './CategoryBaseModel';
import { CategoryData } from './CategoryData';
import { FigureData } from './FigureData';

export class AvatarEditorUtilities
{
    private static MAX_PALETTES: number = 2;

    public static CURRENT_FIGURE: FigureData = null;
    public static FIGURE_SET_IDS: number[] = [];
    public static BOUND_FURNITURE_NAMES: string[] = [];

    public static getGender(gender: string): string
    {
        switch(gender)
        {
            case FigureData.MALE:
            case 'm':
            case 'M':
                gender = FigureData.MALE;
                break;
            case FigureData.FEMALE:
            case 'f':
            case 'F':
                gender = FigureData.FEMALE;
                break;
            default:
                gender = FigureData.MALE;
        }

        return gender;
    }

    public static hasFigureSetId(setId: number): boolean
    {
        return (this.FIGURE_SET_IDS.indexOf(setId) >= 0);
    }

    public static createCategory(model: CategoryBaseModel, name: string): CategoryData
    {
        if(!model || !name || !this.CURRENT_FIGURE) return null;

        const partItems: AvatarEditorGridPartItem[] = [];
        const colorItems: AvatarEditorGridColorItem[][] = [];

        let i = 0;

        while(i < this.MAX_PALETTES)
        {
            colorItems.push([]);

            i++;
        }

        const setType = GetAvatarRenderManager().structureData.getSetType(name);

        if(!setType) return null;

        const palette = GetAvatarRenderManager().structureData.getPalette(setType.paletteID);

        if(!palette) return null;

        let colorIds = this.CURRENT_FIGURE.getColorIds(name);

        if(!colorIds) colorIds = [];

        const partColors: IPartColor[] = new Array(colorIds.length);
        const clubItemsDimmed = this.clubItemsDimmed;
        const clubMemberLevel = GetClubMemberLevel();

        for(const partColor of palette.colors.getValues())
        {
            if(partColor.isSelectable && (clubItemsDimmed || (clubMemberLevel >= partColor.clubLevel)))
            {
                let i = 0;

                while(i < this.MAX_PALETTES)
                {
                    const isDisabled = (clubMemberLevel < partColor.clubLevel);
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
            mandatorySetIds = GetAvatarRenderManager().getMandatoryAvatarPartSetIds(this.CURRENT_FIGURE.gender, 2);
        }
        else
        {
            mandatorySetIds = GetAvatarRenderManager().getMandatoryAvatarPartSetIds(this.CURRENT_FIGURE.gender, clubMemberLevel);
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

            else if(partSet.gender === this.CURRENT_FIGURE.gender)
            {
                isValidGender = true;
            }

            if(partSet.isSelectable && isValidGender && (clubItemsDimmed || (clubMemberLevel >= partSet.clubLevel)))
            {
                const isDisabled = (clubMemberLevel < partSet.clubLevel);

                let isValid = true;

                if(partSet.isSellable) isValid = this.hasFigureSetId(partSet.id);

                if(isValid) partItems.push(new AvatarEditorGridPartItem(partSet, partColors, usesColors, isDisabled));
            }

            i--;
        }

        partItems.sort(this.clubItemsFirst ? this.clubSorter : this.noobSorter);

        // if(this._forceSellableClothingVisibility || GetNitroInstance().getConfiguration<boolean>("avatareditor.support.sellablefurni", false))
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

        while(i < this.MAX_PALETTES)
        {
            colorItems[i].sort(this.colorSorter);

            i++;
        }

        return new CategoryData(name, partItems, colorItems);
    }

    public static clubSorter(a: AvatarEditorGridPartItem, b: AvatarEditorGridPartItem): number
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

    public static colorSorter(a: AvatarEditorGridColorItem, b: AvatarEditorGridColorItem): number
    {
        const clubLevelA = (!a.partColor ? -1 : a.partColor.clubLevel);
        const clubLevelB = (!b.partColor ? -1 : b.partColor.clubLevel);

        if(clubLevelA < clubLevelB) return -1;

        if(clubLevelA > clubLevelB) return 1;

        if(a.partColor.index < b.partColor.index) return -1;

        if(a.partColor.index > b.partColor.index) return 1;

        return 0;
    }

    public static noobSorter(a: AvatarEditorGridPartItem, b: AvatarEditorGridPartItem): number
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

    public static avatarSetFirstSelectableColor(name: string): number
    {
        const setType = GetAvatarRenderManager().structureData.getSetType(name);

        if(!setType) return -1;

        const palette = GetAvatarRenderManager().structureData.getPalette(setType.paletteID);

        if(!palette) return -1;

        for(const color of palette.colors.getValues())
        {
            if(!color.isSelectable || (GetClubMemberLevel() < color.clubLevel)) continue;

            return color.id;
        }

        return -1;
    }

    public static get clubItemsFirst(): boolean
    {
        return GetConfigurationValue<boolean>('avatareditor.show.clubitems.first', true);
    }

    public static get clubItemsDimmed(): boolean
    {
        return GetConfigurationValue<boolean>('avatareditor.show.clubitems.dimmed', true);
    }
}
