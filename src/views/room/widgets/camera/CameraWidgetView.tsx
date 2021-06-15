import { RoomCameraWidgetEditorEffect } from 'nitro-renderer/src/nitro/room/camera-widget/RoomCameraWidgetEditorEffect';
import { RoomCameraWidgetManagerEvent } from 'nitro-renderer/src/nitro/room/events/RoomCameraWidgetManagerEvent';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine } from '../../../../api';
import { RoomWidgetCameraEvent } from '../../../../events/room-widgets/camera/RoomWidgetCameraEvent';
import { useRoomEngineEvent } from '../../../../hooks/events/nitro/room/room-engine-event';
import { useUiEvent } from '../../../../hooks/events/ui/ui-event';
import { CameraWidgetViewProps } from './CameraWidgetView.types';
import { CameraWidgetCaptureView } from './views/capture/CameraWidgetCaptureView';
import { CameraWidgetEditorView } from './views/editor/CameraWidgetEditorView';

export const CameraWidgetView: FC<CameraWidgetViewProps> = props =>
{
    const [ isCaptureVisible, setIsCaptureVisible ] = useState(false);
    const [ isEditorVisible, setIsEditorVisible ]   = useState(false);
    const [ chosenPicture, setChosenPicture ]       = useState<HTMLImageElement>(null);
    const [ availableEffects, setAvailableEffects ] = useState<RoomCameraWidgetEditorEffect[]>(null);

    const getAvailableEffects = useCallback(() =>
    {
        if(GetRoomEngine().roomCameraWidgetManager.isLoaded)
        {
            setAvailableEffects(Array.from(GetRoomEngine().roomCameraWidgetManager.loadedEffects.values()));
        }
    }, []);

    const onNitroEvent = useCallback((event: RoomWidgetCameraEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetCameraEvent.SHOW_CAMERA:
                setIsCaptureVisible(true);
                getAvailableEffects();
                return;
            case RoomWidgetCameraEvent.HIDE_CAMERA:
                setIsCaptureVisible(false);
                setIsEditorVisible(false);
                return;   
            case RoomWidgetCameraEvent.TOGGLE_CAMERA:
                setIsEditorVisible(false);
                setIsCaptureVisible(value => !value);
                getAvailableEffects();
                return;
            case RoomCameraWidgetManagerEvent.INITIALIZED:
                getAvailableEffects();
                return;
        }
    }, []);

    useUiEvent(RoomWidgetCameraEvent.SHOW_CAMERA, onNitroEvent);
    useUiEvent(RoomWidgetCameraEvent.HIDE_CAMERA, onNitroEvent);
    useUiEvent(RoomWidgetCameraEvent.TOGGLE_CAMERA, onNitroEvent);
    useRoomEngineEvent(RoomCameraWidgetManagerEvent.INITIALIZED, onNitroEvent);

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
