import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../api';
import { AutoGrid, AutoGridProps } from '../../../../../common/AutoGrid';
import { Button } from '../../../../../common/Button';
import { ButtonGroup } from '../../../../../common/ButtonGroup';
import { BatchUpdates } from '../../../../../hooks';
import { useCatalogContext } from '../../../CatalogContext';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';
import { Offer } from '../../../common/Offer';
import { ProductTypeEnum } from '../../../common/ProductTypeEnum';
import { CatalogGridOfferView } from '../common/CatalogGridOfferView';

interface CatalogSpacesWidgetViewProps extends AutoGridProps
{

}

const SPACES_GROUP_NAMES = [ 'floors', 'walls', 'views' ];

export const CatalogSpacesWidgetView: FC<CatalogSpacesWidgetViewProps> = props =>
{
    const { columnCount = 5, children = null, ...rest } = props;
    const [ groupedOffers, setGroupedOffers ] = useState<IPurchasableOffer[][]>(null);
    const [ selectedGroupIndex, setSelectedGroupIndex ] = useState(-1);
    const [ selectedOfferForGroup, setSelectedOfferForGroup ] = useState<IPurchasableOffer[]>(null);
    const { currentPage = null, currentOffer = null, setCurrentOffer = null, setPurchaseOptions = null } = useCatalogContext();

    useEffect(() =>
    {
        if(!currentPage) return;
        
        const groupedOffers: IPurchasableOffer[][] = [ [], [], [] ];
        
        for(const offer of currentPage.offers)
        {
            if((offer.pricingModel !== Offer.PRICING_MODEL_SINGLE) && (offer.pricingModel !== Offer.PRICING_MODEL_MULTI)) continue;

            const product = offer.product;

            if(!product || ((product.productType !== ProductTypeEnum.WALL) && (product.productType !== ProductTypeEnum.FLOOR)) || !product.furnitureData) continue;

            const className = product.furnitureData.className;

            switch(className)
            {
                case 'floor':
                    groupedOffers[0].push(offer);
                    break;
                case 'wallpaper':
                    groupedOffers[1].push(offer);
                    break;
                case 'landscape':
                    groupedOffers[2].push(offer);
                    break;
            }
        }

        BatchUpdates(() =>
        {
            setGroupedOffers(groupedOffers);
            setSelectedGroupIndex(0);
            setSelectedOfferForGroup([ groupedOffers[0][0], groupedOffers[1][0], groupedOffers[2][0] ]);
        });
    }, [ currentPage ]);

    useEffect(() =>
    {
        if((selectedGroupIndex === -1) || !selectedOfferForGroup) return;

        setCurrentOffer(selectedOfferForGroup[selectedGroupIndex]);

    }, [ selectedGroupIndex, selectedOfferForGroup, setCurrentOffer ]);

    useEffect(() =>
    {
        if((selectedGroupIndex === -1) || !selectedOfferForGroup || !currentOffer) return;

        setPurchaseOptions(prevValue =>
            {
                const extraData = selectedOfferForGroup[selectedGroupIndex].product.extraParam;
                const extraParamRequired = true;

                return { ...prevValue, extraData, extraParamRequired };
            });
    }, [ currentOffer, selectedGroupIndex, selectedOfferForGroup, setPurchaseOptions ]);

    if(!groupedOffers || (selectedGroupIndex === -1)) return null;

    const offers = groupedOffers[selectedGroupIndex];

    return (
        <>
            <ButtonGroup>
                { SPACES_GROUP_NAMES.map((name, index) => <Button key={ index } active={ (selectedGroupIndex === index) } onClick={ event => setSelectedGroupIndex(index) }>{ LocalizeText(`catalog.spaces.tab.${ name }`) }</Button>) }
            </ButtonGroup>
            <AutoGrid columnCount={ columnCount } { ...rest }>
                { offers && (offers.length > 0) && offers.map((offer, index) =>
                {
                    const setSelectedOffer = () =>
                    {
                        setSelectedOfferForGroup(prevValue =>
                            {
                                const newValue = [ ...prevValue ];

                                newValue[selectedGroupIndex] = offer;

                                return newValue;
                            });
                    }

                    return <CatalogGridOfferView key={ index } itemActive={ (currentOffer && (currentOffer === offer)) } offer={ offer } onClick={ setSelectedOffer } />;
                }) }
                { children }
            </AutoGrid>
        </>
    );
}
