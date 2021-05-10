import { FC } from 'react';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogSearchResultOfferView } from '../offer/CatalogSearchResultOfferView';
import { CatalogSearchResultOffersViewProps } from './CatalogSearchResultOffersView.types';

export const CatalogSearchResultOffersView: FC<CatalogSearchResultOffersViewProps> = props =>
{
    const { offers = [] } = props;
    const { catalogState } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    return (
        <div className="row row-cols-5 align-content-start g-0 mb-n1 w-100 catalog-offers-container">
            { offers && (offers.length > 0) && offers.map((offer, index) =>
                {
                    const isActive = (activeOffer && (activeOffer.products[0].furniClassId === offer.id));

                    return <CatalogSearchResultOfferView key={ index } isActive={ isActive } offer={ offer } />
                }) }
        </div>
    );
}
