import { PetCustomPart } from 'nitro-renderer';

export interface PetImageViewProps
{
    figure?: string;
    typeId?: number;
    paletteId?: number;
    color?: number;
    customParts?: PetCustomPart[];
    headOnly?: boolean;
    direction?: number;
    scale?: number;
}
