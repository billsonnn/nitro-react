import { FloorHeightMapEvent, NitroPoint, RoomEngineEvent, RoomVisualizationSettingsEvent, UpdateFloorPropertiesMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../api';
import { Column, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';
import { FloorplanEditorEvent } from '../../events';
import { UseMessageEventHook, UseMountEffect, UseRoomEngineEvent, UseUiEvent } from '../../hooks';
import { FloorplanEditor } from './common/FloorplanEditor';
import { convertNumbersForSaving, convertSettingToNumber } from './common/Utils';
import { FloorplanEditorContextProvider } from './context/FloorplanEditorContext';
import { IFloorplanSettings, initialFloorplanSettings, IVisualizationSettings } from './context/FloorplanEditorContext.types';
import { FloorplanCanvasView } from './views/FloorplanCanvasView';
import { FloorplanImportExportView } from './views/FloorplanImportExportView';
import { FloorplanOptionsView } from './views/FloorplanOptionsView';

export const FloorplanEditorView: FC<{}> = props =>
{
    const [isVisible, setIsVisible] = useState(false);
    const [ importExportVisible, setImportExportVisible ] = useState(false);
    const [originalFloorplanSettings, setOriginalFloorplanSettings] = useState<IFloorplanSettings>(initialFloorplanSettings);
    const [visualizationSettings, setVisualizationSettings] = useState<IVisualizationSettings>(
        {
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
                setIsVisible(!isVisible);
                break;
        }
    }, [isVisible]);

    UseUiEvent(FloorplanEditorEvent.HIDE_FLOORPLAN_EDITOR, onFloorplanEditorEvent);
    UseUiEvent(FloorplanEditorEvent.SHOW_FLOORPLAN_EDITOR, onFloorplanEditorEvent);
    UseUiEvent(FloorplanEditorEvent.TOGGLE_FLOORPLAN_EDITOR, onFloorplanEditorEvent);

    UseMountEffect(() =>
    {
        FloorplanEditor.instance.initialize();
    });

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
    {
        setIsVisible(false);
    }, []);

    UseRoomEngineEvent(RoomEngineEvent.DISPOSED, onRoomEngineEvent);

    const onFloorHeightMapEvent = useCallback((event: FloorHeightMapEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const settings = Object.assign({}, originalFloorplanSettings);
        settings.tilemap = parser.model;
        settings.wallHeight = parser.wallHeight + 1;
        setOriginalFloorplanSettings(settings);

        const vSettings = Object.assign({}, visualizationSettings);
        vSettings.wallHeight = parser.wallHeight + 1;
        setVisualizationSettings(vSettings);

    }, [originalFloorplanSettings, visualizationSettings]);

    UseMessageEventHook(FloorHeightMapEvent, onFloorHeightMapEvent);

    const onRoomVisualizationSettingsEvent = useCallback((event: RoomVisualizationSettingsEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const settings = Object.assign({}, originalFloorplanSettings);
        settings.thicknessFloor = convertSettingToNumber(parser.thicknessFloor);
        settings.thicknessWall = convertSettingToNumber(parser.thicknessWall);

        setOriginalFloorplanSettings(settings);

        const vSettings = Object.assign({}, visualizationSettings);
        vSettings.thicknessFloor = convertSettingToNumber(parser.thicknessFloor);
        vSettings.thicknessWall = convertSettingToNumber(parser.thicknessWall);
        setVisualizationSettings(vSettings);
    }, [originalFloorplanSettings, visualizationSettings]);

    UseMessageEventHook(RoomVisualizationSettingsEvent, onRoomVisualizationSettingsEvent);

    const saveFloorChanges = useCallback(() =>
    {
        SendMessageComposer(new UpdateFloorPropertiesMessageComposer(
            FloorplanEditor.instance.getCurrentTilemapString(),
            FloorplanEditor.instance.doorLocation.x,
            FloorplanEditor.instance.doorLocation.y,
            visualizationSettings.entryPointDir,
            convertNumbersForSaving(visualizationSettings.thicknessWall),
            convertNumbersForSaving(visualizationSettings.thicknessFloor),
            visualizationSettings.wallHeight - 1
        ));
    }, [visualizationSettings.entryPointDir, visualizationSettings.thicknessFloor, visualizationSettings.thicknessWall, visualizationSettings.wallHeight]);

    const revertChanges = useCallback(() =>
    {
        setVisualizationSettings({ wallHeight: originalFloorplanSettings.wallHeight, thicknessWall: originalFloorplanSettings.thicknessWall, thicknessFloor: originalFloorplanSettings.thicknessFloor, entryPointDir: originalFloorplanSettings.entryPointDir });
        
        FloorplanEditor.instance.doorLocation = new NitroPoint(originalFloorplanSettings.entryPoint[0], originalFloorplanSettings.entryPoint[1]);
        FloorplanEditor.instance.setTilemap(originalFloorplanSettings.tilemap, originalFloorplanSettings.reservedTiles);
        FloorplanEditor.instance.renderTiles();
    }, [originalFloorplanSettings.entryPoint, originalFloorplanSettings.entryPointDir, originalFloorplanSettings.reservedTiles, originalFloorplanSettings.thicknessFloor, originalFloorplanSettings.thicknessWall, originalFloorplanSettings.tilemap, originalFloorplanSettings.wallHeight])

    return (
        <>
            <FloorplanEditorContextProvider value={{ originalFloorplanSettings: originalFloorplanSettings, setOriginalFloorplanSettings: setOriginalFloorplanSettings, visualizationSettings: visualizationSettings, setVisualizationSettings: setVisualizationSettings }}>
                {isVisible &&
                    <NitroCardView uniqueKey="floorpan-editor" className="nitro-floorplan-editor" theme="primary-slim">
                        <NitroCardHeaderView headerText={LocalizeText('floor.plan.editor.title')} onCloseClick={() => setIsVisible(false)} />
                        <NitroCardContentView>
                            <Grid>
                                <Column size={12}>
                                    <FloorplanOptionsView />
                                    <FloorplanCanvasView />
                                    <Flex className="justify-content-between">
                                        <div className="btn-group">
                                            <button className="btn btn-primary" onClick={revertChanges}>{LocalizeText('floor.plan.editor.reload')}</button>
                                        </div>
                                        <div className="btn-group">
                                            <button className="btn btn-primary" disabled={true}>{LocalizeText('floor.plan.editor.preview')}</button>
                                            <button className="btn btn-primary" onClick={ () => setImportExportVisible(true) }>{LocalizeText('floor.plan.editor.import.export')}</button>
                                            <button className="btn btn-primary" onClick={saveFloorChanges}>{LocalizeText('floor.plan.editor.save')}</button>
                                        </div>
                                    </Flex>
                                </Column>
                            </Grid>
                        </NitroCardContentView>
                    </NitroCardView>
                }
                {importExportVisible && <FloorplanImportExportView onCloseClick={ () => setImportExportVisible(false)}/>}
            </FloorplanEditorContextProvider>
        </>
    );
}
