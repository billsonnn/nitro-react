import { ProviderProps } from 'react';

export interface IFloorplanEditorContext
{
    floorplanSettings: IFloorplanSettings;
    setFloorplanSettings: React.Dispatch<React.SetStateAction<IFloorplanSettings>>;
}

export interface IFloorplanSettings {
    tilemap: string;
    reservedTiles: boolean[][];
    entryPoint: [number, number];
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
