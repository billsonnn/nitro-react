import { PurchaseFromCatalogAsGiftComposer } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../api';
import { CatalogEvent } from '../../../../events';
import { CatalogInitGiftEvent } from '../../../../events/catalog/CatalogInitGiftEvent';
import { SendMessageHook, useUiEvent } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroLayoutGiftCardView } from '../../../../layout';
import { CurrencyIcon } from '../../../shared/currency-icon/CurrencyIcon';
import { FurniImageView } from '../../../shared/furni-image/FurniImageView';
import { useCatalogContext } from '../../context/CatalogContext';

export const CatalogGiftView: FC<{}> = props =>
{
    const { catalogState = null } = useCatalogContext();
    const { giftConfiguration = null } = catalogState;

    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const [ pageId, setPageId ] = useState<number>(0);
    const [ offerId, setOfferId ] = useState<number>(0);

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

    useEffect(() =>
    {
        setReceiverNotFound(false);
    }, [ receiverName ]);

    useEffect(() =>
    {
        if(!giftConfiguration) return;

        setMaxBoxIndex(giftConfiguration.boxTypes.length - 1);
        setMaxRibbonIndex(giftConfiguration.ribbonTypes.length - 1);

        const newColors: { id: number, color: string }[] = [];

        for(const colorId of giftConfiguration.stuffTypes)
        {
            const giftData = GetSessionDataManager().getFloorItemData(colorId);

            if(!giftData) continue;

            if(giftData.colors && giftData.colors.length > 0) newColors.push({ id: colorId, color: `#${giftData.colors[0].toString(16)}` });
        }

        setSelectedColorId(newColors[0].id);
        setColors(newColors);
    }, [ giftConfiguration ]);

    const close = useCallback(() =>
    {
        setIsVisible(false);
        setPageId(0);
        setOfferId(0);
        setReceiverName('');
        setShowMyFace(true);
        setMessage('');
        setSelectedBoxIndex(0);
        setSelectedRibbonIndex(0);
        setSelectedColorId(colors[0].id);
    }, [ colors ]);

    const onCatalogEvent = useCallback((event: CatalogEvent) =>
    {
        switch(event.type)
        {
            case CatalogEvent.PURCHASE_SUCCESS:
                close();
                return;
            case CatalogEvent.INIT_GIFT:
                const castedEvent = (event as CatalogInitGiftEvent);
                close();

                setPageId(castedEvent.pageId);
                setOfferId(castedEvent.offerId);
                setIsVisible(true);
                return;
            case CatalogEvent.GIFT_RECEIVER_NOT_FOUND:
                setReceiverNotFound(true);
                return;
        }
    }, [ close ]);

    useUiEvent(CatalogEvent.PURCHASE_SUCCESS, onCatalogEvent);
    useUiEvent(CatalogEvent.INIT_GIFT, onCatalogEvent);
    useUiEvent(CatalogEvent.GIFT_RECEIVER_NOT_FOUND, onCatalogEvent);

    const isBoxDefault = useMemo(() =>
    {
        return giftConfiguration ? giftConfiguration.defaultStuffTypes.findIndex(s => s === giftConfiguration.boxTypes[selectedBoxIndex]) > -1 : true;
    }, [ giftConfiguration, selectedBoxIndex ]);

    const boxName = useMemo(() =>
    {
        return isBoxDefault ? 'catalog.gift_wrapping_new.box.default' : `catalog.gift_wrapping_new.box.${selectedBoxIndex}`;
    }, [ isBoxDefault, selectedBoxIndex ]);

    const ribbonName = useMemo(() =>
    {
        return `catalog.gift_wrapping_new.ribbon.${selectedRibbonIndex}`;
    }, [ selectedRibbonIndex ]);

    const priceText = useMemo(() =>
    {
        return isBoxDefault ? 'catalog.gift_wrapping_new.freeprice' : 'catalog.gift_wrapping_new.price';
    }, [ isBoxDefault ]);

    const extraData = useMemo(() =>
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
                setSelectedBoxIndex(value =>
                    {
                        return (value === 0 ? maxBoxIndex : value - 1);
                    });
                return;
            case 'next_box':
                setSelectedBoxIndex(value =>
                    {
                        return (value === maxBoxIndex ? 0 : value + 1);
                    });
                return;
            case 'prev_ribbon':
                setSelectedRibbonIndex(value =>
                    {
                        return (value === 0 ? maxRibbonIndex : value - 1);
                    });
                return;
            case 'next_ribbon':
                setSelectedRibbonIndex(value =>
                    {
                        return (value === maxRibbonIndex ? 0 : value + 1);
                    });
                return;
            case 'buy':
                if(!receiverName || receiverName.length === 0)
                {
                    setReceiverNotFound(true);
                    return;
                }
                
                SendMessageHook(new PurchaseFromCatalogAsGiftComposer(pageId, offerId, extraData, receiverName, message, selectedColorId, selectedBoxIndex, selectedRibbonIndex, showMyFace));
                return;
        }
    }, [ extraData, maxBoxIndex, maxRibbonIndex, message, offerId, pageId, receiverName, selectedBoxIndex, selectedColorId, selectedRibbonIndex, showMyFace ]);

    if(!giftConfiguration || !giftConfiguration.isEnabled || !isVisible) return null;

    return (
        <NitroCardView uniqueKey="catalog-gift" className="nitro-catalog-gift" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('catalog.gift_wrapping.title') } onCloseClick={ close } />
            <NitroCardContentView className="text-black">
                <div className="form-group">
                    <label>{ LocalizeText('catalog.gift_wrapping.receiver') }</label>
                    <input type="text" className={ 'form-control form-control-sm' + classNames({ ' is-invalid': receiverNotFound }) } value={ receiverName } onChange={ (e) => setReceiverName(e.target.value) } />
                    { receiverNotFound && <div className="invalid-feedback">{ LocalizeText('catalog.gift_wrapping.receiver_not_found.title') }</div> }
                </div>
                <div className="mt-2">
                    <NitroLayoutGiftCardView figure={ GetSessionDataManager().figure } userName={ GetSessionDataManager().userName } message={ message } editable={ true } onChange={ (value) => setMessage(value) } />
                </div>
                <div className="form-check mt-1">
                    <input className="form-check-input" type="checkbox" name="showMyFace" checked={ showMyFace } onChange={ (e) => setShowMyFace(value => !value) } />
                    <label className="form-check-label">{ LocalizeText('catalog.gift_wrapping.show_face.title') }</label>
                </div>
                <div className="d-flex gap-2 mt-1 align-items-center">
                    <div className="gift-preview">
                        { selectedColorId && <FurniImageView spriteId={ selectedColorId } type="s" extras={ extraData } /> }
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex gap-2">
                            <div className="btn-group">
                                <button className="btn btn-primary" onClick={ () => handleAction('prev_box') }><i className="fas fa-chevron-left" /></button>
                                <button className="btn btn-primary" onClick={ () => handleAction('next_box') }><i className="fas fa-chevron-right" /></button>
                            </div>
                            <div>
                                <div className="fw-bold">{ LocalizeText(boxName) }</div>
                                <div className="d-flex align-items-center gap-1">{ LocalizeText(priceText, ['price'], [giftConfiguration.price.toString()]) }<CurrencyIcon type={ -1 } /></div>
                            </div>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                            <div className="btn-group">
                                <button className="btn btn-primary" onClick={ () => handleAction('prev_ribbon') }><i className="fas fa-chevron-left" /></button>
                                <button className="btn btn-primary" onClick={ () => handleAction('next_ribbon') }><i className="fas fa-chevron-right" /></button>
                            </div>
                            <div>
                                <div className="fw-bold">{ LocalizeText(ribbonName) }</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-1">
                    <div className="fw-bold">{ LocalizeText('catalog.gift_wrapping.pick_color') }</div>
                    <div className="btn-group w-100">
                        { colors.map(color =>
                            {
                                return <button key={ color.id } className={ 'btn btn-dark btn-sm' + classNames({ ' active': color.id === selectedColorId }) } disabled={ !isColorable } style={{ backgroundColor: color.color }} onClick={ () => setSelectedColorId(color.id) }></button>
                            }) }
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="text-decoration-underline cursor-pointer" onClick={ close }>{ LocalizeText('cancel') }</div>
                    <button className="btn btn-success" onClick={ () => handleAction('buy') }>{ LocalizeText('catalog.gift_wrapping.give_gift') }</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
