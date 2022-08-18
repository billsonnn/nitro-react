import { FC, useEffect, useRef } from 'react';
import { IPurchasableOffer, ProductTypeEnum } from '../../../../../api';
import { AutoGrid, AutoGridProps } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogGridOfferView } from '../common/CatalogGridOfferView';

interface CatalogItemGridWidgetViewProps extends AutoGridProps
{

}

export const CatalogItemGridWidgetView: FC<CatalogItemGridWidgetViewProps> = props =>
{
    const { columnCount = 5, children = null, ...rest } = props;
    const { currentOffer = null, setCurrentOffer = null, currentPage = null, setPurchaseOptions = null } = useCatalog();
    const elementRef = useRef<HTMLDivElement>();

    useEffect(() =>
    {
        if(elementRef && elementRef.current) elementRef.current.scrollTop = 0;
    }, [ currentPage ]);

    if(!currentPage) return null;

    const selectOffer = (offer: IPurchasableOffer) =>
    {
        offer.activate();

        if(offer.isLazy) return;
        
        setCurrentOffer(offer);

        if(offer.product && (offer.product.productType === ProductTypeEnum.WALL))
        {
            setPurchaseOptions(prevValue =>
            {
                const newValue = { ...prevValue };
    
                newValue.extraData = (offer.product.extraParam || null);
    
                return newValue;
            });
        }
    }

    return (
        <AutoGrid innerRef={ elementRef } columnCount={ columnCount } { ...rest }>
            { currentPage.offers && (currentPage.offers.length > 0) && currentPage.offers.map((offer, index) => <CatalogGridOfferView key={ index } itemActive={ (currentOffer && (currentOffer.offerId === offer.offerId)) } offer={ offer } selectOffer={ selectOffer } />) }
            { children }
        </AutoGrid>
    );
}
