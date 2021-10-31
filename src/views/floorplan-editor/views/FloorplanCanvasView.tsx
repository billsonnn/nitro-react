import { GetOccupiedTilesMessageComposer, GetRoomEntryTileMessageComposer, NitroPoint, RoomEntryTileMessageEvent, RoomOccupiedTilesMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../hooks';
import { FloorplanEditor } from '../common/FloorplanEditor';
import { useFloorplanEditorContext } from '../context/FloorplanEditorContext';

export const FloorplanCanvasView: FC<{}> = props =>
{
    const { floorplanSettings = null, setFloorplanSettings = null } = useFloorplanEditorContext();
    const [ occupiedTilesReceived , setOccupiedTilesReceived ] = useState(false);
    const [ entryTileReceived, setEntryTileReceived ] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() =>
    {
        SendMessageHook(new GetRoomEntryTileMessageComposer());
        SendMessageHook(new GetOccupiedTilesMessageComposer());
        FloorplanEditor.instance.tilemapRenderer.interactive = true;
        elementRef.current.appendChild(FloorplanEditor.instance.renderer.view);

        return ( () =>
        {
            FloorplanEditor.instance.clear();
        });
    }, []);

    const onRoomOccupiedTilesMessageEvent = useCallback((event: RoomOccupiedTilesMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const settings = Object.assign({}, floorplanSettings);
        settings.reservedTiles = parser.blockedTilesMap;
        setFloorplanSettings(settings);
        
        FloorplanEditor.instance.setTilemap(floorplanSettings.tilemap, parser.blockedTilesMap);

        setOccupiedTilesReceived(true);
        
        elementRef.current.scrollTo(FloorplanEditor.instance.view.width / 3, 0);
    }, [floorplanSettings, setFloorplanSettings]);

    CreateMessageHook(RoomOccupiedTilesMessageEvent, onRoomOccupiedTilesMessageEvent);

    const onRoomEntryTileMessageEvent = useCallback((event: RoomEntryTileMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const settings = Object.assign({}, floorplanSettings);
        settings.entryPoint = [parser.x, parser.y];
        settings.entryPointDir = parser.direction;
        setFloorplanSettings(settings);
        
        FloorplanEditor.instance.doorLocation = new NitroPoint(settings.entryPoint[0], settings.entryPoint[1]);
        setEntryTileReceived(true);
    }, [floorplanSettings, setFloorplanSettings]);

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
