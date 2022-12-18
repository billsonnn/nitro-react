import { TILE_SIZE } from './Constants';

export const getScreenPositionForTile = (x: number, y: number): [number , number] =>
{
    let positionX = (x * TILE_SIZE / 2) - (y * TILE_SIZE / 2);
    const positionY = (x * TILE_SIZE / 4) + (y * TILE_SIZE / 4);

    positionX = positionX + 1024; // center the map in the canvas

    return [ positionX, positionY ];
}

export const getTileFromScreenPosition = (x: number, y: number): [number, number] =>
{
    const translatedX = x - 1024; // after centering translation
    
    const realX = ((translatedX /(TILE_SIZE / 2)) + (y / (TILE_SIZE / 4))) / 2;
    const realY = ((y /(TILE_SIZE / 4)) - (translatedX / (TILE_SIZE / 2))) / 2;

    return [ realX, realY ];
}

export const convertNumbersForSaving = (value: number): number =>
{
    value = parseInt(value.toString());
    switch(value)
    {
        case 0:
            return -2;
        case 1:
            return -1;
        case 3:
            return 1;
        default:
            return 0;

    }
}

export const convertSettingToNumber = (value: number): number =>
{
    switch(value)
    {
        case 0.25:
            return 0;
        case 0.5:
            return 1;
        case 2:
            return 3;
        default:
            return 2;
    }
}
