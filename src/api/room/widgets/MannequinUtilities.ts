import { AvatarFigurePartType, IAvatarFigureContainer } from '@nitrots/nitro-renderer';
import { GetAvatarRenderManager } from '../../nitro';

const MANNEQUIN_FIGURE = [ 'hd', 99999, [ 99998 ] ];
const MANNEQUIN_CLOTHING_PART_TYPES = [
    AvatarFigurePartType.CHEST_ACCESSORY,
    AvatarFigurePartType.COAT_CHEST,
    AvatarFigurePartType.CHEST,
    AvatarFigurePartType.LEGS,
    AvatarFigurePartType.SHOES,
    AvatarFigurePartType.WAIST_ACCESSORY
];

export const GetMergedMannequinFigureContainer = (figure: string, targetFigure: string) =>
{
    const figureContainer = GetAvatarRenderManager().createFigureContainer(figure);
    const targetFigureContainer = GetAvatarRenderManager().createFigureContainer(targetFigure);

    for(const part of MANNEQUIN_CLOTHING_PART_TYPES) figureContainer.removePart(part);

    for(const part of targetFigureContainer.getPartTypeIds())
    {
        figureContainer.updatePart(part, targetFigureContainer.getPartSetId(part), targetFigureContainer.getPartColorIds(part));
    }

    return figureContainer;
}

export const TransformAsMannequinFigure = (figureContainer: IAvatarFigureContainer) =>
{
    for(const part of figureContainer.getPartTypeIds())
    {
        if(MANNEQUIN_CLOTHING_PART_TYPES.indexOf(part) >= 0) continue;
            
        figureContainer.removePart(part);
    }
    
    figureContainer.updatePart((MANNEQUIN_FIGURE[0] as string), (MANNEQUIN_FIGURE[1] as number), (MANNEQUIN_FIGURE[2] as number[]));
};
