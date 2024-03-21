import { CameraPublishStatusMessageEvent, CameraPurchaseOKMessageEvent, CameraStorageUrlMessageEvent, CreateLinkEvent, GetRoomEngine, PublishPhotoMessageComposer, PurchasePhotoMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { GetConfigurationValue, LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Column, Flex, LayoutCurrencyIcon, LayoutImage, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
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
    }

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
                <Flex center>
                    { (pictureUrl && pictureUrl.length) &&
                        <LayoutImage className="picture-preview border" imageUrl={ pictureUrl } /> }
                    { (!pictureUrl || !pictureUrl.length) &&
                        <Flex center className="picture-preview border">
                            <Text bold>{ LocalizeText('camera.loading') }</Text>
                        </Flex> }
                </Flex>
                <Flex justifyContent="between" alignItems="center" className="bg-muted rounded p-2">
                    <Column size={ publishDisabled ? 10 : 6 } gap={ 1 }>
                        <Text bold>
                            { LocalizeText('camera.purchase.header') }
                        </Text>
                        { ((price.credits > 0) || (price.duckets > 0)) &&
                            <Flex gap={ 1 }>
                                <Text>{ LocalizeText('catalog.purchase.confirmation.dialog.cost') }</Text>
                                { (price.credits > 0) &&
                                    <Flex gap={ 1 }>
                                        <Text bold>{ price.credits }</Text>
                                        <LayoutCurrencyIcon type={ -1 } />
                                    </Flex> }
                                { (price.duckets > 0) &&
                                    <Flex gap={ 1 }>
                                        <Text bold>{ price.duckets }</Text>
                                        <LayoutCurrencyIcon type={ 5 } />
                                    </Flex> }
                            </Flex> }
                        { (picturesBought > 0) &&
                            <Text>
                                <Text bold>{ LocalizeText('camera.purchase.count.info') }</Text> { picturesBought }
                                <u className="ms-1 cursor-pointer" onClick={ () => CreateLinkEvent('inventory/toggle') }>{ LocalizeText('camera.open.inventory') }</u>
                            </Text> }
                    </Column>
                    <Flex alignItems="center">
                        <Button variant="success" disabled={ isWaiting } onClick={ event => processAction('buy') }>{ LocalizeText(!picturesBought ? 'buy' : 'camera.buy.another.button.text') }</Button>
                    </Flex>
                </Flex>
                { !publishDisabled &&
                <Flex justifyContent="between" alignItems="center" className="bg-muted rounded p-2">
                    <Column gap={ 1 }>
                        <Text bold>
                            { LocalizeText(wasPicturePublished ? 'camera.publish.successful' : 'camera.publish.explanation') }
                        </Text>
                        <Text>
                            { LocalizeText(wasPicturePublished ? 'camera.publish.success.short.info' : 'camera.publish.detailed.explanation') }
                        </Text>
                        { wasPicturePublished && <a href={ publishUrl } rel="noreferrer" target="_blank">{ LocalizeText('camera.link.to.published') }</a> }
                        { !wasPicturePublished && (price.publishDucketPrice > 0) &&
                            <Flex gap={ 1 }>
                                <Text>{ LocalizeText('catalog.purchase.confirmation.dialog.cost') }</Text>
                                <Flex gap={ 1 }>
                                    <Text bold>{ price.publishDucketPrice }</Text>
                                    <LayoutCurrencyIcon type={ 5 } />
                                </Flex>
                            </Flex> }
                        { (publishCooldown > 0) && <div className="mt-1 text-center fw-bold">{ LocalizeText('camera.publish.wait', [ 'minutes' ], [ Math.ceil( publishCooldown / 60).toString() ]) }</div> }
                    </Column>
                    { !wasPicturePublished &&
                        <Flex className="d-flex align-items-end">
                            <Button variant="success" disabled={ (isWaiting || (publishCooldown > 0)) } onClick={ event => processAction('publish') }>
                                { LocalizeText('camera.publish.button.text') }
                            </Button>
                        </Flex> }
                </Flex> }
                <Text center>{ LocalizeText('camera.warning.disclaimer') }</Text>
                <Flex justifyContent="end">
                    <Button onClick={ event => processAction('cancel') }>{ LocalizeText('generic.cancel') }</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
