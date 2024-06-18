import { FC, useCallback, useMemo } from 'react';
import { GetImageIconUrlForProduct, LocalizeText, MarketPlaceOfferState, MarketplaceOfferData, ProductTypeEnum } from '../../../../../../api';
import { Button, Column, LayoutGridItem, Text } from '../../../../../../common';

export interface MarketplaceItemViewProps
{
    offerData: MarketplaceOfferData;
    type?: number;
    onClick(offerData: MarketplaceOfferData): void;
}

export const OWN_OFFER = 1;
export const PUBLIC_OFFER = 2;

export const CatalogLayoutMarketplaceItemView: FC<MarketplaceItemViewProps> = props =>
{
    const { offerData = null, type = PUBLIC_OFFER, onClick = null } = props;

    const getMarketplaceOfferTitle = useMemo(() =>
    {
        if(!offerData) return '';

        // desc
        return LocalizeText(((offerData.furniType === 2) ? 'wallItem' : 'roomItem') + `.name.${ offerData.furniId }`);
    }, [ offerData ]);

    const offerTime = useCallback( () =>
    {
        if(!offerData) return '';

        if(offerData.status === MarketPlaceOfferState.SOLD) return LocalizeText('catalog.marketplace.offer.sold');

        if(offerData.timeLeftMinutes <= 0) return LocalizeText('catalog.marketplace.offer.expired');

        const time = Math.max(1, offerData.timeLeftMinutes);
        const hours = Math.floor(time / 60);
        const minutes = time - (hours * 60);

        let text = minutes + ' ' + LocalizeText('catalog.marketplace.offer.minutes');
        if(hours > 0)
        {
            text = hours + ' ' + LocalizeText('catalog.marketplace.offer.hours') + ' ' + text;
        }

        return LocalizeText('catalog.marketplace.offer.time_left', [ 'time' ], [ text ] );
    }, [ offerData ]);

    return (
        <LayoutGridItem shrink alignItems="center" center={ false } className="p-1" column={ false }>
            <Column style={ { width: 40, height: 40 } }>
                <LayoutGridItem column={ false } itemImage={ GetImageIconUrlForProduct(((offerData.furniType === MarketplaceOfferData.TYPE_FLOOR) ? ProductTypeEnum.FLOOR : ProductTypeEnum.WALL), offerData.furniId, offerData.extraData) } itemUniqueNumber={ offerData.isUniqueLimitedItem ? offerData.stuffData.uniqueNumber : 0 } />
            </Column>
            <Column grow gap={ 0 }>
                <Text fontWeight="bold">{ getMarketplaceOfferTitle }</Text>
                { (type === OWN_OFFER) &&
                    <>
                        <Text>{ LocalizeText('catalog.marketplace.offer.price_own_item', [ 'price' ], [ offerData.price.toString() ]) }</Text>
                        <Text>{ offerTime() }</Text>
                    </> }
                { (type === PUBLIC_OFFER) &&
                    <>
                        <Text>{ LocalizeText('catalog.marketplace.offer.price_public_item', [ 'price', 'average' ], [ offerData.price.toString(), ((offerData.averagePrice > 0) ? offerData.averagePrice.toString() : '-') ]) }</Text>
                        <Text>{ LocalizeText('catalog.marketplace.offer_count', [ 'count' ], [ offerData.offerCount.toString() ]) }</Text>
                    </> }
            </Column>
            <div className="flex flex-col gap-1">
                { ((type === OWN_OFFER) && (offerData.status !== MarketPlaceOfferState.SOLD)) &&
                    <Button variant="secondary" onClick={ () => onClick(offerData) }>
                        { LocalizeText('catalog.marketplace.offer.pick') }
                    </Button> }
                { type === PUBLIC_OFFER &&
                    <>
                        <Button variant="secondary" onClick={ () => onClick(offerData) }>
                            { LocalizeText('buy') }
                        </Button>
                        <Button disabled variant="secondary">
                            { LocalizeText('catalog.marketplace.view_more') }
                        </Button>
                    </> }
            </div>
        </LayoutGridItem>
    );
};
