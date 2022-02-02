import { FC, useEffect } from 'react';
import { useCatalogContext } from '../../../CatalogContext';

export const CatalogFirstProductSelectorWidgetView: FC<{}> = props =>
{
    const { currentPage = null, setCurrentOffer = null } = useCatalogContext();

    useEffect(() =>
    {
        if(!currentPage || !currentPage.offers.length) return;

        setCurrentOffer(currentPage.offers[0]);
    }, [ currentPage, setCurrentOffer ]);

    return null;
}
