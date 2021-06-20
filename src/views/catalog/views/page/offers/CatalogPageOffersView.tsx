import { FC, useEffect } from 'react';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogPageOfferView } from '../offer/CatalogPageOfferView';
import { CatalogPageOffersViewProps } from './CatalogPageOffersView.types';

export const CatalogPageOffersView: FC<CatalogPageOffersViewProps> = props =>
{
    const { offers = [] } = props;
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    useEffect(() =>
    {
        if(!offers || !offers.length) return;

        // dispatchCatalogState({
        //     type: CatalogActions.SET_CATALOG_ACTIVE_OFFER,
        //     payload: {
        //         activeOffer: offers[0]
        //     }
        // });
    }, [ offers, dispatchCatalogState ]);

    return (
        <div className="row row-cols-5 align-content-start g-0 mb-n1 w-100 catalog-offers-container h-100 overflow-auto">
            { offers && (offers.length > 0) && offers.map((offer, index) =>
                {
                    return <CatalogPageOfferView key={ index } isActive={ (activeOffer === offer) } offer={ offer } />
            })}
                        { offers && (offers.length > 0) && offers.map((offer, index) =>
                {
                    return <CatalogPageOfferView key={ index } isActive={ (activeOffer === offer) } offer={ offer } />
                        })}
                        { offers && (offers.length > 0) && offers.map((offer, index) =>
                {
                    return <CatalogPageOfferView key={ index } isActive={ (activeOffer === offer) } offer={ offer } />
                        })}
                        { offers && (offers.length > 0) && offers.map((offer, index) =>
                {
                    return <CatalogPageOfferView key={ index } isActive={ (activeOffer === offer) } offer={ offer } />
                }) }
        </div>
    );
}
