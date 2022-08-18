import { FC, useEffect, useRef, useState } from 'react';
import { IPurchasableOffer, LocalizeText, Offer, ProductTypeEnum } from '../../../../../api';
import { AutoGrid, AutoGridProps, Button, ButtonGroup } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
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
    const { currentPage = null, currentOffer = null, setCurrentOffer = null, setPurchaseOptions = null } = useCatalog();
    const elementRef = useRef<HTMLDivElement>();

    const setSelectedOffer = (offer: IPurchasableOffer) =>
    {
        if(!offer) return;

        setSelectedOfferForGroup(prevValue =>
        {
            const newValue = [ ...prevValue ];

            newValue[selectedGroupIndex] = offer;

            return newValue;
        });
    }

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

        setGroupedOffers(groupedOffers);
        setSelectedGroupIndex(0);
        setSelectedOfferForGroup([ groupedOffers[0][0], groupedOffers[1][0], groupedOffers[2][0] ]);
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
            const newValue = { ...prevValue };
                
            newValue.extraData = selectedOfferForGroup[selectedGroupIndex].product.extraParam;
            newValue.extraParamRequired = true;

            return newValue;
        });
    }, [ currentOffer, selectedGroupIndex, selectedOfferForGroup, setPurchaseOptions ]);

    useEffect(() =>
    {
        if(elementRef && elementRef.current) elementRef.current.scrollTop = 0;
    }, [ selectedGroupIndex ]);

    if(!groupedOffers || (selectedGroupIndex === -1)) return null;

    const offers = groupedOffers[selectedGroupIndex];

    return (
        <>
            <ButtonGroup>
                { SPACES_GROUP_NAMES.map((name, index) => <Button key={ index } active={ (selectedGroupIndex === index) } onClick={ event => setSelectedGroupIndex(index) }>{ LocalizeText(`catalog.spaces.tab.${ name }`) }</Button>) }
            </ButtonGroup>
            <AutoGrid innerRef={ elementRef } columnCount={ columnCount } { ...rest }>
                { offers && (offers.length > 0) && offers.map((offer, index) => <CatalogGridOfferView key={ index } itemActive={ (currentOffer && (currentOffer === offer)) } offer={ offer } selectOffer={ offer => setSelectedOffer(offer) } />) }
                { children }
            </AutoGrid>
        </>
    );
}
