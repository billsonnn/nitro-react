import { RoomCameraWidgetManagerEvent } from 'nitro-renderer/src/nitro/camera/events/RoomCameraWidgetManagerEvent';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { IRoomCameraWidgetSelectedEffect } from '../../../../../../nitro-renderer/src/nitro/camera/IRoomCameraWidgetSelectedEffect';
import { GetRoomCameraWidgetManager } from '../../../../api';
import { RoomWidgetCameraEvent } from '../../../../events/room-widgets/camera/RoomWidgetCameraEvent';
import { useCameraEvent } from '../../../../hooks/events/nitro/camera/camera-event';
import { useUiEvent } from '../../../../hooks/events/ui/ui-event';
import { CameraWidgetViewProps } from './CameraWidgetView.types';
import { CameraWidgetContextProvider } from './context/CameraWidgetContext';
import { CameraWidgetCaptureView } from './views/capture/CameraWidgetCaptureView';
import { CameraWidgetEditorView } from './views/editor/CameraWidgetEditorView';

export const CameraWidgetView: FC<CameraWidgetViewProps> = props =>
{
    const [ effectsReady, setEffectsReady ] = useState(false);
    const [ isCaptureVisible, setIsCaptureVisible ] = useState(false);
    const [ isEditorVisible, setIsEditorVisible ] = useState(false);

    const [ cameraRoll, setCameraRoll ]                     = useState<HTMLImageElement[]>([]);
    const [ selectedPictureIndex, setSelectedPictureIndex ] = useState(-1);
    const [ selectedEffects, setSelectedEffects ]           = useState<IRoomCameraWidgetSelectedEffect[]>([]);

    const onNitroEvent = useCallback((event: RoomWidgetCameraEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetCameraEvent.SHOW_CAMERA:
                setIsCaptureVisible(true);
                return;
            case RoomWidgetCameraEvent.HIDE_CAMERA:
                setIsCaptureVisible(false);
                setIsEditorVisible(false);
                return;   
            case RoomWidgetCameraEvent.TOGGLE_CAMERA:
                setIsEditorVisible(false);
                setIsCaptureVisible(value => !value);
                return;
        }
    }, []);

    useUiEvent(RoomWidgetCameraEvent.SHOW_CAMERA, onNitroEvent);
    useUiEvent(RoomWidgetCameraEvent.HIDE_CAMERA, onNitroEvent);
    useUiEvent(RoomWidgetCameraEvent.TOGGLE_CAMERA, onNitroEvent);

    const availableEffects = useMemo(() =>
    {
        if(!effectsReady) return null;

        return Array.from(GetRoomCameraWidgetManager().effects.values());
    }, [ effectsReady ]);

    const onRoomCameraWidgetManagerEvent = useCallback((event: RoomCameraWidgetManagerEvent) =>
    {
        setEffectsReady(true);
    }, []);

    useCameraEvent(RoomCameraWidgetManagerEvent.INITIALIZED, onRoomCameraWidgetManagerEvent);

    useEffect(() =>
    {
        if(!GetRoomCameraWidgetManager().isLoaded)
        {
            GetRoomCameraWidgetManager().init();

            return;
        }

        setEffectsReady(true);
    }, []);

    const processAction = useCallback((type: string, value: any = null) =>
    {
        switch(type)
        {
            case 'close':
                setIsCaptureVisible(false);
                setIsEditorVisible(false);
                return;
            case 'capture_edit':
                setIsCaptureVisible(false);
                setIsEditorVisible(true);
                return;
            case 'editor_cancel':
                setIsCaptureVisible(true);
                setIsEditorVisible(false);
                return;
        }
    }, []);

    return (
        <CameraWidgetContextProvider value={ { cameraRoll, setCameraRoll, selectedPictureIndex, setSelectedPictureIndex, selectedEffects, setSelectedEffects } }>
            { ( isCaptureVisible && <CameraWidgetCaptureView onCloseClick={ () => processAction('close') } onEditClick={ () => processAction('capture_edit') } /> ) ||
            ( isEditorVisible && <CameraWidgetEditorView onCloseClick={ () => processAction('close') } onCancelClick={ () => processAction('editor_cancel') } availableEffects={ availableEffects } /> ) }
        </CameraWidgetContextProvider>
    );
}
