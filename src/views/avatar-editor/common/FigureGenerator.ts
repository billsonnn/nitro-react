import { AvatarFigureContainer, IFigurePartSet, IPalette, IPartColor, SetType } from 'nitro-renderer';
import { GetAvatarRenderManager } from '../../../api';
import { Randomizer } from '../../../utils';
import { FigureData } from './FigureData';

const RANDOM_TRIES: number = 20;

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

    const options = setType.partSets.getValues();

    let selectedSet: IFigurePartSet = null;
    let randomTries = RANDOM_TRIES;

    while(!selectedSet)
    {
        if(!randomTries) return setType.getDefaultPartSet(gender);

        const randomSet = Randomizer.getRandomElement(options);

        if(!randomSet.isSelectable || ((randomSet.gender !== 'U') && (randomSet.gender !== gender)) || (randomSet.clubLevel > clubLevel) || (randomSet.isSellable && (figureSetIds.indexOf(randomSet.id) === -1)))
        {
            randomTries--;

            continue;
        }

        return randomSet;
    }

    return null;
}

function getRandomColor(options: IPartColor[], clubLevel: number = 0): IPartColor
{
    const randomColor = Randomizer.getRandomElement(options);

    if(!randomColor.isSelectable || (randomColor.clubLevel > clubLevel)) return null;

    return randomColor;
}

function getRandomColors(palette: IPalette, partSet: IFigurePartSet, clubLevel: number = 0): number[]
{
    if(!palette) return [];

    const options = palette.colors.getValues();

    let totalColors = getTotalColors(partSet);
    let selectedColors: number[] = [];
    let randomTries = RANDOM_TRIES;

    while(totalColors)
    {
        if(!randomTries) break;

        const randomColor = getRandomColor(options, clubLevel);

        if(!randomColor)
        {
            randomTries--;

            continue;
        }

        selectedColors.push(randomColor.id);

        totalColors--;
    }

    return selectedColors;
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
            selectedColors = getRandomColors(structure.figureData.getPalette(setType.paletteID), selectedSet, clubLevel);
        }

        figureContainer.updatePart(setType.type, selectedSet.id, selectedColors);
    }

    return figureContainer.getFigureString();
}
