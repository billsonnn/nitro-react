import { GetSessionDataManager, GiftReceiverNotFoundEvent, PurchaseFromCatalogAsGiftComposer } from '@nitrots/nitro-renderer';
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ColorUtils, LocalizeText, MessengerFriend, ProductTypeEnum, SendMessageComposer } from '../../../../api';
import { Button, Column, Flex, FormGroup, LayoutCurrencyIcon, LayoutFurniImageView, LayoutGiftTagView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { CatalogEvent, CatalogInitGiftEvent, CatalogPurchasedEvent } from '../../../../events';
import { useCatalog, useFriends, useMessageEvent, useUiEvent } from '../../../../hooks';
import { classNames } from '../../../../layout';

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
    const { friends } = useFriends();
    const { giftConfiguration = null } = catalogOptions;
    const [ boxTypes, setBoxTypes ] = useState<number[]>([]);
    const [ suggestions, setSuggestions ] = useState([]);
    const [ isAutocompleteVisible, setIsAutocompleteVisible ] = useState(true);

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
        setIsAutocompleteVisible(false);
        setSuggestions([]);

        if(colors.length) setSelectedColorId(colors[0].id);
    }, [ colors ]);

    const isBoxDefault = useMemo(() =>
    {
        return giftConfiguration ? (giftConfiguration.defaultStuffTypes.findIndex(s => (s === boxTypes[selectedBoxIndex])) > -1) : false;
    }, [ boxTypes, giftConfiguration, selectedBoxIndex ]);

    const boxExtraData = useMemo(() =>
    {
        if(!giftConfiguration) return '';

        return ((boxTypes[selectedBoxIndex] * 1000) + giftConfiguration.ribbonTypes[selectedRibbonIndex]).toString();
    }, [ giftConfiguration, selectedBoxIndex, selectedRibbonIndex, boxTypes ]);

    const isColorable = useMemo(() =>
    {
        if(!giftConfiguration) return false;

        if(isBoxDefault) return false;

        const boxType = boxTypes[selectedBoxIndex];

        return (boxType === 8 || (boxType >= 3 && boxType <= 6)) ? false : true;
    }, [ giftConfiguration, selectedBoxIndex, isBoxDefault, boxTypes ]);

    const colourId = useMemo(() =>
    {
        return isBoxDefault ? boxTypes[selectedBoxIndex] : selectedColorId;
    }, [ isBoxDefault, boxTypes, selectedBoxIndex, selectedColorId ]);

    const allFriends = friends.filter((friend: MessengerFriend) => friend.id !== -1);

    const onTextChanged = (e: ChangeEvent<HTMLInputElement>) =>
    {
        const value = e.target.value;

        let suggestions = [];

        if(value.length > 0)
        {
            suggestions = allFriends.sort().filter((friend: MessengerFriend) => friend.name.includes(value));
        }

        setReceiverName(value);
        setIsAutocompleteVisible(true);
        setSuggestions(suggestions);
    };

    const selectedReceiverName = (friendName: string) =>
    {
        setReceiverName(friendName);
        setIsAutocompleteVisible(false);
    };

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

                SendMessageComposer(new PurchaseFromCatalogAsGiftComposer(pageId, offerId, extraData, receiverName, message, colourId, selectedBoxIndex, selectedRibbonIndex, showMyFace));
                return;
        }
    }, [ colourId, extraData, maxBoxIndex, maxRibbonIndex, message, offerId, pageId, receiverName, selectedBoxIndex, selectedRibbonIndex, showMyFace ]);

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

    const createBoxTypes = useCallback(() =>
    {
        if(!giftConfiguration) return;

        setBoxTypes(prev =>
        {
            let newPrev = [ ...giftConfiguration.boxTypes ];

            newPrev.push(giftConfiguration.defaultStuffTypes[Math.floor((Math.random() * (giftConfiguration.defaultStuffTypes.length - 1)))]);

            setMaxBoxIndex(newPrev.length - 1);
            setMaxRibbonIndex(newPrev.length - 1);

            return newPrev;
        });
    }, [ giftConfiguration ]);

    useEffect(() =>
    {
        if(!giftConfiguration) return;

        const newColors: { id: number, color: string }[] = [];

        for(const colorId of giftConfiguration.stuffTypes)
        {
            const giftData = GetSessionDataManager().getFloorItemData(colorId);

            if(!giftData) continue;

            if(giftData.colors && giftData.colors.length > 0) newColors.push({ id: colorId, color: ColorUtils.makeColorNumberHex(giftData.colors[0]) });
        }

        createBoxTypes();

        if(newColors.length)
        {
            setSelectedColorId(newColors[0].id);
            setColors(newColors);
        }
    }, [ giftConfiguration, createBoxTypes ]);

    useEffect(() =>
    {
        if(!isVisible) return;

        createBoxTypes();
    }, [ createBoxTypes, isVisible ]);

    if(!giftConfiguration || !giftConfiguration.isEnabled || !isVisible) return null;

    const boxName = 'catalog.gift_wrapping_new.box.' + (isBoxDefault ? 'default' : boxTypes[selectedBoxIndex]);
    const ribbonName = `catalog.gift_wrapping_new.ribbon.${ selectedRibbonIndex }`;
    const priceText = 'catalog.gift_wrapping_new.' + (isBoxDefault ? 'freeprice' : 'price');

    return (
        <NitroCardView className="nitro-catalog-gift" theme="primary-slim" uniqueKey="catalog-gift">
            <NitroCardHeaderView headerText={ LocalizeText('catalog.gift_wrapping.title') } onCloseClick={ onClose } />
            <NitroCardContentView className="text-black">
                <FormGroup column>
                    <Text>{ LocalizeText('catalog.gift_wrapping.receiver') }</Text>
                    <input className={ classNames('form-control form-control-sm', receiverNotFound && 'is-invalid') } type="text" value={ receiverName } onChange={ (e) => onTextChanged(e) } />
                    { (suggestions.length > 0 && isAutocompleteVisible) &&
                        <Column className="autocomplete-gift-container">
                            { suggestions.map((friend: MessengerFriend) => (
                                <div key={ friend.id } className="autocomplete-gift-item" onClick={ (e) => selectedReceiverName(friend.name) }>{ friend.name }</div>
                            )) }
                        </Column>
                    }
                    { receiverNotFound &&
                        <div className="invalid-feedback">{ LocalizeText('catalog.gift_wrapping.receiver_not_found.title') }</div> }
                </FormGroup>
                <LayoutGiftTagView editable={ true } figure={ GetSessionDataManager().figure } message={ message } userName={ GetSessionDataManager().userName } onChange={ (value) => setMessage(value) } />
                <div className="form-check">
                    <input checked={ showMyFace } className="form-check-input" name="showMyFace" type="checkbox" onChange={ (e) => setShowMyFace(value => !value) } />
                    <label className="form-check-label">{ LocalizeText('catalog.gift_wrapping.show_face.title') }</label>
                </div>
                <div className="items-center gap-2">
                    { selectedColorId &&
                        <div className="gift-preview">
                            <LayoutFurniImageView extraData={ boxExtraData } productClassId={ colourId } productType={ ProductTypeEnum.FLOOR } />
                        </div> }
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                            <div className="relative inline-flex align-middle">
                                <Button variant="primary" onClick={ () => handleAction('prev_box') }>
                                    <FaChevronLeft className="fa-icon" />
                                </Button>
                                <Button variant="primary" onClick={ () => handleAction('next_box') }>
                                    <FaChevronRight className="fa-icon" />
                                </Button>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Text fontWeight="bold">{ LocalizeText(boxName) }</Text>
                                <div className="flex items-center gap-1">
                                    { LocalizeText(priceText, [ 'price' ], [ giftConfiguration.price.toString() ]) }
                                    <LayoutCurrencyIcon type={ -1 } />
                                </div>
                            </div>
                        </div>
                        <Flex alignItems="center" className={ isColorable ? '' : 'opacity-50 pointer-events-none' } gap={ 2 }>
                            <div className="relative inline-flex align-middle">
                                <Button variant="primary" onClick={ () => handleAction('prev_ribbon') }>
                                    <FaChevronLeft className="fa-icon" />
                                </Button>
                                <Button variant="primary" onClick={ () => handleAction('next_ribbon') }>
                                    <FaChevronRight className="fa-icon" />
                                </Button>
                            </div>
                            <Text fontWeight="bold">{ LocalizeText(ribbonName) }</Text>
                        </Flex>
                    </div>
                </div>
                <Column className={ isColorable ? '' : 'opacity-50 pointer-events-none' } gap={ 1 }>
                    <Text fontWeight="bold">
                        { LocalizeText('catalog.gift_wrapping.pick_color') }
                    </Text>
                    <div className="relative inline-flex align-middle w-full">
                        { colors.map(color => <Button key={ color.id } active={ (color.id === selectedColorId) } disabled={ !isColorable } style={ { backgroundColor: color.color } } variant="dark" onClick={ () => setSelectedColorId(color.id) } />) }
                    </div>
                </Column>
                <div className="flex items-center justify-between">
                    <Button className="text-black" variant="link" onClick={ onClose }>
                        { LocalizeText('cancel') }
                    </Button>
                    <Button variant="success" onClick={ () => handleAction('buy') }>
                        { LocalizeText('catalog.gift_wrapping.give_gift') }
                    </Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
