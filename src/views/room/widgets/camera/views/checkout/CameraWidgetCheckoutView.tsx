/* eslint-disable jsx-a11y/anchor-is-valid */
import { RoomWidgetCameraPublishComposer, RoomWidgetCameraPublishedEvent, RoomWidgetCameraPurchaseComposer, RoomWidgetCameraPurchaseSuccessfulEvent } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomCameraWidgetManager } from '../../../../../../api/nitro/camera/GetRoomCameraWidgetManager';
import { CreateMessageHook, SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../../layout';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { CurrencyIcon } from '../../../../../shared/currency-icon/CurrencyIcon';
import { useCameraWidgetContext } from '../../context/CameraWidgetContext';
import { CameraWidgetCheckoutViewProps } from './CameraWidgetCheckoutView.types';

export const CameraWidgetCheckoutView: FC<CameraWidgetCheckoutViewProps> = props =>
{
    const { onCloseClick = null, onCancelClick = null, price = null } = props;
    
    const cameraWidgetContext = useCameraWidgetContext();

    const [ picturesBought, setPicturesBought ]             = useState(0);
    const [ wasPicturePublished, setWasPicturePublished ]   = useState(false);
    const [ isWaiting, setIsWaiting ]                       = useState(false);
    const [ publishCooldown, setPublishCooldown ]           = useState(0);

    const onCameraPurchaseSuccessfulEvent = useCallback((event: RoomWidgetCameraPurchaseSuccessfulEvent) =>
    {
        setPicturesBought(value => value + 1);
        setIsWaiting(false);
    }, []);

    const onRoomWidgetCameraPublishedEvent = useCallback((event: RoomWidgetCameraPublishedEvent) =>
    {
        const parser = event.getParser();

        setPublishCooldown(parser.cooldownSeconds);
        setWasPicturePublished(parser.wasSuccessful);
        setIsWaiting(false);
    }, []);

    CreateMessageHook(RoomWidgetCameraPurchaseSuccessfulEvent, onCameraPurchaseSuccessfulEvent);
    CreateMessageHook(RoomWidgetCameraPublishedEvent, onRoomWidgetCameraPublishedEvent);

    const getCurrentPicture = useCallback(() =>
    {
        return GetRoomCameraWidgetManager().applyEffects(cameraWidgetContext.cameraRoll[cameraWidgetContext.selectedPictureIndex], cameraWidgetContext.selectedEffects, cameraWidgetContext.isZoomed);
    }, [ cameraWidgetContext ]);

    const processAction = useCallback((type: string, value: string | number = null) =>
    {
        switch(type)
        {
            case 'close':
                onCloseClick();
                return;
            case 'buy':
                if(isWaiting) return;

                setIsWaiting(true);
                SendMessageHook(new RoomWidgetCameraPurchaseComposer());
                return;
            case 'publish':
                if(isWaiting) return;

                setIsWaiting(true);
                SendMessageHook(new RoomWidgetCameraPublishComposer());
                return;
            case 'cancel':
                onCancelClick();
                return;
        }
    }, [onCloseClick, isWaiting, onCancelClick]);

    if(!price) return null;

    return (
        <NitroCardView className="nitro-camera-checkout" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('camera.confirm_phase.title') } onCloseClick={ event => processAction('close') } />
            <NitroCardContentView>
                <div className="picture-preview border mb-2" style={ { backgroundImage: 'url(' + getCurrentPicture().src + ')' } }></div>
                <div className="bg-muted rounded p-2 text-black mb-2 d-flex justify-content-between align-items-center">
                    <div>
                        <div className="fw-bold d-flex justify-content-start">{ LocalizeText('camera.purchase.header') }{ price.credits > 0 && <>: { price.credits } <CurrencyIcon type={ -1 } /></> }</div>
                        { picturesBought > 0 && <div>{ LocalizeText('camera.purchase.count.info') + ' ' + picturesBought }</div> }
                    </div>
                    <div>
                        <button className="btn btn-success" disabled={ isWaiting } onClick={ event => processAction('buy') }>{ LocalizeText(picturesBought === 0 ? 'buy' : 'camera.buy.another.button.text') }</button>
                        { picturesBought > 0 && <div className="mt-1 text-center"><a href="#">{ LocalizeText('camera.open.inventory') }</a></div> }
                    </div>
                </div>
                <div className="bg-muted rounded p-2 text-black mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="me-2">
                            <div className="fw-bold d-flex justify-content-start">{ LocalizeText(wasPicturePublished ? 'camera.publish.successful' : 'camera.publish.explanation') }{ !wasPicturePublished && price.points > 0 && <>: { price.points } <CurrencyIcon type={ price.pointsType } /></> }</div>
                            <div>{ LocalizeText(wasPicturePublished ? 'camera.publish.success.short.info' : 'camera.publish.detailed.explanation') }</div>
                            { wasPicturePublished && <a href="#">{ LocalizeText('camera.link.to.published') }</a> }
                        </div>
                        { !wasPicturePublished && <button className="btn btn-success" disabled={ isWaiting || publishCooldown > 0 } onClick={ event => processAction('publish') }>{ LocalizeText('camera.publish.button.text') }</button> }
                    </div>
                    { publishCooldown > 0 && <div className="mt-1 text-center fw-bold">{ LocalizeText('camera.publish.wait', ['minutes'], [Math.ceil(publishCooldown/60).toString()]) }</div> }
                </div>
                <div className="text-black mb-2 text-center">{ LocalizeText('camera.warning.disclaimer') }</div>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary" onClick={ event => processAction('cancel') }>{ LocalizeText('generic.cancel') }</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
