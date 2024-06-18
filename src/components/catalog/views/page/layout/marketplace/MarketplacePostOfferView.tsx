import { GetMarketplaceConfigurationMessageComposer, MakeOfferMessageComposer, MarketplaceConfigurationEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FurnitureItem, LocalizeText, ProductTypeEnum, SendMessageComposer } from '../../../../../../api';
import { Button, Column, Grid, LayoutFurniImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../../../common';
import { CatalogPostMarketplaceOfferEvent } from '../../../../../../events';
import { useCatalog, useMessageEvent, useNotification, useUiEvent } from '../../../../../../hooks';
import { NitroInput } from '../../../../../../layout';

export const MarketplacePostOfferView: FC<{}> = props =>
{
    const [ item, setItem ] = useState<FurnitureItem>(null);
    const [ askingPrice, setAskingPrice ] = useState(0);
    const [ tempAskingPrice, setTempAskingPrice ] = useState('0');
    const { catalogOptions = null, setCatalogOptions = null } = useCatalog();
    const { marketplaceConfiguration = null } = catalogOptions;
    const { showConfirm = null } = useNotification();

    const updateAskingPrice = (price: string) =>
    {
        setTempAskingPrice(price);

        const newValue = parseInt(price);

        if(isNaN(newValue) || (newValue === askingPrice)) return;

        setAskingPrice(parseInt(price));
    };

    useMessageEvent<MarketplaceConfigurationEvent>(MarketplaceConfigurationEvent, event =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.marketplaceConfiguration = parser;

            return newValue;
        });
    });

    useUiEvent<CatalogPostMarketplaceOfferEvent>(CatalogPostMarketplaceOfferEvent.POST_MARKETPLACE, event => setItem(event.item));

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

    const getCommission = () => Math.max(Math.ceil(((marketplaceConfiguration.commission * 0.01) * askingPrice)), 1);

    const postItem = () =>
    {
        if(!item || (askingPrice < marketplaceConfiguration.minimumPrice)) return;

        showConfirm(LocalizeText('inventory.marketplace.confirm_offer.info', [ 'furniname', 'price' ], [ getFurniTitle, askingPrice.toString() ]), () =>
        {
            SendMessageComposer(new MakeOfferMessageComposer(askingPrice, item.isWallItem ? 2 : 1, item.id));
            setItem(null);
        },
        () =>
        {
            setItem(null);
        }, null, null, LocalizeText('inventory.marketplace.confirm_offer.title'));
    };

    return (
        <NitroCardView className="nitro-catalog-layout-marketplace-post-offer" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('inventory.marketplace.make_offer.title') } onCloseClick={ event => setItem(null) } />
            <NitroCardContentView overflow="hidden">
                <Grid fullHeight>
                    <Column center className="bg-muted rounded p-2" overflow="hidden" size={ 4 }>
                        <LayoutFurniImageView extraData={ item.extra.toString() } productClassId={ item.type } productType={ item.isWallItem ? ProductTypeEnum.WALL : ProductTypeEnum.FLOOR } />
                    </Column>
                    <Column justifyContent="between" overflow="hidden" size={ 8 }>
                        <Column grow gap={ 1 }>
                            <Text fontWeight="bold">{ getFurniTitle }</Text>
                            <Text shrink truncate>{ getFurniDescription }</Text>
                        </Column>
                        <Column overflow="auto">
                            <Text italics>
                                { LocalizeText('inventory.marketplace.make_offer.expiration_info', [ 'time' ], [ marketplaceConfiguration.offerTime.toString() ]) }
                            </Text>
                            <div className="input-group has-validation">


                                <NitroInput min={ 0 } placeholder={ LocalizeText('inventory.marketplace.make_offer.price_request') } type="number" value={ tempAskingPrice } onChange={ event => updateAskingPrice(event.target.value) } />
                                { ((askingPrice < marketplaceConfiguration.minimumPrice) || isNaN(askingPrice)) &&
                                    <div className="invalid-feedback d-block">
                                        { LocalizeText('inventory.marketplace.make_offer.min_price', [ 'minprice' ], [ marketplaceConfiguration.minimumPrice.toString() ]) }
                                    </div> }
                                { ((askingPrice > marketplaceConfiguration.maximumPrice) && !isNaN(askingPrice)) &&
                                    <div className="invalid-feedback d-block">
                                        { LocalizeText('inventory.marketplace.make_offer.max_price', [ 'maxprice' ], [ marketplaceConfiguration.maximumPrice.toString() ]) }
                                    </div> }
                                { (!((askingPrice < marketplaceConfiguration.minimumPrice) || (askingPrice > marketplaceConfiguration.maximumPrice) || isNaN(askingPrice))) &&
                                    <div className="invalid-feedback d-block">
                                        { LocalizeText('inventory.marketplace.make_offer.final_price', [ 'commission', 'finalprice' ], [ getCommission().toString(), (askingPrice + getCommission()).toString() ]) }
                                    </div> }
                            </div>
                            <Button disabled={ ((askingPrice < marketplaceConfiguration.minimumPrice) || (askingPrice > marketplaceConfiguration.maximumPrice) || isNaN(askingPrice)) } onClick={ postItem }>
                                { LocalizeText('inventory.marketplace.make_offer.post') }
                            </Button>
                        </Column>
                    </Column>
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    );
};
