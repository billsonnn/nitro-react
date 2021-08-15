import { PetCustomPart } from '@nitrots/nitro-renderer';

export interface PetImageViewProps
{
    figure?: string;
    typeId?: number;
    paletteId?: number;
    color?: number;
    customParts?: PetCustomPart[];
    posture?: string;
    headOnly?: boolean;
    direction?: number;
    scale?: number;
}
