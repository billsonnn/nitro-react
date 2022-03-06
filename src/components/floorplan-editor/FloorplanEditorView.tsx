import { FloorHeightMapEvent, NitroPoint, RoomEngineEvent, RoomVisualizationSettingsEvent, UpdateFloorPropertiesMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../api';
import { Button, ButtonGroup, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';
import { FloorplanEditorEvent } from '../../events';
import { UseMessageEventHook, UseRoomEngineEvent, UseUiEvent } from '../../hooks';
import { FloorplanEditor } from './common/FloorplanEditor';
import { IFloorplanSettings } from './common/IFloorplanSettings';
import { IVisualizationSettings } from './common/IVisualizationSettings';
import { convertNumbersForSaving, convertSettingToNumber } from './common/Utils';
import { FloorplanEditorContextProvider } from './FloorplanEditorContext';
import { FloorplanCanvasView } from './views/FloorplanCanvasView';
import { FloorplanImportExportView } from './views/FloorplanImportExportView';
import { FloorplanOptionsView } from './views/FloorplanOptionsView';

export const FloorplanEditorView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ importExportVisible, setImportExportVisible ] = useState(false);
    const [ originalFloorplanSettings, setOriginalFloorplanSettings ] = useState<IFloorplanSettings>({
        tilemap: '',
        reservedTiles: [],
        entryPoint: [0, 0],
        entryPointDir: 2,
        wallHeight: -1,
        thicknessWall: 1,
        thicknessFloor: 1
    });
    const [ visualizationSettings, setVisualizationSettings ] = useState<IVisualizationSettings>({
        entryPointDir: 2,
        wallHeight: -1,
        thicknessWall: 1,
        thicknessFloor: 1
    });

    const onFloorplanEditorEvent = useCallback((event: FloorplanEditorEvent) =>
    {
        switch(event.type)
        {
            case FloorplanEditorEvent.HIDE_FLOORPLAN_EDITOR:
                setIsVisible(false);
                break;
            case FloorplanEditorEvent.SHOW_FLOORPLAN_EDITOR:
                setIsVisible(true);
                break;
            case FloorplanEditorEvent.TOGGLE_FLOORPLAN_EDITOR:
                setIsVisible(prevValue => !prevValue);
                break;
        }
    }, []);

    UseUiEvent(FloorplanEditorEvent.HIDE_FLOORPLAN_EDITOR, onFloorplanEditorEvent);
    UseUiEvent(FloorplanEditorEvent.SHOW_FLOORPLAN_EDITOR, onFloorplanEditorEvent);
    UseUiEvent(FloorplanEditorEvent.TOGGLE_FLOORPLAN_EDITOR, onFloorplanEditorEvent);

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
    {
        setIsVisible(false);
    }, []);

    UseRoomEngineEvent(RoomEngineEvent.DISPOSED, onRoomEngineEvent);

    const onFloorHeightMapEvent = useCallback((event: FloorHeightMapEvent) =>
    {
        const parser = event.getParser();

        setOriginalFloorplanSettings(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.tilemap = parser.model;
                newValue.wallHeight = (parser.wallHeight + 1);

                return newValue;
            });

        setVisualizationSettings(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.wallHeight = (parser.wallHeight + 1);

                return newValue;
            });
    }, []);

    UseMessageEventHook(FloorHeightMapEvent, onFloorHeightMapEvent);

    const onRoomVisualizationSettingsEvent = useCallback((event: RoomVisualizationSettingsEvent) =>
    {
        const parser = event.getParser();

        setOriginalFloorplanSettings(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.thicknessFloor = convertSettingToNumber(parser.thicknessFloor);
                newValue.thicknessWall = convertSettingToNumber(parser.thicknessWall);

                return newValue;
            });

        setVisualizationSettings(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.thicknessFloor = convertSettingToNumber(parser.thicknessFloor);
                newValue.thicknessWall = convertSettingToNumber(parser.thicknessWall);

                return newValue;
            });
    }, []);

    UseMessageEventHook(RoomVisualizationSettingsEvent, onRoomVisualizationSettingsEvent);

    const saveFloorChanges = () =>
    {
        SendMessageComposer(new UpdateFloorPropertiesMessageComposer(
            FloorplanEditor.instance.getCurrentTilemapString(),
            FloorplanEditor.instance.doorLocation.x,
            FloorplanEditor.instance.doorLocation.y,
            visualizationSettings.entryPointDir,
            convertNumbersForSaving(visualizationSettings.thicknessWall),
            convertNumbersForSaving(visualizationSettings.thicknessFloor),
            (visualizationSettings.wallHeight - 1)
        ));
    }

    const revertChanges = () =>
    {
        setVisualizationSettings({ wallHeight: originalFloorplanSettings.wallHeight, thicknessWall: originalFloorplanSettings.thicknessWall, thicknessFloor: originalFloorplanSettings.thicknessFloor, entryPointDir: originalFloorplanSettings.entryPointDir });
        
        FloorplanEditor.instance.doorLocation = new NitroPoint(originalFloorplanSettings.entryPoint[0], originalFloorplanSettings.entryPoint[1]);
        FloorplanEditor.instance.setTilemap(originalFloorplanSettings.tilemap, originalFloorplanSettings.reservedTiles);
        FloorplanEditor.instance.renderTiles();
    }

    useEffect(() =>
    {
        FloorplanEditor.instance.initialize();
    }, []);

    return (
        <FloorplanEditorContextProvider value={{ originalFloorplanSettings: originalFloorplanSettings, setOriginalFloorplanSettings: setOriginalFloorplanSettings, visualizationSettings: visualizationSettings, setVisualizationSettings: setVisualizationSettings }}>
            { isVisible &&
                <NitroCardView uniqueKey="floorpan-editor" className="nitro-floorplan-editor" theme="primary-slim">
                    <NitroCardHeaderView headerText={ LocalizeText('floor.plan.editor.title') } onCloseClick={ () => setIsVisible(false) } />
                    <NitroCardContentView overflow="hidden">
                        <FloorplanOptionsView />
                        <FloorplanCanvasView overflow="hidden" />
                        <Flex justifyContent="between">
                            <Button onClick={ revertChanges }>{ LocalizeText('floor.plan.editor.reload') }</Button>
                            <ButtonGroup>
                                <Button disabled={ true }>{ LocalizeText('floor.plan.editor.preview') }</Button>
                                <Button onClick={ event => setImportExportVisible(true) }>{ LocalizeText('floor.plan.editor.import.export') }</Button>
                                <Button onClick={ saveFloorChanges }>{ LocalizeText('floor.plan.editor.save') }</Button>
                            </ButtonGroup>
                        </Flex>
                    </NitroCardContentView>
                </NitroCardView> }
            { importExportVisible &&
                <FloorplanImportExportView onCloseClick={ () => setImportExportVisible(false) } /> }
        </FloorplanEditorContextProvider>
    );
}
