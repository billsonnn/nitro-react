import { CameraPublishStatusMessageEvent, CameraPurchaseOKMessageEvent, CameraStorageUrlMessageEvent, PublishPhotoMessageComposer, PurchasePhotoMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetConfiguration, GetRoomEngine, LocalizeText } from '../../../../api';
import { Button } from '../../../../common/Button';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { LayoutImage } from '../../../../common/layout/LayoutImage';
import { Text } from '../../../../common/Text';
import { InventoryEvent } from '../../../../events';
import { BatchUpdates, CreateMessageHook, dispatchUiEvent, SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { CurrencyIcon } from '../../../../views/shared/currency-icon/CurrencyIcon';

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

    const onCameraPurchaseOKMessageEvent = useCallback((event: CameraPurchaseOKMessageEvent) =>
    {
        BatchUpdates(() =>
        {
            setPicturesBought(value => (value + 1));
            setIsWaiting(false);
        });
    }, []);

    CreateMessageHook(CameraPurchaseOKMessageEvent, onCameraPurchaseOKMessageEvent);

    const onCameraPublishStatusMessageEvent = useCallback((event: CameraPublishStatusMessageEvent) =>
    {
        const parser = event.getParser();

        BatchUpdates(() =>
        {
            setPublishUrl(parser.extraDataId);
            setPublishCooldown(parser.secondsToWait);
            setWasPicturePublished(parser.ok);
            setIsWaiting(false);
        });
    }, []);

    CreateMessageHook(CameraPublishStatusMessageEvent, onCameraPublishStatusMessageEvent);

    const onCameraStorageUrlMessageEvent = useCallback((event: CameraStorageUrlMessageEvent) =>
    {
        const parser = event.getParser();

        setPictureUrl(GetConfiguration<string>('camera.url') + '/' + parser.url);
    }, []);

    CreateMessageHook(CameraStorageUrlMessageEvent, onCameraStorageUrlMessageEvent);

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
    }

    useEffect(() =>
    {
        if(!base64Url) return;

        GetRoomEngine().saveBase64AsScreenshot(base64Url);
    }, [ base64Url ]);

    if(!price) return null;

    return (
        <NitroCardView className="nitro-camera-checkout" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('camera.confirm_phase.title') } onCloseClick={ event => processAction('close') } />
            <NitroCardContentView>
                <Flex center>
                    { (pictureUrl && pictureUrl.length) &&
                        <LayoutImage fit={ false } className="picture-preview border" imageUrl={ pictureUrl } /> }
                    { (!pictureUrl || !pictureUrl.length) &&
                        <Flex center className="picture-preview border">
                            <Text bold>{ LocalizeText('camera.loading') }</Text>
                        </Flex> }
                </Flex>
                <Flex justifyContent="between" alignItems="center" className="bg-muted rounded p-2">
                    <Column gap={ 1 }>
                        <Text bold>
                            { LocalizeText('camera.purchase.header') }
                        </Text>
                        { ((price.credits > 0) || (price.duckets > 0)) &&
                            <Flex gap={ 1 }>
                                <Text>{ LocalizeText('catalog.purchase.confirmation.dialog.cost') }</Text>
                                { (price.credits > 0) &&
                                    <Flex gap={ 1 }>
                                        <Text bold>{ price.credits }</Text>
                                        <CurrencyIcon type={ -1 } />
                                    </Flex> }
                                { (price.duckets > 0) &&
                                    <Flex gap={ 1 }>
                                        <Text bold>{ price.duckets }</Text>
                                        <CurrencyIcon type={ 5 } />
                                    </Flex> }
                            </Flex> }
                        { (picturesBought > 0) &&
                            <Text>
                                <Text bold>{ LocalizeText('camera.purchase.count.info') }</Text> { picturesBought }
                                <u className="ms-1 cursor-pointer" onClick={ () => dispatchUiEvent(new InventoryEvent(InventoryEvent.SHOW_INVENTORY)) }>{ LocalizeText('camera.open.inventory') }</u>
                            </Text> }
                    </Column>
                    <Flex alignItems="center">
                        <Button variant="success" disabled={ isWaiting } onClick={ event => processAction('buy') }>{ LocalizeText(!picturesBought ? 'buy' : 'camera.buy.another.button.text') }</Button>
                    </Flex>
                </Flex>
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
                                    <CurrencyIcon type={ 5 } />
                                </Flex>
                            </Flex> }
                        { (publishCooldown > 0) && <div className="mt-1 text-center fw-bold">{ LocalizeText('camera.publish.wait', [ 'minutes' ], [ Math.ceil( publishCooldown / 60).toString() ]) }</div> }
                    </Column>
                    { !wasPicturePublished &&
                        <Flex className="d-flex align-items-end">
                            <Button variant="success" size="sm" disabled={ (isWaiting || (publishCooldown > 0)) } onClick={ event => processAction('publish') }>
                                { LocalizeText('camera.publish.button.text') }
                            </Button>
                        </Flex> }
                </Flex>
                <Text center>{ LocalizeText('camera.warning.disclaimer') }</Text>
                <Flex justifyContent="end">
                    <Button onClick={ event => processAction('cancel') }>{ LocalizeText('generic.cancel') }</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
