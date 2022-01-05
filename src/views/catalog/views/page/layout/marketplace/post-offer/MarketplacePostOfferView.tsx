import { ImageResult, MakeOfferMessageComposer, Vector3d } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../../../../api';
import { CatalogPostMarketplaceOfferEvent } from '../../../../../../../events/catalog/CatalogPostMarketplaceOfferEvent';
import { SendMessageHook, useUiEvent } from '../../../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroLayoutFlex } from '../../../../../../../layout';
import { FurnitureItem } from '../../../../../../inventory/common/FurnitureItem';
import { NotificationUtilities } from '../../../../../../notification-center/common/NotificationUtilities';
import { useCatalogContext } from '../../../../../context/CatalogContext';

export const MarketplacePostOfferView : FC<{}> = props =>
{
    const [ item, setItem ] = useState<FurnitureItem>(null);
    const [ askingPrice, setAskingPrice ] = useState(0);
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    
    const close = useCallback(() =>
    {
        setItem(null);
        setAskingPrice(0);
    }, []);

    const onCatalogPostMarketplaceOfferEvent = useCallback( (event: CatalogPostMarketplaceOfferEvent) =>
    {
        setItem(event.item);
    }, []);

    useUiEvent(CatalogPostMarketplaceOfferEvent.POST_MARKETPLACE, onCatalogPostMarketplaceOfferEvent);

    const getItemImage = useCallback( () =>
    {
        if(!item) return '';
        
        let object: ImageResult;
        
        if(!item.isWallItem)
        {
            object = GetRoomEngine().getFurnitureFloorImage(item.type, new Vector3d(90,0,0), 64, this, 4293848814, item.extra.toString());
        }
        else
        {
            object = GetRoomEngine().getFurnitureWallImage(item.type, new Vector3d(90,0,0), 64, this, 4293848814, item.extra.toString());
        }

        if(object)
        {
            const image = object.getImage();

            if(image) return image.src;
        }
        return '';
    }, [item]);

    const getFurniTitle = useCallback( () =>
    {
        if(!item) return '';

        const localizationKey = item.isWallItem ? 'wallItem.name.' + item.type : 'roomItem.name.' + item.type;

        return LocalizeText(localizationKey);
    }, [item]);

    const getFurniDescription = useCallback( () =>
    {
        if(!item) return '';

        const localizationKey = item.isWallItem ? 'wallItem.desc.' + item.type : 'roomItem.desc.' + item.type;

        return LocalizeText(localizationKey);
    }, [item]);

    const postItem = useCallback( () =>
    {
        if(isNaN(askingPrice) || askingPrice <= 0 || !item) return;

        NotificationUtilities.confirm(LocalizeText('inventory.marketplace.confirm_offer.info', ['furniname', 'price'], [getFurniTitle(), askingPrice.toString()]), () =>
            {
                SendMessageHook(new MakeOfferMessageComposer(askingPrice, item.isWallItem ? 2 : 1, item.id));
                setItem(null);
            },
            () => { setItem(null)}, null, null, LocalizeText('inventory.marketplace.confirm_offer.title'));
    }, [askingPrice, getFurniTitle, item]);

    return ( item && 
        <NitroCardView uniqueKey="catalog-mp-post-offer" className="nitro-marketplace-post-offer" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('inventory.marketplace.make_offer.title') } onCloseClick={ close } />
            <NitroCardContentView className="text-black">
                <NitroLayoutFlex>
                    <div className="item-image-container mx-3" style={{ backgroundImage: `url(${getItemImage()})` }} />
                    <div className='h-100 flex-grow-1 justify-content-center '>
                        <div className='fw-bold'>{getFurniTitle()}</div>
                        <div className='fs-6'>{getFurniDescription()}</div>
                    </div>
                </NitroLayoutFlex>
                <div className='mx-2 fst-italic text-break mb-3'>
                    { LocalizeText('inventory.marketplace.make_offer.expiration_info', ['time'], [catalogState.marketplaceConfiguration.offerTime.toString()]) }
                </div>
                <div className="d-flex flex-row text-black mb-3">
                    <div className="mr-2 align-self-center fw-bold" style={ { whiteSpace: 'nowrap' } }>{ LocalizeText('inventory.marketplace.make_offer.price_request') }</div>
                    <input className="form-control form-control-sm" type="number" min={0} value={ askingPrice } onChange={ event => setAskingPrice(event.target.valueAsNumber) } />
                </div>
                <div className="alert alert-light" role="alert">
                    { (askingPrice < catalogState.marketplaceConfiguration.minimumPrice || isNaN(askingPrice)) && LocalizeText('inventory.marketplace.make_offer.min_price', ['minprice'], [catalogState.marketplaceConfiguration.minimumPrice.toString()]) }
                    { askingPrice > catalogState.marketplaceConfiguration.maximumPrice && !isNaN(askingPrice) &&
                        LocalizeText('inventory.marketplace.make_offer.max_price', ['maxprice'], [catalogState.marketplaceConfiguration.maximumPrice.toString()])
                    }
                    { !(askingPrice < catalogState.marketplaceConfiguration.minimumPrice || askingPrice > catalogState.marketplaceConfiguration.maximumPrice || isNaN(askingPrice)) && LocalizeText('inventory.marketplace.make_offer.final_price', ['commission', 'finalprice'], [catalogState.marketplaceConfiguration.commission.toString(), (askingPrice + catalogState.marketplaceConfiguration.commission).toString()])}
                </div>
                <div className="btn-group btn-group-sm mt-3" role="group">
                    <button className='btn btn-primary' disabled={askingPrice < catalogState.marketplaceConfiguration.minimumPrice || askingPrice > catalogState.marketplaceConfiguration.maximumPrice || isNaN(askingPrice)} onClick={ postItem }>
                        { LocalizeText('inventory.marketplace.make_offer.post') }
                    </button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
