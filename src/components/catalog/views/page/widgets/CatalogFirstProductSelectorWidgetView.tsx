import { FC, useEffect } from 'react';
import { useCatalog } from '../../../../../hooks';

export const CatalogFirstProductSelectorWidgetView: FC<{}> = props =>
{
    const { currentPage = null, setCurrentOffer = null } = useCatalog();

    useEffect(() =>
    {
        if(!currentPage || !currentPage.offers.length) return;

        setCurrentOffer(currentPage.offers[0]);
    }, [ currentPage, setCurrentOffer ]);

    return null;
};
