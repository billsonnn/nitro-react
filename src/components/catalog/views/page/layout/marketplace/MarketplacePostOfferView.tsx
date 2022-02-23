import { ImageResult, MakeOfferMessageComposer, Vector3d } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../../../api';
import { Base } from '../../../../../../common/Base';
import { Button } from '../../../../../../common/Button';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { LayoutImage } from '../../../../../../common/layout/LayoutImage';
import { Text } from '../../../../../../common/Text';
import { CatalogPostMarketplaceOfferEvent } from '../../../../../../events/catalog/CatalogPostMarketplaceOfferEvent';
import { BatchUpdates, SendMessageHook, useUiEvent } from '../../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../../layout';
import { NotificationUtilities } from '../../../../../../views/notification-center/common/NotificationUtilities';
import { FurnitureItem } from '../../../../../inventory/common/FurnitureItem';
import { useCatalogContext } from '../../../../CatalogContext';

export const MarketplacePostOfferView : FC<{}> = props =>
{
    const [ item, setItem ] = useState<FurnitureItem>(null);
    const [ askingPrice, setAskingPrice ] = useState(0);
    const { catalogOptions = null } = useCatalogContext();
    const { marketplaceConfiguration = null } = catalogOptions;
    
    const close = useCallback(() =>
    {
        BatchUpdates(() =>
        {
            setItem(null);
            setAskingPrice(0);
        });
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
        <NitroCardView className="nitro-catalog-layout-marketplace-post-offer" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('inventory.marketplace.make_offer.title') } onCloseClick={ close } />
            <NitroCardContentView overflow="hidden">
                <Grid fullHeight>
                    <Column center className="bg-muted rounded p-2" size={ 4 } overflow="hidden">
                        <LayoutImage imageUrl={ getItemImage() } />
                    </Column>
                    <Column size={ 8 } justifyContent="between" overflow="hidden">
                        <Column grow gap={ 1 }>
                            <Text fontWeight="bold">{ getFurniTitle() }</Text>
                            <Text truncate shrink>{ getFurniDescription() }</Text>
                        </Column>
                        <Column overflow="auto">
                            <Text italics>
                                { LocalizeText('inventory.marketplace.make_offer.expiration_info', ['time'], [marketplaceConfiguration.offerTime.toString()]) }
                            </Text>
                            <div className="input-group has-validation">
                                <input className="form-control form-control-sm" type="number" min={ 0 } value={ askingPrice } onChange={ event => setAskingPrice(event.target.valueAsNumber) } placeholder={ LocalizeText('inventory.marketplace.make_offer.price_request') } />
                                { ((askingPrice < marketplaceConfiguration.minimumPrice) || isNaN(askingPrice)) &&
                                    <Base className="invalid-feedback d-block">
                                        { LocalizeText('inventory.marketplace.make_offer.min_price', [ 'minprice' ], [ marketplaceConfiguration.minimumPrice.toString() ]) }
                                    </Base> }
                                { ((askingPrice > marketplaceConfiguration.maximumPrice) && !isNaN(askingPrice)) &&
                                    <Base className="invalid-feedback d-block">
                                        { LocalizeText('inventory.marketplace.make_offer.max_price', [ 'maxprice' ], [ marketplaceConfiguration.maximumPrice.toString() ]) }
                                    </Base> }
                                { (!((askingPrice < marketplaceConfiguration.minimumPrice) || (askingPrice > marketplaceConfiguration.maximumPrice) || isNaN(askingPrice))) &&
                                    <Base className="invalid-feedback d-block">
                                        { LocalizeText('inventory.marketplace.make_offer.final_price', [ 'commission', 'finalprice' ], [ marketplaceConfiguration.commission.toString(), (askingPrice + marketplaceConfiguration.commission).toString() ]) }
                                    </Base> }
                            </div>
                            <Button size="sm" disabled={ ((askingPrice < marketplaceConfiguration.minimumPrice) || (askingPrice > marketplaceConfiguration.maximumPrice) || isNaN(askingPrice)) } onClick={ postItem }>
                                { LocalizeText('inventory.marketplace.make_offer.post') }
                            </Button>
                        </Column>
                    </Column>
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    )
}
