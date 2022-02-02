import { InitCameraMessageEvent, IRoomCameraWidgetEffect, RequestCameraConfigurationComposer, RoomCameraWidgetManagerEvent, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetRoomCameraWidgetManager } from '../../api';
import { RoomWidgetCameraEvent } from '../../events/camera/RoomWidgetCameraEvent';
import { useRoomSessionManagerEvent } from '../../hooks';
import { useCameraEvent } from '../../hooks/events/nitro/camera/camera-event';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { CameraWidgetContextProvider } from './CameraWidgetContext';
import { CameraPicture } from './common/CameraPicture';
import { CameraWidgetCaptureView } from './views/capture/CameraWidgetCaptureView';
import { CameraWidgetCheckoutView } from './views/checkout/CameraWidgetCheckoutView';
import { CameraWidgetEditorView } from './views/editor/CameraWidgetEditorView';

const MODE_NONE: number = 0;
const MODE_CAPTURE: number = 1;
const MODE_EDITOR: number = 2;
const MODE_CHECKOUT: number = 3;

export const CameraWidgetView: FC<{}> = props =>
{
    const [ mode, setMode ] = useState<number>(MODE_NONE);
    const [ availableEffects, setAvailableEffects ] = useState<IRoomCameraWidgetEffect[]>([]);
    const [ cameraRoll, setCameraRoll ] = useState<CameraPicture[]>([]);
    const [ selectedPictureIndex, setSelectedPictureIndex ] = useState(-1);
    const [ myLevel, setMyLevel ] = useState(10);
    const [ base64Url, setSavedPictureUrl ] = useState<string>(null);
    const [ price, setPrice ] = useState<{ credits: number, duckets: number, publishDucketPrice: number }>(null);

    const onNitroEvent = useCallback((event: RoomWidgetCameraEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetCameraEvent.SHOW_CAMERA:
                setMode(MODE_CAPTURE);
                return;
            case RoomWidgetCameraEvent.HIDE_CAMERA:
                setMode(MODE_NONE);
                return;   
            case RoomWidgetCameraEvent.TOGGLE_CAMERA:
                setMode(prevValue =>
                    {
                        if(!prevValue) return MODE_CAPTURE;
                        else return MODE_NONE;
                    });
                return;
        }
    }, []);

    useUiEvent(RoomWidgetCameraEvent.SHOW_CAMERA, onNitroEvent);
    useUiEvent(RoomWidgetCameraEvent.HIDE_CAMERA, onNitroEvent);
    useUiEvent(RoomWidgetCameraEvent.TOGGLE_CAMERA, onNitroEvent);

    const onRoomCameraWidgetManagerEvent = useCallback((event: RoomCameraWidgetManagerEvent) =>
    {
        setAvailableEffects(Array.from(GetRoomCameraWidgetManager().effects.values()))
    }, []);

    useCameraEvent(RoomCameraWidgetManagerEvent.INITIALIZED, onRoomCameraWidgetManagerEvent);

    const onCameraConfigurationEvent = useCallback((event: InitCameraMessageEvent) =>
    {
        const parser = event.getParser();
        
        setPrice({ credits: parser.creditPrice, duckets: parser.ducketPrice, publishDucketPrice: parser.publishDucketPrice });
    }, []);

    CreateMessageHook(InitCameraMessageEvent, onCameraConfigurationEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        setMode(MODE_NONE);
    }, []);

    useRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);

    useEffect(() =>
    {
        if(!GetRoomCameraWidgetManager().isLoaded)
        {
            GetRoomCameraWidgetManager().init();

            SendMessageHook(new RequestCameraConfigurationComposer());

            return;
        }
    }, []);

    const processAction = useCallback((type: string) =>
    {
        switch(type)
        {
            case 'close':
                setMode(MODE_NONE);
                return;
            case 'edit':
                setMode(MODE_EDITOR);
                return;
            case 'delete':
                setCameraRoll(prevValue =>
                    {
                        const clone = [ ...prevValue ];

                        clone.splice(selectedPictureIndex, 1);

                        return clone;
                    });
                return;
            case 'editor_cancel':
                setMode(MODE_CAPTURE);
                return;
        }
    }, [ selectedPictureIndex ]);

    const checkoutPictureUrl = useCallback((pictureUrl: string) =>
    {
        setSavedPictureUrl(pictureUrl);
        setMode(MODE_CHECKOUT);
    }, []);

    if(mode === MODE_NONE) return null;

    return (
        <CameraWidgetContextProvider value={ { cameraRoll, setCameraRoll, selectedPictureIndex, setSelectedPictureIndex } }>
            { (mode === MODE_CAPTURE) && <CameraWidgetCaptureView onClose={ () => processAction('close') } onEdit={ () => processAction('edit') } onDelete={ () => processAction('delete') } /> }
            { (mode === MODE_EDITOR) && <CameraWidgetEditorView picture={ cameraRoll[selectedPictureIndex] } myLevel={ myLevel } onClose={ () => processAction('close') } onCancel={ () => processAction('editor_cancel') } onCheckout={ checkoutPictureUrl } availableEffects={ availableEffects } /> }
            { (mode === MODE_CHECKOUT) && <CameraWidgetCheckoutView base64Url={ base64Url } onCloseClick={ () => processAction('close') } onCancelClick={ () => processAction('editor_cancel') } price={ price }></CameraWidgetCheckoutView> }
        </CameraWidgetContextProvider>
    );
}
