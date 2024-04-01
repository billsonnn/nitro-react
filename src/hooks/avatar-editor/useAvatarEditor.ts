import { AvatarEditorFigureCategory, GetAvatarRenderManager, IFigurePartSet, IPartColor } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBetween } from 'use-between';
import { FigureData, GetClubMemberLevel, GetConfigurationValue, IAvatarEditorCategory, IAvatarEditorCategoryPartItem } from '../../api';

const MAX_PALETTES: number = 2;

const useAvatarEditorState = () =>
{
    const [ avatarModels, setAvatarModels ] = useState<{ [index: string]: IAvatarEditorCategory[] }>({});
    const [ activeModelKey, setActiveModelKey ] = useState<string>('');
    const [ selectedParts, setSelectedParts ] = useState<{ [index: string]: number }>({});
    const [ selectedColors, setSelectedColors ] = useState<{ [index: string]: { [index: number]: number }}>({});
    const [ maxPaletteCount, setMaxPaletteCount ] = useState<number>(1);

    const clubItemsFirst = useMemo(() => GetConfigurationValue<boolean>('avatareditor.show.clubitems.first', true), []);
    const clubItemsDimmed = useMemo(() => GetConfigurationValue<boolean>('avatareditor.show.clubitems.dimmed', true), []);
    const activeModel = useMemo(() => (avatarModels[activeModelKey] ?? null), [ activeModelKey, avatarModels ]);

    const selectPart = useCallback((setType: string, partId: number) =>
    {
        if(!setType || !setType.length) return;

        const category = activeModel.find(category => (category.setType === setType));

        if(!category || !category.partItems || !category.partItems.length) return;

        const partItem = category.partItems.find(partItem => partItem.id === partId);

        if(!partItem) return;

        if(partItem.isClear)
        {
            // clear the part
            return;
        }

        if(GetClubMemberLevel() < partItem.partSet.clubLevel) return;

        setMaxPaletteCount(partItem.maxPaletteCount || 1);

        setSelectedParts(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue[setType] = partItem.id;

            return newValue;
        });
    }, [ activeModel ]);

    const selectColor = useCallback((setType: string, paletteId: number, colorId: number) =>
    {
        if(!setType || !setType.length) return;

        const category = activeModel.find(category => (category.setType === setType));

        if(!category || !category.colorItems || !category.colorItems.length) return;

        const palette = category.colorItems[paletteId];

        if(!palette || !palette.length) return;

        const partColor = palette.find(partColor => (partColor.id === colorId));

        if(!partColor) return;

        if(GetClubMemberLevel() < partColor.clubLevel) return;

        setSelectedColors(prevValue =>
        {
            const newValue = { ...prevValue };

            if(!newValue[setType]) newValue[setType] = {};

            if(!newValue[setType][paletteId]) newValue[setType][paletteId] = -1;

            newValue[setType][paletteId] = partColor.id;

            return newValue;
        })
    }, [ activeModel ]);

    useEffect(() =>
    {
        const newAvatarModels: { [index: string]: IAvatarEditorCategory[] } = {};

        const buildCategory = (setType: string) =>
        {
            const partItems: IAvatarEditorCategoryPartItem[] = [];
            const colorItems: IPartColor[][] = [];

            for(let i = 0; i < MAX_PALETTES; i++) colorItems.push([]);

            const set = GetAvatarRenderManager().structureData.getSetType(setType);
            const palette = GetAvatarRenderManager().structureData.getPalette(set.paletteID);

            if(!set || !palette) return null;

            for(const partColor of palette.colors.getValues())
            {
                if(!partColor || !partColor.isSelectable) continue;

                for(let i = 0; i < MAX_PALETTES; i++) colorItems[i].push(partColor);

                // TODO - check what this does
                /* if(setType !== FigureData.FACE)
                {
                    let i = 0;

                    while(i < colorIds.length)
                    {
                        if(partColor.id === colorIds[i]) partColors[i] = partColor;

                        i++;
                    }
                } */
            }

            let mandatorySetIds: string[] = [];

            if(clubItemsDimmed)
            {
                //mandatorySetIds = GetAvatarRenderManager().getMandatoryAvatarPartSetIds(this.CURRENT_FIGURE.gender, 2);
            }
            else
            {
                //mandatorySetIds = GetAvatarRenderManager().getMandatoryAvatarPartSetIds(this.CURRENT_FIGURE.gender, clubMemberLevel);
            }

            const isntMandatorySet = (mandatorySetIds.indexOf(setType) === -1);

            if(isntMandatorySet) partItems.push({ id: -1, isClear: true });

            const usesColor = (setType !== FigureData.FACE);
            const partSets = set.partSets;

            for(let i = (partSets.length); i >= 0; i--)
            {
                const partSet = partSets.getWithIndex(i);

                if(!partSet || !partSet.isSelectable) continue;

                let maxPaletteCount = 0;

                for(const part of partSet.parts) maxPaletteCount = Math.max(maxPaletteCount, part.colorLayerIndex);

                partItems.push({ id: partSet.id, partSet, usesColor, maxPaletteCount });
            }

            partItems.sort(clubItemsFirst ? clubSorter : noobSorter);

            for(let i = 0; i < MAX_PALETTES; i++) colorItems[i].sort(colorSorter);

            return { setType, partItems, colorItems };
        }

        newAvatarModels[AvatarEditorFigureCategory.GENERIC] = [ FigureData.FACE ].map(setType => buildCategory(setType));
        newAvatarModels[AvatarEditorFigureCategory.HEAD] = [ FigureData.HAIR, FigureData.HAT, FigureData.HEAD_ACCESSORIES, FigureData.EYE_ACCESSORIES, FigureData.FACE_ACCESSORIES ].map(setType => buildCategory(setType));
        newAvatarModels[AvatarEditorFigureCategory.TORSO] = [ FigureData.SHIRT, FigureData.CHEST_PRINTS, FigureData.JACKET, FigureData.CHEST_ACCESSORIES ].map(setType => buildCategory(setType));
        newAvatarModels[AvatarEditorFigureCategory.LEGS] = [ FigureData.TROUSERS, FigureData.SHOES, FigureData.TROUSER_ACCESSORIES ].map(setType => buildCategory(setType));
        newAvatarModels[AvatarEditorFigureCategory.WARDROBE] = [];

        console.log(newAvatarModels);

        setAvatarModels(newAvatarModels);
        setActiveModelKey(AvatarEditorFigureCategory.GENERIC);
    }, [ clubItemsDimmed, clubItemsFirst ]);

    return { avatarModels, activeModelKey, setActiveModelKey, selectedParts, selectedColors, maxPaletteCount, selectPart, selectColor };
}

export const useAvatarEditor = () => useBetween(useAvatarEditorState);

const clubSorter = (a: { partSet: IFigurePartSet, usesColor: boolean, isClear?: boolean }, b: { partSet: IFigurePartSet, usesColor: boolean, isClear?: boolean }) =>
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

const colorSorter = (a: IPartColor, b: IPartColor) =>
{
    const clubLevelA = (!a ? -1 : a.clubLevel);
    const clubLevelB = (!b ? -1 : b.clubLevel);

    if(clubLevelA < clubLevelB) return -1;

    if(clubLevelA > clubLevelB) return 1;

    if(a.index < b.index) return -1;

    if(a.index > b.index) return 1;

    return 0;
}

const noobSorter = (a: { partSet: IFigurePartSet, usesColor: boolean, isClear?: boolean }, b: { partSet: IFigurePartSet, usesColor: boolean, isClear?: boolean }) =>
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
