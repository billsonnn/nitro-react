import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GiftReceiverNotFoundEvent, PurchaseFromCatalogAsGiftComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { GetSessionDataManager, LocalizeText, ProductTypeEnum, SendMessageComposer } from '../../../../api';
import { Base, Button, ButtonGroup, classNames, Column, Flex, FormGroup, LayoutCurrencyIcon, LayoutFurniImageView, LayoutGiftTagView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { CatalogEvent, CatalogInitGiftEvent, CatalogPurchasedEvent } from '../../../../events';
import { useCatalog, useMessageEvent, useUiEvent } from '../../../../hooks';

export const CatalogGiftView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const [ pageId, setPageId ] = useState<number>(0);
    const [ offerId, setOfferId ] = useState<number>(0);
    const [ extraData, setExtraData ] = useState<string>('');
    const [ receiverName, setReceiverName ] = useState<string>('');
    const [ showMyFace, setShowMyFace ] = useState<boolean>(true);
    const [ message, setMessage ] = useState<string>('');
    const [ colors, setColors ] = useState<{ id: number, color: string }[]>([]);
    const [ selectedBoxIndex, setSelectedBoxIndex ] = useState<number>(0);
    const [ selectedRibbonIndex, setSelectedRibbonIndex ] = useState<number>(0);
    const [ selectedColorId, setSelectedColorId ] = useState<number>(0);
    const [ maxBoxIndex, setMaxBoxIndex ] = useState<number>(0);
    const [ maxRibbonIndex, setMaxRibbonIndex ] = useState<number>(0);
    const [ receiverNotFound, setReceiverNotFound ] = useState<boolean>(false);
    const { catalogOptions = null } = useCatalog();
    const { giftConfiguration = null } = catalogOptions;

    const onClose = useCallback(() =>
    {
        setIsVisible(false);
        setPageId(0);
        setOfferId(0);
        setExtraData('');
        setReceiverName('');
        setShowMyFace(true);
        setMessage('');
        setSelectedBoxIndex(0);
        setSelectedRibbonIndex(0);
        
        if(colors.length) setSelectedColorId(colors[0].id);
    }, [ colors ]);

    const isBoxDefault = useMemo(() =>
    {
        return giftConfiguration ? (giftConfiguration.defaultStuffTypes.findIndex(s => (s === giftConfiguration.boxTypes[selectedBoxIndex])) > -1) : true;
    }, [ giftConfiguration, selectedBoxIndex ]);

    const boxExtraData = useMemo(() =>
    {
        if(!giftConfiguration) return '';

        return ((giftConfiguration.boxTypes[selectedBoxIndex] * 1000) + giftConfiguration.ribbonTypes[selectedRibbonIndex]).toString();
    }, [ giftConfiguration, selectedBoxIndex, selectedRibbonIndex ]);

    const isColorable = useMemo(() =>
    {
        if(!giftConfiguration) return false;
        
        const boxType = giftConfiguration.boxTypes[selectedBoxIndex];

        return (boxType === 8 || (boxType >= 3 && boxType <= 6)) ? false : true;
    }, [ giftConfiguration, selectedBoxIndex ]);

    const handleAction = useCallback((action: string) =>
    {
        switch(action)
        {
            case 'prev_box':
                setSelectedBoxIndex(value => (value === 0 ? maxBoxIndex : value - 1));
                return;
            case 'next_box':
                setSelectedBoxIndex(value => (value === maxBoxIndex ? 0 : value + 1));
                return;
            case 'prev_ribbon':
                setSelectedRibbonIndex(value => (value === 0 ? maxRibbonIndex : value - 1));
                return;
            case 'next_ribbon':
                setSelectedRibbonIndex(value => (value === maxRibbonIndex ? 0 : value + 1));
                return;
            case 'buy':
                if(!receiverName || (receiverName.length === 0))
                {
                    setReceiverNotFound(true);
                    return;
                }
                
                SendMessageComposer(new PurchaseFromCatalogAsGiftComposer(pageId, offerId, extraData, receiverName, message, selectedColorId, selectedBoxIndex, selectedRibbonIndex, showMyFace));
                return;
        }
    }, [ extraData, maxBoxIndex, maxRibbonIndex, message, offerId, pageId, receiverName, selectedBoxIndex, selectedColorId, selectedRibbonIndex, showMyFace ]);

    useMessageEvent<GiftReceiverNotFoundEvent>(GiftReceiverNotFoundEvent, event => setReceiverNotFound(true));

    useUiEvent([
        CatalogPurchasedEvent.PURCHASE_SUCCESS,
        CatalogEvent.INIT_GIFT ], event =>
    {
        switch(event.type)
        {
            case CatalogPurchasedEvent.PURCHASE_SUCCESS:
                onClose();
                return;
            case CatalogEvent.INIT_GIFT:
                const castedEvent = (event as CatalogInitGiftEvent);

                onClose();
                    
                setPageId(castedEvent.pageId);
                setOfferId(castedEvent.offerId);
                setExtraData(castedEvent.extraData);
                setIsVisible(true);
                return;
        }
    });

    useEffect(() =>
    {
        setReceiverNotFound(false);
    }, [ receiverName ]);

    useEffect(() =>
    {
        if(!giftConfiguration) return;

        const newColors: { id: number, color: string }[] = [];

        for(const colorId of giftConfiguration.stuffTypes)
        {
            const giftData = GetSessionDataManager().getFloorItemData(colorId);

            if(!giftData) continue;

            if(giftData.colors && giftData.colors.length > 0) newColors.push({ id: colorId, color: `#${ giftData.colors[0].toString(16) }` });
        }

        setMaxBoxIndex(giftConfiguration.boxTypes.length - 1);
        setMaxRibbonIndex(giftConfiguration.ribbonTypes.length - 1);

        if(newColors.length)
        {
            setSelectedColorId(newColors[0].id);
            setColors(newColors);
        }
    }, [ giftConfiguration ]);

    if(!giftConfiguration || !giftConfiguration.isEnabled || !isVisible) return null;

    const boxName = 'catalog.gift_wrapping_new.box.' + (isBoxDefault ? 'default' : selectedBoxIndex);
    const ribbonName = `catalog.gift_wrapping_new.ribbon.${ selectedRibbonIndex }`;
    const priceText = 'catalog.gift_wrapping_new.' + (isBoxDefault ? 'freeprice' : 'price');

    return (
        <NitroCardView uniqueKey="catalog-gift" className="nitro-catalog-gift" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('catalog.gift_wrapping.title') } onCloseClick={ onClose } />
            <NitroCardContentView className="text-black">
                <FormGroup column>
                    <Text>{ LocalizeText('catalog.gift_wrapping.receiver') }</Text>
                    <input type="text" className={ classNames('form-control form-control-sm', receiverNotFound && 'is-invalid') } value={ receiverName } onChange={ (e) => setReceiverName(e.target.value) } />
                    { receiverNotFound &&
                        <Base className="invalid-feedback">{ LocalizeText('catalog.gift_wrapping.receiver_not_found.title') }</Base> }
                </FormGroup>
                <LayoutGiftTagView figure={ GetSessionDataManager().figure } userName={ GetSessionDataManager().userName } message={ message } editable={ true } onChange={ (value) => setMessage(value) } />
                <Base className="form-check">
                    <input className="form-check-input" type="checkbox" name="showMyFace" checked={ showMyFace } onChange={ (e) => setShowMyFace(value => !value) } />
                    <label className="form-check-label">{ LocalizeText('catalog.gift_wrapping.show_face.title') }</label>
                </Base>
                <Flex alignItems="center" gap={ 2 }>
                    { selectedColorId &&
                        <Base className="gift-preview">
                            <LayoutFurniImageView productType={ ProductTypeEnum.FLOOR } productClassId={ selectedColorId } extraData={ boxExtraData } />
                        </Base> }
                    <Column gap={ 1 }>
                        <Flex gap={ 2 }>
                            <ButtonGroup>
                                <Button variant="primary" onClick={ () => handleAction('prev_box') }>
                                    <FontAwesomeIcon icon="chevron-left" />
                                </Button>
                                <Button variant="primary" onClick={ () => handleAction('next_box') }>
                                    <FontAwesomeIcon icon="chevron-right" />
                                </Button>
                            </ButtonGroup>
                            <Column gap={ 1 }>
                                <Text fontWeight="bold">{ LocalizeText(boxName) }</Text>
                                <Flex alignItems="center" gap={ 1 }>
                                    { LocalizeText(priceText, [ 'price' ], [ giftConfiguration.price.toString() ]) }
                                    <LayoutCurrencyIcon type={ -1 } />
                                </Flex>
                            </Column>
                        </Flex>
                        <Flex alignItems="center" gap={ 2 }>
                            <ButtonGroup>
                                <Button variant="primary" onClick={ () => handleAction('prev_ribbon') }>
                                    <FontAwesomeIcon icon="chevron-left" />
                                </Button>
                                <Button variant="primary" onClick={ () => handleAction('next_ribbon') }>
                                    <FontAwesomeIcon icon="chevron-right" />
                                </Button>
                            </ButtonGroup>
                            <Text fontWeight="bold">{ LocalizeText(ribbonName) }</Text>
                        </Flex>
                    </Column>
                </Flex>
                <Column gap={ 1 }>
                    <Text fontWeight="bold">
                        { LocalizeText('catalog.gift_wrapping.pick_color') }
                    </Text>
                    <ButtonGroup fullWidth>
                        { colors.map(color => <Button key={ color.id } variant="dark" active={ (color.id === selectedColorId) } disabled={ !isColorable } style={ { backgroundColor: color.color } } onClick={ () => setSelectedColorId(color.id) } />) }
                    </ButtonGroup>
                </Column>
                <Flex justifyContent="between" alignItems="center">
                    <Button variant="link" onClick={ onClose } className="text-black">
                        { LocalizeText('cancel') }
                    </Button>
                    <Button variant="success" onClick={ () => handleAction('buy') }>
                        { LocalizeText('catalog.gift_wrapping.give_gift') }
                    </Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
