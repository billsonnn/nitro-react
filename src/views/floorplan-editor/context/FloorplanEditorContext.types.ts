import { ProviderProps } from 'react';

export interface IFloorplanEditorContext
{
    originalFloorplanSettings: IFloorplanSettings;
    setOriginalFloorplanSettings: React.Dispatch<React.SetStateAction<IFloorplanSettings>>;
    visualizationSettings: IVisualizationSettings;
    setVisualizationSettings: React.Dispatch<React.SetStateAction<IVisualizationSettings>>;
}

export interface IFloorplanSettings extends IVisualizationSettings {
    tilemap: string;
    reservedTiles: boolean[][];
    entryPoint: [number, number];
}

export interface IVisualizationSettings {
    entryPointDir: number;
    wallHeight: number;
    thicknessWall: number;
    thicknessFloor: number;
}

export const initialFloorplanSettings: IFloorplanSettings = {
    tilemap: '',
    reservedTiles: [],
    entryPoint: [0, 0],
    entryPointDir: 2,
    wallHeight: -1,
    thicknessWall: 1,
    thicknessFloor: 1
}

export interface FloorplanEditorContextProps extends ProviderProps<IFloorplanEditorContext>
{

}
