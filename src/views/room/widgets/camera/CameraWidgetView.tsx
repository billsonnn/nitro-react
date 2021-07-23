import { RoomWidgetCameraConfigurationComposer, RoomWidgetCameraConfigurationEvent } from 'nitro-renderer';
import { RoomCameraWidgetManagerEvent } from 'nitro-renderer/src/nitro/camera/events/RoomCameraWidgetManagerEvent';
import { IRoomCameraWidgetSelectedEffect } from 'nitro-renderer/src/nitro/camera/IRoomCameraWidgetSelectedEffect';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { GetRoomCameraWidgetManager } from '../../../../api';
import { RoomWidgetCameraEvent } from '../../../../events/room-widgets/camera/RoomWidgetCameraEvent';
import { useCameraEvent } from '../../../../hooks/events/nitro/camera/camera-event';
import { useUiEvent } from '../../../../hooks/events/ui/ui-event';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks/messages/message-event';
import { CameraWidgetContextProvider } from './context/CameraWidgetContext';
import { CameraWidgetCaptureView } from './views/capture/CameraWidgetCaptureView';
import { CameraWidgetCheckoutView } from './views/checkout/CameraWidgetCheckoutView';
import { CameraWidgetEditorView } from './views/editor/CameraWidgetEditorView';

export const CameraWidgetView: FC<{}> = props =>
{
    const [ effectsReady, setEffectsReady ] = useState(false);
   
    const [ isCaptureVisible, setIsCaptureVisible ]     = useState(false);
    const [ isEditorVisible, setIsEditorVisible ]       = useState(false);
    const [ isCheckoutVisible, setIsCheckoutVisible ]   = useState(false);

    const [ myLevel, setMyLevel ]                           = useState(10);
    const [ cameraRoll, setCameraRoll ]                     = useState<HTMLImageElement[]>([]);
    const [ selectedPictureIndex, setSelectedPictureIndex ] = useState(-1);
    const [ selectedEffects, setSelectedEffects ]           = useState<IRoomCameraWidgetSelectedEffect[]>([]);
    const [ isZoomed, setIsZoomed ]                         = useState(false);
    const [ price, setPrice ]                               = useState<{credits: Number, points: Number, pointsType: number}>(null);

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
                setIsCheckoutVisible(false);
                return;   
            case RoomWidgetCameraEvent.TOGGLE_CAMERA:
                setIsCaptureVisible(value => !value);
                setIsEditorVisible(false);
                setIsCheckoutVisible(false);
                return;
        }
    }, []);

    useUiEvent(RoomWidgetCameraEvent.SHOW_CAMERA, onNitroEvent);
    useUiEvent(RoomWidgetCameraEvent.HIDE_CAMERA, onNitroEvent);
    useUiEvent(RoomWidgetCameraEvent.TOGGLE_CAMERA, onNitroEvent);

    useEffect(() =>
    {
        if(price) return;
        
        SendMessageHook(new RoomWidgetCameraConfigurationComposer());
    }, [ price ]);

    const onCameraConfigurationEvent = useCallback((event: RoomWidgetCameraConfigurationEvent) =>
    {
        const parser = event.getParser();
        
        setPrice({ credits: parser.credits, points: parser.points, pointsType: parser.pointsType });
    }, []);

    CreateMessageHook(RoomWidgetCameraConfigurationEvent, onCameraConfigurationEvent);

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
                setIsCheckoutVisible(false);
                return;
            case 'capture_edit':
                setIsCaptureVisible(false);
                setIsEditorVisible(true);
                return;
            case 'editor_cancel':
                setIsCaptureVisible(true);
                setIsEditorVisible(false);
                setIsCheckoutVisible(false);
                return;
            case 'editor_checkout':
                setIsEditorVisible(false);
                setIsCheckoutVisible(true);
                return;
        }
    }, []);

    return (
        <CameraWidgetContextProvider value={ { cameraRoll, setCameraRoll, selectedPictureIndex, setSelectedPictureIndex, selectedEffects, setSelectedEffects, isZoomed, setIsZoomed } }>
            { isCaptureVisible && <CameraWidgetCaptureView onCloseClick={ () => processAction('close') } onEditClick={ () => processAction('capture_edit') } /> }
            { isEditorVisible && <CameraWidgetEditorView myLevel={ myLevel } onCloseClick={ () => processAction('close') } onCancelClick={ () => processAction('editor_cancel') } onCheckoutClick={ () => processAction('editor_checkout') } availableEffects={ availableEffects } /> }
            { isCheckoutVisible && <CameraWidgetCheckoutView onCloseClick={ () => processAction('close') } onCancelClick={ () => processAction('editor_cancel') } price={ price }></CameraWidgetCheckoutView> }
        </CameraWidgetContextProvider>
    );
}
