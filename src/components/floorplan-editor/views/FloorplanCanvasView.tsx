import { GetOccupiedTilesMessageComposer, GetRoomEntryTileMessageComposer, NitroPoint, RoomEntryTileMessageEvent, RoomOccupiedTilesMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowUp } from 'react-icons/fa';
import { SendMessageComposer } from '../../../api';
import { Base, Button, Column, ColumnProps, Flex, Grid } from '../../../common';
import { useMessageEvent } from '../../../hooks';
import { FloorplanEditor } from '../common/FloorplanEditor';
import { useFloorplanEditorContext } from '../FloorplanEditorContext';

export const FloorplanCanvasView: FC<ColumnProps> = props =>
{
    const { gap = 1, children = null, ...rest } = props;
    const [ occupiedTilesReceived , setOccupiedTilesReceived ] = useState(false);
    const [ entryTileReceived, setEntryTileReceived ] = useState(false);
    const { originalFloorplanSettings = null, setOriginalFloorplanSettings = null, setVisualizationSettings = null } = useFloorplanEditorContext();
    const elementRef = useRef<HTMLDivElement>(null);

    useMessageEvent<RoomOccupiedTilesMessageEvent>(RoomOccupiedTilesMessageEvent, event =>
    {
        const parser = event.getParser();

        setOriginalFloorplanSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.reservedTiles = parser.blockedTilesMap;

            FloorplanEditor.instance.setTilemap(newValue.tilemap, newValue.reservedTiles);

            return newValue;
        });

        setOccupiedTilesReceived(true);
        
        elementRef.current.scrollTo((FloorplanEditor.instance.view.width / 3), 0);
    });

    useMessageEvent<RoomEntryTileMessageEvent>(RoomEntryTileMessageEvent, event =>
    {
        const parser = event.getParser();

        setOriginalFloorplanSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.entryPoint = [ parser.x, parser.y ];
            newValue.entryPointDir = parser.direction;

            return newValue;
        });

        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.entryPointDir = parser.direction;

            return newValue;
        });
        
        FloorplanEditor.instance.doorLocation = new NitroPoint(parser.x, parser.y);

        setEntryTileReceived(true);
    });

    const onClickArrowButton = (scrollDirection: string) =>
    {
        const element = elementRef.current;

        if(!element) return;

        switch(scrollDirection)
        {
            case 'up':
                element.scrollBy({ top: -10 });
                break;
            case 'down':
                element.scrollBy({ top: 10 });
                break;
            case 'left':
                element.scrollBy({ left: -10 });
                break;
            case 'right':
                element.scrollBy({ left: 10 });
                break;
        }
    }

    useEffect(() =>
    {
        return () =>
        {
            FloorplanEditor.instance.clear();

            setVisualizationSettings(prevValue =>
            {
                return {
                    wallHeight: originalFloorplanSettings.wallHeight,
                    thicknessWall: originalFloorplanSettings.thicknessWall,
                    thicknessFloor: originalFloorplanSettings.thicknessFloor,
                    entryPointDir: prevValue.entryPointDir
                }
            });
        }
    }, [ originalFloorplanSettings.thicknessFloor, originalFloorplanSettings.thicknessWall, originalFloorplanSettings.wallHeight, setVisualizationSettings ]);

    useEffect(() =>
    {
        if(!entryTileReceived || !occupiedTilesReceived) return;
        
        FloorplanEditor.instance.renderTiles();
    }, [ entryTileReceived, occupiedTilesReceived ]);

    useEffect(() =>
    {
        SendMessageComposer(new GetRoomEntryTileMessageComposer());
        SendMessageComposer(new GetOccupiedTilesMessageComposer());

        FloorplanEditor.instance.tilemapRenderer.interactive = true;

        if(!elementRef.current) return;

        elementRef.current.appendChild(FloorplanEditor.instance.renderer.view);
    }, []);

    return (
        <Column gap={ gap } { ...rest }>
            <Grid overflow="hidden" gap={ 1 }>
                <Column center size={ 1 }>
                    <Button className="d-md-none" onClick={ event => onClickArrowButton('left') }>
                        <FaArrowLeft className="fa-icon" />
                    </Button>
                </Column>
                <Column overflow="hidden" size={ 10 } gap={ 1 }>
                    <Flex justifyContent="center" className="d-md-none">
                        <Button shrink onClick={ event => onClickArrowButton('up') }>
                            <FaArrowUp className="fa-icon" />
                        </Button>
                    </Flex>
                    <Base overflow="auto" innerRef={ elementRef } />
                    <Flex justifyContent="center" className="d-md-none">
                        <Button shrink onClick={ event => onClickArrowButton('down') }>
                            <FaArrowDown className="fa-icon" />
                        </Button>
                    </Flex>
                </Column>
                <Column center size={ 1 }>
                    <Button className="d-md-none" onClick={ event => onClickArrowButton('right') }>
                        <FaArrowRight className="fa-icon" />
                    </Button>
                </Column>
            </Grid>
            { children }
        </Column>
    );
}
