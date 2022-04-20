import { GetMarketplaceConfigurationMessageComposer, MakeOfferMessageComposer, MarketplaceConfigurationEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { FurnitureItem, LocalizeText, NotificationUtilities, ProductTypeEnum, SendMessageComposer } from '../../../../../../api';
import { Base, Button, Column, Grid, LayoutFurniImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../../../common';
import { CatalogPostMarketplaceOfferEvent } from '../../../../../../events';
import { useCatalog, UseMessageEventHook, UseUiEvent } from '../../../../../../hooks';

export const MarketplacePostOfferView : FC<{}> = props =>
{
    const [ item, setItem ] = useState<FurnitureItem>(null);
    const [ askingPrice, setAskingPrice ] = useState(0);
    const { catalogOptions = null, setCatalogOptions = null } = useCatalog();
    const { marketplaceConfiguration = null } = catalogOptions;

    const onMarketplaceConfigurationEvent = useCallback((event: MarketplaceConfigurationEvent) =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.marketplaceConfiguration = parser;

            return newValue;
        });
    }, [ setCatalogOptions ]);

    UseMessageEventHook(MarketplaceConfigurationEvent, onMarketplaceConfigurationEvent);

    const onCatalogPostMarketplaceOfferEvent = useCallback( (event: CatalogPostMarketplaceOfferEvent) =>
    {
        setItem(event.item);
    }, []);

    UseUiEvent(CatalogPostMarketplaceOfferEvent.POST_MARKETPLACE, onCatalogPostMarketplaceOfferEvent);

    useEffect(() =>
    {
        if(!item || marketplaceConfiguration) return;

        SendMessageComposer(new GetMarketplaceConfigurationMessageComposer());
    }, [ item, marketplaceConfiguration ]);

    useEffect(() =>
    {
        if(!item) return;
        
        return () => setAskingPrice(0);
    }, [ item ]);

    if(!marketplaceConfiguration || !item) return null;

    const getFurniTitle = (item ? LocalizeText(item.isWallItem ? 'wallItem.name.' + item.type : 'roomItem.name.' + item.type) : '');
    const getFurniDescription = (item ? LocalizeText(item.isWallItem ? 'wallItem.desc.' + item.type : 'roomItem.desc.' + item.type) : '');

    const postItem = () =>
    {
        if(!item || (askingPrice <= marketplaceConfiguration.minimumPrice)) return;

        NotificationUtilities.confirm(LocalizeText('inventory.marketplace.confirm_offer.info', [ 'furniname', 'price' ], [ getFurniTitle, askingPrice.toString() ]), () =>
        {
            SendMessageComposer(new MakeOfferMessageComposer(askingPrice, item.isWallItem ? 2 : 1, item.id));
            setItem(null);
        },
        () => 
        {
            setItem(null) 
        }, null, null, LocalizeText('inventory.marketplace.confirm_offer.title'));
    }

    return (
        <NitroCardView className="nitro-catalog-layout-marketplace-post-offer" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('inventory.marketplace.make_offer.title') } onCloseClick={ event => setItem(null) } />
            <NitroCardContentView overflow="hidden">
                <Grid fullHeight>
                    <Column center className="bg-muted rounded p-2" size={ 4 } overflow="hidden">
                        <LayoutFurniImageView productType={ item.isWallItem ? ProductTypeEnum.WALL : ProductTypeEnum.FLOOR } productClassId={ item.type } extraData={ item.extra.toString() } />
                    </Column>
                    <Column size={ 8 } justifyContent="between" overflow="hidden">
                        <Column grow gap={ 1 }>
                            <Text fontWeight="bold">{ getFurniTitle }</Text>
                            <Text truncate shrink>{ getFurniDescription }</Text>
                        </Column>
                        <Column overflow="auto">
                            <Text italics>
                                { LocalizeText('inventory.marketplace.make_offer.expiration_info', [ 'time' ], [ marketplaceConfiguration.offerTime.toString() ]) }
                            </Text>
                            <div className="input-group has-validation">
                                <input className="form-control form-control-sm" type="number" min={ 0 } value={ askingPrice } onChange={ event => setAskingPrice(parseInt(event.target.value)) } placeholder={ LocalizeText('inventory.marketplace.make_offer.price_request') } />
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
                            <Button disabled={ ((askingPrice < marketplaceConfiguration.minimumPrice) || (askingPrice > marketplaceConfiguration.maximumPrice) || isNaN(askingPrice)) } onClick={ postItem }>
                                { LocalizeText('inventory.marketplace.make_offer.post') }
                            </Button>
                        </Column>
                    </Column>
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    )
}
