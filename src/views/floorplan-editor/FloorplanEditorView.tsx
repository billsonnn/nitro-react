import { FloorHeightMapEvent, RoomVisualizationSettingsEvent, UpdateFloorPropertiesMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../api';
import { FloorplanEditorEvent } from '../../events/floorplan-editor/FloorplanEditorEvent';
import { CreateMessageHook, SendMessageHook, useUiEvent } from '../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { FloorplanEditor } from './common/FloorplanEditor';
import { convertNumbersForSaving, convertSettingToNumber } from './common/Utils';
import { FloorplanEditorContextProvider } from './context/FloorplanEditorContext';
import { IFloorplanSettings, initialFloorplanSettings } from './context/FloorplanEditorContext.types';
import { FloorplanCanvasView } from './views/FloorplanCanvasView';
import { FloorplanOptionsView } from './views/FloorplanOptionsView';

export const FloorplanEditorView: FC<{}> = props =>
{
    const [isVisible, setIsVisible] = useState(false);
    const [floorplanSettings, setFloorplanSettings ] = useState<IFloorplanSettings>(initialFloorplanSettings);

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

    useUiEvent(FloorplanEditorEvent.HIDE_FLOORPLAN_EDITOR, onFloorplanEditorEvent);
    useUiEvent(FloorplanEditorEvent.SHOW_FLOORPLAN_EDITOR, onFloorplanEditorEvent);
    useUiEvent(FloorplanEditorEvent.TOGGLE_FLOORPLAN_EDITOR, onFloorplanEditorEvent);

    useEffect(() =>
    {
        FloorplanEditor.instance.initialize();
    }, []);

    const onFloorHeightMapEvent = useCallback((event: FloorHeightMapEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const settings = Object.assign({}, floorplanSettings);
        settings.tilemap = parser.model;
        settings.wallHeight = parser.wallHeight + 1;
        setFloorplanSettings(settings);
    }, [floorplanSettings]);

    CreateMessageHook(FloorHeightMapEvent, onFloorHeightMapEvent);

    const onRoomVisualizationSettingsEvent = useCallback((event: RoomVisualizationSettingsEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const settings = Object.assign({}, floorplanSettings);
        settings.thicknessFloor = convertSettingToNumber(parser.thicknessFloor)
        settings.thicknessWall = convertSettingToNumber(parser.thicknessWall);

        setFloorplanSettings(settings);
    }, [floorplanSettings]);

    CreateMessageHook(RoomVisualizationSettingsEvent, onRoomVisualizationSettingsEvent);

    const saveFloorChanges = useCallback(() =>
    {
        SendMessageHook(new UpdateFloorPropertiesMessageComposer(
            FloorplanEditor.instance.getCurrentTilemapString(),
            floorplanSettings.entryPoint[0],
            floorplanSettings.entryPoint[1],
            floorplanSettings.entryPointDir,
            convertNumbersForSaving(floorplanSettings.thicknessWall),
            convertNumbersForSaving(floorplanSettings.thicknessFloor),
            floorplanSettings.wallHeight - 1
        ));
    }, [floorplanSettings.entryPoint, floorplanSettings.entryPointDir, floorplanSettings.thicknessFloor, floorplanSettings.thicknessWall, floorplanSettings.wallHeight]);

    return (
        <>
        <FloorplanEditorContextProvider value={ { floorplanSettings, setFloorplanSettings } }>
            {isVisible &&
                <NitroCardView className="nitro-floorplan-editor">
                    <NitroCardHeaderView headerText={LocalizeText('floor.plan.editor.title')} onCloseClick={() => setIsVisible(false)} />
                    <NitroCardContentView>
                        <div className="row">
                            <div className="col">
                                <FloorplanOptionsView />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <FloorplanCanvasView />
                            </div>
                        </div>
                        <div className="row justify-content-between mt-2">
                            <div className="btn-group col-auto">
                                <button className="btn btn-primary">Revert changes</button>
                            </div>
                            <div className="btn-group col-auto" role="group" aria-label="First group">
                                <button className="btn btn-primary">Show Preview</button>
                                <button className="btn btn-primary">Import/Export</button>
                                <button className="btn btn-primary" onClick={saveFloorChanges}>Save</button>
                            </div>
                        </div>
                    </NitroCardContentView>
                </NitroCardView>
            }
        </FloorplanEditorContextProvider>
        </>
    );
}
