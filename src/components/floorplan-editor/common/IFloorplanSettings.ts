import { IVisualizationSettings } from './IVisualizationSettings';

export interface IFloorplanSettings extends IVisualizationSettings
{
    tilemap: string;
    reservedTiles: boolean[][];
    entryPoint: [ number, number ];
}
