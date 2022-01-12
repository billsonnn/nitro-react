import { IRoomObject, IRoomObjectSpriteVisualization, NitroFilter, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from '../../../api';
import { WiredSelectionFilter } from './WiredSelectionFilter';

export class WiredSelectionVisualizer
{
    private static _selectionShader: NitroFilter = new WiredSelectionFilter([ 1, 1, 1 ], [ 0.6, 0.6, 0.6 ]);

    public static show(furniId: number): void
    {
        WiredSelectionVisualizer.applySelectionShader(WiredSelectionVisualizer.getRoomObject(furniId));
    }

    public static hide(furniId: number): void
    {
        WiredSelectionVisualizer.clearSelectionShader(WiredSelectionVisualizer.getRoomObject(furniId));
    }

    public static clearSelectionShaderFromFurni(furniIds: number[]): void
    {
        for(const furniId of furniIds)
        {
            WiredSelectionVisualizer.clearSelectionShader(WiredSelectionVisualizer.getRoomObject(furniId));
        }
    }

    public static applySelectionShaderToFurni(furniIds: number[]): void
    {
        for(const furniId of furniIds)
        {
            WiredSelectionVisualizer.applySelectionShader(WiredSelectionVisualizer.getRoomObject(furniId));
        }
    }

    private static getRoomObject(objectId: number): IRoomObject
    {
        const roomEngine = GetRoomEngine();

        return roomEngine.getRoomObject(roomEngine.activeRoomId, objectId, RoomObjectCategory.FLOOR);
    }

    private static applySelectionShader(roomObject: IRoomObject): void
    {
        if(!roomObject) return;

        const visualization = (roomObject.visualization as IRoomObjectSpriteVisualization);

        if(!visualization) return;

        for(const sprite of visualization.sprites)
        {
            if(sprite.blendMode === 1) continue; // BLEND_MODE: ADD

            sprite.filters = [ WiredSelectionVisualizer._selectionShader ];
        }
    }

    private static clearSelectionShader(roomObject: IRoomObject): void
    {
        if(!roomObject) return;

        const visualization = (roomObject.visualization as IRoomObjectSpriteVisualization);

        if(!visualization) return;

        for(const sprite of visualization.sprites) sprite.filters = [];
    }
}
