import { GetRoomEngine, IRoomObject, IRoomObjectSpriteVisualization, RoomObjectCategory, WiredFilter } from '@nitrots/nitro-renderer';

export class WiredSelectionVisualizer
{
    private static _selectionShader: WiredFilter = new WiredFilter({
        lineColor: [ 1, 1, 1 ],
        color: [ 0.6, 0.6, 0.6 ]
    });

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
            if(sprite.blendMode === 'add') continue;

            if(!sprite.filters) sprite.filters = [];

            sprite.filters.push(WiredSelectionVisualizer._selectionShader);

            sprite.increaseUpdateCounter();
        }
    }

    private static clearSelectionShader(roomObject: IRoomObject): void
    {
        if(!roomObject) return;

        const visualization = (roomObject.visualization as IRoomObjectSpriteVisualization);

        if(!visualization) return;

        for(const sprite of visualization.sprites)
        {
            if(!sprite.filters) continue;

            const index = sprite.filters.indexOf(WiredSelectionVisualizer._selectionShader);

            if(index >= 0)
            {
                sprite.filters.splice(index, 1);

                sprite.increaseUpdateCounter();
            }
        }
    }
}
