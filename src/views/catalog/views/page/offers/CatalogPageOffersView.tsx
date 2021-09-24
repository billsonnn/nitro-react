import { FC } from 'react';
import { NitroCardGridView } from '../../../../../layout';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogPageOfferView } from '../offer/CatalogPageOfferView';
import { CatalogPageOffersViewProps } from './CatalogPageOffersView.types';

export const CatalogPageOffersView: FC<CatalogPageOffersViewProps> = props =>
{
    const { offers = [], ...rest } = props;
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    return (
        <NitroCardGridView { ...rest }>
            { offers && (offers.length > 0) && offers.map((offer, index) =>
                {
                    return <CatalogPageOfferView key={ index } isActive={ (activeOffer === offer) } offer={ offer } />
                })}
        </NitroCardGridView>
    );
}
