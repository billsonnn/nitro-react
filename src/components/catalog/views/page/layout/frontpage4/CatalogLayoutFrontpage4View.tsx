import { CreateLinkEvent, FrontPageItem } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect } from 'react';
import { Column, Grid } from '../../../../../../common';
import { useCatalog } from '../../../../../../hooks';
import { CatalogRedeemVoucherView } from '../../common/CatalogRedeemVoucherView';
import { CatalogLayoutProps } from '../CatalogLayout.types';
import { CatalogLayoutFrontPageItemView } from './CatalogLayoutFrontPageItemView';

export const CatalogLayoutFrontpage4View: FC<CatalogLayoutProps> = props =>
{
    const { page = null, hideNavigation = null } = props;
    const { frontPageItems = [] } = useCatalog();

    const selectItem = useCallback((item: FrontPageItem) =>
    {
        switch(item.type)
        {
            case FrontPageItem.ITEM_CATALOGUE_PAGE:
                CreateLinkEvent(`catalog/open/${ item.catalogPageLocation }`);
                return;
            case FrontPageItem.ITEM_PRODUCT_OFFER:
                CreateLinkEvent(`catalog/open/${ item.productOfferId }`);
                return;
        }
    }, []);

    useEffect(() =>
    {
        hideNavigation();
    }, [ page, hideNavigation ]);

    return (
        <Grid>
            <Column size={ 4 }>
                { frontPageItems[0] &&
                    <CatalogLayoutFrontPageItemView item={ frontPageItems[0] } onClick={ event => selectItem(frontPageItems[0]) } /> }
            </Column>
            <Column size={ 8 }>
                { frontPageItems[1] &&
                    <CatalogLayoutFrontPageItemView item={ frontPageItems[1] } onClick={ event => selectItem(frontPageItems[1]) } /> }
                { frontPageItems[2] &&
                    <CatalogLayoutFrontPageItemView item={ frontPageItems[2] } onClick={ event => selectItem(frontPageItems[2]) } /> }
                { frontPageItems[3] &&
                    <CatalogLayoutFrontPageItemView item={ frontPageItems[3] } onClick={ event => selectItem(frontPageItems[3]) } /> }
                <CatalogRedeemVoucherView text={ page.localization.getText(1) } />
            </Column>
        </Grid>
    );
}
