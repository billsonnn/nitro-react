import { IObjectData } from '@nitrots/nitro-renderer';

export interface IFurnitureItem
{
    id: number;
    ref: number;
    type: number;
    stuffData: IObjectData;
    extra: number;
    category: number;
    recyclable: boolean;
    isTradable: boolean;
    isGroupable: boolean;
    sellable: boolean;
    locked: boolean;
    isWallItem: boolean;
}
