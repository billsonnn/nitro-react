import { GetOccupiedTilesMessageComposer, GetRoomEntryTileMessageComposer, NitroPoint, RoomEntryTileMessageEvent, RoomOccupiedTilesMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { CreateMessageHook, SendMessageHook, UseMountEffect } from '../../../hooks';
import { FloorplanEditor } from '../common/FloorplanEditor';
import { useFloorplanEditorContext } from '../context/FloorplanEditorContext';

export const FloorplanCanvasView: FC<{}> = props =>
{
    const { originalFloorplanSettings = null, setOriginalFloorplanSettings = null, visualizationSettings = null, setVisualizationSettings = null } = useFloorplanEditorContext();
    const [ occupiedTilesReceived , setOccupiedTilesReceived ] = useState(false);
    const [ entryTileReceived, setEntryTileReceived ] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() =>
    {
        return ( () =>
        {
            FloorplanEditor.instance.clear();
            setVisualizationSettings( prev => {return { wallHeight: originalFloorplanSettings.wallHeight, thicknessWall: originalFloorplanSettings.thicknessWall, thicknessFloor: originalFloorplanSettings.thicknessFloor, entryPointDir: prev.entryPointDir } }); 
        });
    }, [originalFloorplanSettings.thicknessFloor, originalFloorplanSettings.thicknessWall, originalFloorplanSettings.wallHeight, setVisualizationSettings]);

    UseMountEffect(() =>
    {
        SendMessageHook(new GetRoomEntryTileMessageComposer());
        SendMessageHook(new GetOccupiedTilesMessageComposer());
        FloorplanEditor.instance.tilemapRenderer.interactive = true;
        elementRef.current.appendChild(FloorplanEditor.instance.renderer.view);
    });

    const onRoomOccupiedTilesMessageEvent = useCallback((event: RoomOccupiedTilesMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const settings = Object.assign({}, originalFloorplanSettings);
        settings.reservedTiles = parser.blockedTilesMap;
        setOriginalFloorplanSettings(settings);
        
        FloorplanEditor.instance.setTilemap(originalFloorplanSettings.tilemap, parser.blockedTilesMap);

        setOccupiedTilesReceived(true);
        
        elementRef.current.scrollTo(FloorplanEditor.instance.view.width / 3, 0);
    }, [originalFloorplanSettings, setOriginalFloorplanSettings]);

    CreateMessageHook(RoomOccupiedTilesMessageEvent, onRoomOccupiedTilesMessageEvent);

    const onRoomEntryTileMessageEvent = useCallback((event: RoomEntryTileMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const settings = Object.assign({}, originalFloorplanSettings);
        settings.entryPoint = [parser.x, parser.y];
        settings.entryPointDir = parser.direction;
        setOriginalFloorplanSettings(settings);

        const vSettings = Object.assign({}, visualizationSettings);
        vSettings.entryPointDir = parser.direction;
        setVisualizationSettings(vSettings);
        
        FloorplanEditor.instance.doorLocation = new NitroPoint(parser.x, parser.y);
        setEntryTileReceived(true);
    }, [originalFloorplanSettings, setOriginalFloorplanSettings, setVisualizationSettings, visualizationSettings]);

    CreateMessageHook(RoomEntryTileMessageEvent, onRoomEntryTileMessageEvent);

    useEffect(() =>
    {
        if(entryTileReceived && occupiedTilesReceived)
            FloorplanEditor.instance.renderTiles();
    }, [entryTileReceived, occupiedTilesReceived])

    return (
        <div ref={elementRef} className="editor-area" />
    );
}
