import { CameraPublishStatusMessageEvent, CameraPurchaseOKMessageEvent, CameraStorageUrlMessageEvent, CreateLinkEvent, GetRoomEngine, PublishPhotoMessageComposer, PurchasePhotoMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { GetConfigurationValue, LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Column, LayoutCurrencyIcon, LayoutImage, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
import { useMessageEvent } from '../../../hooks';

export interface CameraWidgetCheckoutViewProps
{
    base64Url: string;
    onCloseClick: () => void;
    onCancelClick: () => void;
    price: { credits: number, duckets: number, publishDucketPrice: number };
}

export const CameraWidgetCheckoutView: FC<CameraWidgetCheckoutViewProps> = props =>
{
    const { base64Url = null, onCloseClick = null, onCancelClick = null, price = null } = props;
    const [ pictureUrl, setPictureUrl ] = useState<string>(null);
    const [ publishUrl, setPublishUrl ] = useState<string>(null);
    const [ picturesBought, setPicturesBought ] = useState(0);
    const [ wasPicturePublished, setWasPicturePublished ] = useState(false);
    const [ isWaiting, setIsWaiting ] = useState(false);
    const [ publishCooldown, setPublishCooldown ] = useState(0);

    const publishDisabled = useMemo(() => GetConfigurationValue<boolean>('camera.publish.disabled', false), []);

    useMessageEvent<CameraPurchaseOKMessageEvent>(CameraPurchaseOKMessageEvent, event =>
    {
        setPicturesBought(value => (value + 1));
        setIsWaiting(false);
    });

    useMessageEvent<CameraPublishStatusMessageEvent>(CameraPublishStatusMessageEvent, event =>
    {
        const parser = event.getParser();

        setPublishUrl(parser.extraDataId);
        setPublishCooldown(parser.secondsToWait);
        setWasPicturePublished(parser.ok);
        setIsWaiting(false);
    });

    useMessageEvent<CameraStorageUrlMessageEvent>(CameraStorageUrlMessageEvent, event =>
    {
        const parser = event.getParser();

        setPictureUrl(GetConfigurationValue<string>('camera.url') + '/' + parser.url);
    });

    const processAction = (type: string, value: string | number = null) =>
    {
        switch(type)
        {
            case 'close':
                onCloseClick();
                return;
            case 'buy':
                if(isWaiting) return;

                setIsWaiting(true);
                SendMessageComposer(new PurchasePhotoMessageComposer(''));
                return;
            case 'publish':
                if(isWaiting) return;

                setIsWaiting(true);
                SendMessageComposer(new PublishPhotoMessageComposer());
                return;
            case 'cancel':
                onCancelClick();
                return;
        }
    };

    useEffect(() =>
    {
        if(!base64Url) return;

        GetRoomEngine().saveBase64AsScreenshot(base64Url);
    }, [ base64Url ]);

    if(!price) return null;

    return (
        <NitroCardView className="nitro-camera-checkout" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('camera.confirm_phase.title') } onCloseClick={ event => processAction('close') } />
            <NitroCardContentView>
                <div className="flex items-center justify-center">
                    { (pictureUrl && pictureUrl.length) &&
                        <LayoutImage className="picture-preview border" imageUrl={ pictureUrl } /> }
                    { (!pictureUrl || !pictureUrl.length) &&
                        <div className="flex items-center justify-center picture-preview border">
                            <Text bold>{ LocalizeText('camera.loading') }</Text>
                        </div> }
                </div>
                <div className="flex items-center bg-muted rounded p-2 justify-between">
                    <Column gap={ 1 } size={ publishDisabled ? 10 : 6 }>
                        <Text bold>
                            { LocalizeText('camera.purchase.header') }
                        </Text>
                        { ((price.credits > 0) || (price.duckets > 0)) &&
                            <div className="flex gap-1">
                                <Text>{ LocalizeText('catalog.purchase.confirmation.dialog.cost') }</Text>
                                { (price.credits > 0) &&
                                    <div className="flex gap-1">
                                        <Text bold>{ price.credits }</Text>
                                        <LayoutCurrencyIcon type={ -1 } />
                                    </div> }
                                { (price.duckets > 0) &&
                                    <div className="flex gap-1">
                                        <Text bold>{ price.duckets }</Text>
                                        <LayoutCurrencyIcon type={ 5 } />
                                    </div> }
                            </div> }
                        { (picturesBought > 0) &&
                            <Text>
                                <Text bold>{ LocalizeText('camera.purchase.count.info') }</Text> { picturesBought }
                                <u className="ms-1 cursor-pointer" onClick={ () => CreateLinkEvent('inventory/toggle') }>{ LocalizeText('camera.open.inventory') }</u>
                            </Text> }
                    </Column>
                    <div className="flex items-center">
                        <Button disabled={ isWaiting } variant="success" onClick={ event => processAction('buy') }>{ LocalizeText(!picturesBought ? 'buy' : 'camera.buy.another.button.text') }</Button>
                    </div>
                </div>
                { !publishDisabled &&
                    <div className="flex items-center justify-between bg-muted rounded p-2">
                        <div className="flex flex-col gap-1">
                            <Text bold>
                                { LocalizeText(wasPicturePublished ? 'camera.publish.successful' : 'camera.publish.explanation') }
                            </Text>
                            <Text>
                                { LocalizeText(wasPicturePublished ? 'camera.publish.success.short.info' : 'camera.publish.detailed.explanation') }
                            </Text>
                            { wasPicturePublished && <a href={ publishUrl } rel="noreferrer" target="_blank">{ LocalizeText('camera.link.to.published') }</a> }
                            { !wasPicturePublished && (price.publishDucketPrice > 0) &&
                                <div className="flex gap-1">
                                    <Text>{ LocalizeText('catalog.purchase.confirmation.dialog.cost') }</Text>
                                    <div className="flex gap-1">
                                        <Text bold>{ price.publishDucketPrice }</Text>
                                        <LayoutCurrencyIcon type={ 5 } />
                                    </div>
                                </div> }
                            { (publishCooldown > 0) && <div className="mt-1 text-center font-bold	">{ LocalizeText('camera.publish.wait', [ 'minutes' ], [ Math.ceil(publishCooldown / 60).toString() ]) }</div> }
                        </div>
                        { !wasPicturePublished &&
                            <div className="flex align-items-end">
                                <Button disabled={ (isWaiting || (publishCooldown > 0)) } variant="success" onClick={ event => processAction('publish') }>
                                    { LocalizeText('camera.publish.button.text') }
                                </Button>
                            </div> }
                    </div> }
                <Text center>{ LocalizeText('camera.warning.disclaimer') }</Text>
                <div className="flex justify-end">
                    <Button onClick={ event => processAction('cancel') }>{ LocalizeText('generic.cancel') }</Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
