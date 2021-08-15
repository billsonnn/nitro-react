import { CameraPublishStatusMessageEvent, CameraPurchaseOKMessageEvent, CameraStorageUrlMessageEvent, PublishPhotoMessageComposer, PurchasePhotoMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetConfiguration, GetRoomEngine } from '../../../../../../api';
import { CreateMessageHook, SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../../layout';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { CurrencyIcon } from '../../../../../shared/currency-icon/CurrencyIcon';
import { CameraWidgetCheckoutViewProps } from './CameraWidgetCheckoutView.types';

export const CameraWidgetCheckoutView: FC<CameraWidgetCheckoutViewProps> = props =>
{
    const { base64Url = null, onCloseClick = null, onCancelClick = null, price = null } = props;
    const [ pictureUrl, setPictureUrl ] = useState<string>(null);
    const [ publishUrl, setPublishUrl ] = useState<string>(null);
    const [ picturesBought, setPicturesBought ] = useState(0);
    const [ wasPicturePublished, setWasPicturePublished ] = useState(false);
    const [ isWaiting, setIsWaiting ] = useState(false);
    const [ publishCooldown, setPublishCooldown ] = useState(0);

    useEffect(() =>
    {
        if(!base64Url) return;

        GetRoomEngine().saveBase64AsScreenshot(base64Url);
    }, [ base64Url ]);

    const onCameraPurchaseOKMessageEvent = useCallback((event: CameraPurchaseOKMessageEvent) =>
    {
        setPicturesBought(value => (value + 1));
        setIsWaiting(false);
    }, []);

    CreateMessageHook(CameraPurchaseOKMessageEvent, onCameraPurchaseOKMessageEvent);

    const onCameraPublishStatusMessageEvent = useCallback((event: CameraPublishStatusMessageEvent) =>
    {
        const parser = event.getParser();

        setPublishUrl(parser.extraDataId);
        setPublishCooldown(parser.secondsToWait);
        setWasPicturePublished(parser.ok);
        setIsWaiting(false);
    }, []);

    CreateMessageHook(CameraPublishStatusMessageEvent, onCameraPublishStatusMessageEvent);

    const onCameraStorageUrlMessageEvent = useCallback((event: CameraStorageUrlMessageEvent) =>
    {
        const parser = event.getParser();

        setPictureUrl(GetConfiguration<string>('camera.url') + '/' + parser.url);
    }, []);

    CreateMessageHook(CameraStorageUrlMessageEvent, onCameraStorageUrlMessageEvent);

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
                SendMessageHook(new PurchasePhotoMessageComposer(''));
                return;
            case 'publish':
                if(isWaiting) return;

                setIsWaiting(true);
                SendMessageHook(new PublishPhotoMessageComposer());
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
                <div className="d-flex justify-content-center align-items-center picture-preview border mb-2" style={ pictureUrl ? { backgroundImage: 'url(' + pictureUrl + ')' } : {} }>
                    { !pictureUrl &&
                        <div className="text-black fw-bold">
                            { LocalizeText('camera.loading') }
                        </div> }
                </div>
                { pictureUrl && <div className="text-black mb-2">{ LocalizeText('camera.confirm_phase.info') }</div> }
                <div className="d-flex justify-content-between bg-muted rounded p-2 text-black mb-2">
                    <div className="d-flex flex-column">
                        <div className="fw-bold d-flex justify-content-start">{ LocalizeText('camera.purchase.header') }</div>
                        { ((price.credits > 0) || (price.duckets > 0)) &&
                            <div className="d-flex">
                                <div className="me-1">{ LocalizeText('catalog.purchase.confirmation.dialog.cost') }</div>
                                { (price.credits > 0) &&
                                    <div className="d-flex fw-bold">
                                        { price.credits } <CurrencyIcon type={ -1 } />
                                    </div> }
                                { (price.duckets > 0) &&
                                    <div className="d-flex fw-bold">
                                        { price.duckets } <CurrencyIcon type={ 5 } />
                                    </div> }
                            </div> }
                        { (picturesBought > 0) &&
                            <div>
                                <span className="fw-bold">{ LocalizeText('camera.purchase.count.info') }</span> { picturesBought }
                                <u className="ms-1">{ LocalizeText('camera.open.inventory') }</u>
                            </div> }
                    </div>
                    <div className="d-flex align-items-center">
                        <button className="btn btn-success" disabled={ isWaiting } onClick={ event => processAction('buy') }>{ LocalizeText(!picturesBought ? 'buy' : 'camera.buy.another.button.text') }</button>
                    </div>
                </div>
                <div className="d-flex justify-content-between bg-muted rounded p-2 text-black mb-2">
                    <div className="d-flex flex-column">
                        <div className="fw-bold d-flex justify-content-start">{ LocalizeText(wasPicturePublished ? 'camera.publish.successful' : 'camera.publish.explanation') }</div>
                        <div>
                            { LocalizeText(wasPicturePublished ? 'camera.publish.success.short.info' : 'camera.publish.detailed.explanation') }
                        </div>
                        { wasPicturePublished && <a href={ publishUrl } rel="noreferrer" target="_blank">{ LocalizeText('camera.link.to.published') }</a> }
                        { !wasPicturePublished && (price.publishDucketPrice > 0) &&
                            <div className="d-flex">
                                <div className="me-1">{ LocalizeText('catalog.purchase.confirmation.dialog.cost') }</div>
                                <div className="d-flex fw-bold">
                                    { price.publishDucketPrice } <CurrencyIcon type={ 5 } />
                                </div>
                            </div> }
                        { (publishCooldown > 0) && <div className="mt-1 text-center fw-bold">{ LocalizeText('camera.publish.wait', [ 'minutes' ], [ Math.ceil( publishCooldown / 60).toString() ]) }</div> }
                    </div>
                    { !wasPicturePublished &&
                        <div className="d-flex align-items-end">
                            <button className="btn btn-success" disabled={ isWaiting || publishCooldown > 0 } onClick={ event => processAction('publish') }>{ LocalizeText('camera.publish.button.text') }</button>
                        </div> }
                </div>
                <div className="text-black mb-2 text-center">{ LocalizeText('camera.warning.disclaimer') }</div>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary" onClick={ event => processAction('cancel') }>{ LocalizeText('generic.cancel') }</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
