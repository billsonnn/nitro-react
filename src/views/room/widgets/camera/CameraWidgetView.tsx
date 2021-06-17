import { RoomCameraWidgetManagerEvent } from 'nitro-renderer/src/nitro/camera/events/RoomCameraWidgetManagerEvent';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { GetRoomCameraWidgetManager } from '../../../../api';
import { RoomWidgetCameraEvent } from '../../../../events/room-widgets/camera/RoomWidgetCameraEvent';
import { useCameraEvent } from '../../../../hooks/events/nitro/camera/camera-event';
import { useUiEvent } from '../../../../hooks/events/ui/ui-event';
import { useRoomContext } from '../../context/RoomContext';
import { CameraWidgetViewProps } from './CameraWidgetView.types';
import { CameraWidgetCaptureView } from './views/capture/CameraWidgetCaptureView';
import { CameraWidgetEditorView } from './views/editor/CameraWidgetEditorView';

export const CameraWidgetView: FC<CameraWidgetViewProps> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ effectsReady, setEffectsReady ] = useState(false);
    const [ isCaptureVisible, setIsCaptureVisible ] = useState(false);
    const [ isEditorVisible, setIsEditorVisible ] = useState(false);
    const [ chosenPicture, setChosenPicture ] = useState<HTMLImageElement>(null);

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
            case 'capture_choose_picture':
                setChosenPicture(value);
                setIsCaptureVisible(false);
                setIsEditorVisible(true);
                return;
        }
    }, []);

    return (
        ( isCaptureVisible && <CameraWidgetCaptureView onCloseClick={ () => processAction('close') } onChoosePicture={ (picture) => processAction('capture_choose_picture', picture) } /> ) ||
        ( isEditorVisible && <CameraWidgetEditorView onCloseClick={ () => processAction('close') } picture={ chosenPicture } availableEffects={ availableEffects } /> )
    );
}
