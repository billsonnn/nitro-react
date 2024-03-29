import { AvatarFigureContainer, GetAvatarRenderManager, IFigurePartSet, IPalette, IPartColor, SetType } from '@nitrots/nitro-renderer';
import { Randomizer } from '../utils';
import { FigureData } from './FigureData';

function getTotalColors(partSet: IFigurePartSet): number
{
    const parts = partSet.parts;

    let totalColors = 0;

    for(const part of parts) totalColors = Math.max(totalColors, part.colorLayerIndex);

    return totalColors;
}

function getRandomSetTypes(requiredSets: string[], options: string[]): string[]
{
    options = options.filter(option => (requiredSets.indexOf(option) === -1));

    return [ ...requiredSets, ...Randomizer.getRandomElements(options, (Randomizer.getRandomNumber(options.length) + 1)) ];
}

function getRandomPartSet(setType: SetType, gender: string, clubLevel: number = 0, figureSetIds: number[] = []): IFigurePartSet
{
    if(!setType) return null;

    const options = setType.partSets.getValues().filter(option =>
    {
        if(!option.isSelectable || ((option.gender !== 'U') && (option.gender !== gender)) || (option.clubLevel > clubLevel) || (option.isSellable && (figureSetIds.indexOf(option.id) === -1))) return null;

        return option;
    });

    if(!options || !options.length) return null;

    return Randomizer.getRandomElement(options);
}

function getRandomColors(palette: IPalette, partSet: IFigurePartSet, clubLevel: number = 0): IPartColor[]
{
    if(!palette) return [];

    const options = palette.colors.getValues().filter(option =>
    {
        if(!option.isSelectable || (option.clubLevel > clubLevel)) return null;

        return option;
    });

    if(!options || !options.length) return null;

    return Randomizer.getRandomElements(options, getTotalColors(partSet));
}

export function generateRandomFigure(figureData: FigureData, gender: string, clubLevel: number = 0, figureSetIds: number[] = [], ignoredSets: string[] = []): string
{
    const structure = GetAvatarRenderManager().structure;
    const figureContainer = new AvatarFigureContainer('');
    const requiredSets = getRandomSetTypes(structure.getMandatorySetTypeIds(gender, clubLevel), FigureData.SET_TYPES);

    for(const setType of ignoredSets)
    {
        const partSetId = figureData.getPartSetId(setType);
        const colors = figureData.getColorIds(setType);

        figureContainer.updatePart(setType, partSetId, colors);
    }

    for(const type of requiredSets)
    {
        if(figureContainer.hasPartType(type)) continue;
        
        const setType = (structure.figureData.getSetType(type) as SetType);
        const selectedSet = getRandomPartSet(setType, gender, clubLevel, figureSetIds);

        if(!selectedSet) continue;

        let selectedColors: number[] = [];

        if(selectedSet.isColorable)
        {
            selectedColors = getRandomColors(structure.figureData.getPalette(setType.paletteID), selectedSet, clubLevel).map(color => color.id);
        }

        figureContainer.updatePart(setType.type, selectedSet.id, selectedColors);
    }

    return figureContainer.getFigureString();
}
