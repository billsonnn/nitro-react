import { AvatarEditorFigureCategory, AvatarFigureContainer, AvatarFigurePartType, FigureSetIdsMessageEvent, GetAvatarRenderManager, GetSessionDataManager, GetWardrobeMessageComposer, IAvatarFigureContainer, IFigurePartSet, IPalette, IPartColor, SetType, UserWardrobePageEvent } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBetween } from 'use-between';
import { AvatarEditorColorSorter, AvatarEditorPartSorter, AvatarEditorThumbnailsHelper, GetClubMemberLevel, GetConfigurationValue, IAvatarEditorCategory, IAvatarEditorCategoryPartItem, Randomizer, SendMessageComposer } from '../../api';
import { useMessageEvent } from '../events';
import { useFigureData } from './useFigureData';

const MAX_PALETTES: number = 2;

const useAvatarEditorState = () =>
{
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const [ avatarModels, setAvatarModels ] = useState<{ [index: string]: IAvatarEditorCategory[] }>({});
    const [ activeModelKey, setActiveModelKey ] = useState<string>('');
    const [ maxPaletteCount, setMaxPaletteCount ] = useState<number>(1);
    const [ figureSetIds, setFigureSetIds ] = useState<number[]>([]);
    const [ boundFurnitureNames, setBoundFurnitureNames ] = useState<string[]>([]);
    const [ savedFigures, setSavedFigures ] = useState<[ IAvatarFigureContainer, string ][]>(null);
    const { selectedColors, gender, setGender, loadAvatarData, selectPart, selectColor, getFigureString, getFigureStringWithFace, selectedParts } = useFigureData();

    const activeModel = useMemo(() => (avatarModels[activeModelKey] ?? null), [ activeModelKey, avatarModels ]);

    const selectedColorParts = useMemo(() =>
    {
        const colorSets: { [index: string]: IPartColor[] } = {};

        for(const setType of Object.keys(selectedColors))
        {
            if(!selectedColors[setType]) continue;

            const parts: IPartColor[] = [];

            for(const paletteId of Object.keys(selectedColors[setType]))
            {
                const partColor = activeModel.find(category => (category.setType === setType))?.colorItems[paletteId]?.find(partColor => (partColor.id === selectedColors[setType][paletteId]));

                if(partColor) parts.push(partColor);
            }

            colorSets[setType] = parts;
        }

        return colorSets;

    }, [ activeModel, selectedColors ]);

    const selectEditorPart = useCallback((setType: string, partId: number) =>
    {
        if(!setType || !setType.length) return;

        const category = activeModel.find(category => (category.setType === setType));

        if(!category || !category.partItems || !category.partItems.length) return;

        const partItem = category.partItems.find(partItem => partItem.id === partId);

        if(!partItem) return;

        if(partItem.isClear)
        {
            selectPart(setType, -1);

            return;
        }

        if(GetClubMemberLevel() < partItem.partSet.clubLevel) return;

        setMaxPaletteCount(partItem.maxPaletteCount || 1);

        selectPart(setType, partId);
    }, [ activeModel, selectPart ]);

    const selectEditorColor = useCallback((setType: string, paletteId: number, colorId: number) =>
    {
        if(!setType || !setType.length) return;

        const category = activeModel.find(category => (category.setType === setType));

        if(!category || !category.colorItems || !category.colorItems.length) return;

        const palette = category.colorItems[paletteId];

        if(!palette || !palette.length) return;

        const partColor = palette.find(partColor => (partColor.id === colorId));

        if(!partColor) return;

        if(GetClubMemberLevel() < partColor.clubLevel) return;

        selectColor(setType, paletteId, colorId);
    }, [ activeModel, selectColor ]);

    const getFirstSelectableColor = useCallback((setType: string) =>
    {
        const set = GetAvatarRenderManager().structureData.getSetType(setType);

        if(!setType) return -1;

        const palette = GetAvatarRenderManager().structureData.getPalette(set.paletteID);

        if(!palette) return -1;

        for(const color of palette.colors.getValues())
        {
            if(!color.isSelectable || (GetClubMemberLevel() < color.clubLevel)) continue;

            return color.id;
        }

        return -1;
    }, []);

    const randomizeCurrentFigure = useCallback((ignoredSets: string[] = []) =>
    {
        const structure = GetAvatarRenderManager().structure;
        const figureContainer = new AvatarFigureContainer('');

        const getRandomSetTypes = (requiredSets: string[], options: string[]) =>
        {
            options = options.filter(option => (requiredSets.indexOf(option) === -1));

            return [ ...requiredSets, ...Randomizer.getRandomElements(options, (Randomizer.getRandomNumber(options.length) + 1)) ];
        }

        const requiredSets = getRandomSetTypes(structure.getMandatorySetTypeIds(gender, GetClubMemberLevel()), AvatarFigurePartType.FIGURE_SETS);

        const getRandomPartSet = (setType: SetType, gender: string, clubLevel: number, figureSetIds: number[]) =>
        {
            const options = setType.partSets.getValues().filter(option =>
            {
                if(!option.isSelectable || ((option.gender !== 'U') && (option.gender !== gender)) || (option.clubLevel > clubLevel) || (option.isSellable && (figureSetIds.indexOf(option.id) === -1))) return null;
        
                return option;
            });
        
            if(!options || !options.length) return null;
        
            return Randomizer.getRandomElement(options);
        }

        const getRandomColors = (palette: IPalette, partSet: IFigurePartSet, clubLevel: number) =>
        {
            const options = palette.colors.getValues().filter(option =>
            {
                if(!option.isSelectable || (option.clubLevel > clubLevel)) return null;
        
                return option;
            });
        
            if(!options || !options.length) return null;

            const getTotalColors = (partSet: IFigurePartSet) =>
            {
                const parts = partSet.parts;

                let totalColors = 0;

                for(const part of parts) totalColors = Math.max(totalColors, part.colorLayerIndex);

                return totalColors;
            }
        
            return Randomizer.getRandomElements(options, getTotalColors(partSet));
        }

        for(const setType of ignoredSets)
        {
            const partSetId = selectedParts[setType];
            const colors = selectedColors[setType];

            figureContainer.updatePart(setType, partSetId, colors);
        }

        for(const type of requiredSets)
        {
            if(figureContainer.hasPartType(type)) continue;
            
            const setType = (structure.figureData.getSetType(type) as SetType);
            const selectedSet = getRandomPartSet(setType, gender, GetClubMemberLevel(), figureSetIds);

            if(!selectedSet) continue;

            let selectedColors: number[] = [];

            if(selectedSet.isColorable)
            {
                selectedColors = getRandomColors(structure.figureData.getPalette(setType.paletteID), selectedSet, GetClubMemberLevel()).map(color => color.id);
            }

            figureContainer.updatePart(setType.type, selectedSet.id, selectedColors);
        }

        loadAvatarData(figureContainer.getFigureString(), gender);
    }, [ figureSetIds, gender, loadAvatarData, selectedColors, selectedParts ]);

    useMessageEvent<FigureSetIdsMessageEvent>(FigureSetIdsMessageEvent, event =>
    {
        const parser = event.getParser();

        setFigureSetIds(parser.figureSetIds);
        setBoundFurnitureNames(parser.boundsFurnitureNames);
    });

    useMessageEvent<UserWardrobePageEvent>(UserWardrobePageEvent, event =>
    {
        const parser = event.getParser();
        const savedFigures: [ IAvatarFigureContainer, string ][] = [];

        let i = 0;

        while(i < GetConfigurationValue<number>('avatar.wardrobe.max.slots', 10))
        {
            savedFigures.push([ null, null ]);

            i++;
        }

        for(let [ index, [ look, gender ] ] of parser.looks.entries())
        {
            const container = GetAvatarRenderManager().createFigureContainer(look);

            savedFigures[(index - 1)] = [ container, gender ];
        }

        setSavedFigures(savedFigures);
    });

    useEffect(() =>
    {
        AvatarEditorThumbnailsHelper.clearCache();
    }, [ selectedColorParts ]);

    useEffect(() =>
    {
        if(!isVisible) return;

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
            }

            let mandatorySetIds: string[] = GetAvatarRenderManager().getMandatoryAvatarPartSetIds(gender, GetClubMemberLevel());

            const isntMandatorySet = (mandatorySetIds.indexOf(setType) === -1);

            if(isntMandatorySet) partItems.push({ id: -1, isClear: true });

            const usesColor = (setType !== AvatarFigurePartType.HEAD);
            const partSets = set.partSets;

            for(let i = (partSets.length); i >= 0; i--)
            {
                const partSet = partSets.getWithIndex(i);

                if(!partSet || !partSet.isSelectable || ((partSet.gender !== gender) && (partSet.gender !== AvatarFigurePartType.UNISEX))) continue;

                if(partSet.isSellable && figureSetIds.indexOf(partSet.id) === -1) continue;

                let maxPaletteCount = 0;

                for(const part of partSet.parts) maxPaletteCount = Math.max(maxPaletteCount, part.colorLayerIndex);

                partItems.push({ id: partSet.id, partSet, usesColor, maxPaletteCount });
            }

            partItems.sort(AvatarEditorPartSorter(false));

            for(let i = 0; i < MAX_PALETTES; i++) colorItems[i].sort(AvatarEditorColorSorter);

            return { setType, partItems, colorItems };
        }

        newAvatarModels[AvatarEditorFigureCategory.GENERIC] = [ AvatarFigurePartType.HEAD ].map(setType => buildCategory(setType));
        newAvatarModels[AvatarEditorFigureCategory.HEAD] = [ AvatarFigurePartType.HAIR, AvatarFigurePartType.HEAD_ACCESSORY, AvatarFigurePartType.HEAD_ACCESSORY_EXTRA, AvatarFigurePartType.EYE_ACCESSORY, AvatarFigurePartType.FACE_ACCESSORY ].map(setType => buildCategory(setType));
        newAvatarModels[AvatarEditorFigureCategory.TORSO] = [ AvatarFigurePartType.CHEST, AvatarFigurePartType.CHEST_PRINT, AvatarFigurePartType.COAT_CHEST, AvatarFigurePartType.CHEST_ACCESSORY ].map(setType => buildCategory(setType));
        newAvatarModels[AvatarEditorFigureCategory.LEGS] = [ AvatarFigurePartType.LEGS, AvatarFigurePartType.SHOES, AvatarFigurePartType.WAIST_ACCESSORY ].map(setType => buildCategory(setType));
        newAvatarModels[AvatarEditorFigureCategory.WARDROBE] = [];

        setAvatarModels(newAvatarModels);
        setActiveModelKey(AvatarEditorFigureCategory.GENERIC);
    }, [ isVisible, gender, figureSetIds ]);

    useEffect(() =>
    {
        if(!isVisible) return;

        loadAvatarData(GetSessionDataManager().figure, GetSessionDataManager().gender);
    }, [ isVisible, loadAvatarData ]);

    useEffect(() =>
    {
        if(!isVisible || savedFigures) return;

        setSavedFigures(new Array(GetConfigurationValue<number>('avatar.wardrobe.max.slots', 10)));
        SendMessageComposer(new GetWardrobeMessageComposer());
    }, [ isVisible, savedFigures ]);

    return { isVisible, setIsVisible, avatarModels, activeModelKey, setActiveModelKey, maxPaletteCount, selectedColorParts, selectEditorColor, selectEditorPart, loadAvatarData, getFigureString, getFigureStringWithFace, selectedParts, gender, setGender, figureSetIds, randomizeCurrentFigure, savedFigures, setSavedFigures, getFirstSelectableColor };
}

export const useAvatarEditor = () => useBetween(useAvatarEditorState);
