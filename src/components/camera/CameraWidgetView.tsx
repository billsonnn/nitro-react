import { ILinkEventTracker, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, RemoveLinkEventTracker } from '../../api';
import { useCamera, useRoomSessionManagerEvent } from '../../hooks';
import { CameraWidgetCaptureView } from './views/CameraWidgetCaptureView';
import { CameraWidgetCheckoutView } from './views/CameraWidgetCheckoutView';
import { CameraWidgetEditorView } from './views/editor/CameraWidgetEditorView';

const MODE_NONE: number = 0;
const MODE_CAPTURE: number = 1;
const MODE_EDITOR: number = 2;
const MODE_CHECKOUT: number = 3;

export const CameraWidgetView: FC<{}> = props =>
{
    const [ mode, setMode ] = useState<number>(MODE_NONE);
    const [ base64Url, setSavedPictureUrl ] = useState<string>(null);
    const { availableEffects = [], selectedPictureIndex = -1, cameraRoll = [], setCameraRoll = null, myLevel = 0, price = { credits: 0, duckets: 0, publishDucketPrice: 0 }} = useCamera();

    const processAction = (type: string) =>
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
    }

    const checkoutPictureUrl = (pictureUrl: string) =>
    {
        setSavedPictureUrl(pictureUrl);
        setMode(MODE_CHECKOUT);
    }

    useRoomSessionManagerEvent<RoomSessionEvent>(RoomSessionEvent.ENDED, event => setMode(MODE_NONE));

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
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
            },
            eventUrlPrefix: 'camera/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    if(mode === MODE_NONE) return null;

    return (
        <>
            { (mode === MODE_CAPTURE) && <CameraWidgetCaptureView onClose={ () => processAction('close') } onEdit={ () => processAction('edit') } onDelete={ () => processAction('delete') } /> }
            { (mode === MODE_EDITOR) && <CameraWidgetEditorView picture={ cameraRoll[selectedPictureIndex] } myLevel={ myLevel } onClose={ () => processAction('close') } onCancel={ () => processAction('editor_cancel') } onCheckout={ checkoutPictureUrl } availableEffects={ availableEffects } /> }
            { (mode === MODE_CHECKOUT) && <CameraWidgetCheckoutView base64Url={ base64Url } onCloseClick={ () => processAction('close') } onCancelClick={ () => processAction('editor_cancel') } price={ price }></CameraWidgetCheckoutView> }
        </>
    );
}
