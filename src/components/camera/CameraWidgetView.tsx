import { ILinkEventTracker, InitCameraMessageEvent, IRoomCameraWidgetEffect, RequestCameraConfigurationComposer, RoomCameraWidgetManagerEvent, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AddEventLinkTracker, GetRoomCameraWidgetManager, RemoveLinkEventTracker, SendMessageComposer } from '../../api';
import { UseCameraEvent, UseMessageEventHook, UseRoomSessionManagerEvent } from '../../hooks';
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

    const onRoomCameraWidgetManagerEvent = useCallback((event: RoomCameraWidgetManagerEvent) =>
    {
        setAvailableEffects(Array.from(GetRoomCameraWidgetManager().effects.values()))
    }, []);

    UseCameraEvent(RoomCameraWidgetManagerEvent.INITIALIZED, onRoomCameraWidgetManagerEvent);

    const onCameraConfigurationEvent = useCallback((event: InitCameraMessageEvent) =>
    {
        const parser = event.getParser();
        
        setPrice({ credits: parser.creditPrice, duckets: parser.ducketPrice, publishDucketPrice: parser.publishDucketPrice });
    }, []);

    UseMessageEventHook(InitCameraMessageEvent, onCameraConfigurationEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        setMode(MODE_NONE);
    }, []);

    UseRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);

    useEffect(() =>
    {
        if(!GetRoomCameraWidgetManager().isLoaded)
        {
            GetRoomCameraWidgetManager().init();

            SendMessageComposer(new RequestCameraConfigurationComposer());

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

    const linkReceived = useCallback((url: string) =>
    {
        const parts = url.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'show':
                setMode(MODE_CAPTURE);
                return;
            case 'hide':
                setMode(MODE_NONE);
                return;
            case 'toggle':
                setMode(prevValue =>
                    {
                        if(!prevValue) return MODE_CAPTURE;
                        else return MODE_NONE;
                    });
                return;
        }
    }, []);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived,
            eventUrlPrefix: 'camera/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ linkReceived ]);

    if(mode === MODE_NONE) return null;

    return (
        <CameraWidgetContextProvider value={ { cameraRoll, setCameraRoll, selectedPictureIndex, setSelectedPictureIndex } }>
            { (mode === MODE_CAPTURE) && <CameraWidgetCaptureView onClose={ () => processAction('close') } onEdit={ () => processAction('edit') } onDelete={ () => processAction('delete') } /> }
            { (mode === MODE_EDITOR) && <CameraWidgetEditorView picture={ cameraRoll[selectedPictureIndex] } myLevel={ myLevel } onClose={ () => processAction('close') } onCancel={ () => processAction('editor_cancel') } onCheckout={ checkoutPictureUrl } availableEffects={ availableEffects } /> }
            { (mode === MODE_CHECKOUT) && <CameraWidgetCheckoutView base64Url={ base64Url } onCloseClick={ () => processAction('close') } onCancelClick={ () => processAction('editor_cancel') } price={ price }></CameraWidgetCheckoutView> }
        </CameraWidgetContextProvider>
    );
}
