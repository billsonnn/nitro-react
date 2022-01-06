import { FrontPageItem } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateLinkEvent } from '../../../../../../api';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { GetCatalogPageText } from '../../../../common/CatalogUtilities';
import { CatalogRedeemVoucherView } from '../../redeem-voucher/CatalogRedeemVoucherView';
import { CatalogLayoutProps } from '../CatalogLayout.types';
import { CatalogLayoutFrontPageItemView } from './CatalogLayoutFrontPageItemView';

export const CatalogLayoutFrontpage4View: FC<CatalogLayoutProps> = props =>
{
    const { pageParser = null } = props;

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

    return (
        <Grid>
            <Column size={ 4 }>
                { pageParser.frontPageItems[0] &&
                    <CatalogLayoutFrontPageItemView item={ pageParser.frontPageItems[0] } onClick={ event => selectItem(pageParser.frontPageItems[0]) } /> }
            </Column>
            <Column size={ 8 }>
                { pageParser.frontPageItems[1] &&
                    <CatalogLayoutFrontPageItemView item={ pageParser.frontPageItems[1] } onClick={ event => selectItem(pageParser.frontPageItems[1]) } /> }
                { pageParser.frontPageItems[2] &&
                    <CatalogLayoutFrontPageItemView item={ pageParser.frontPageItems[2] } onClick={ event => selectItem(pageParser.frontPageItems[2]) } /> }
                { pageParser.frontPageItems[3] &&
                    <CatalogLayoutFrontPageItemView item={ pageParser.frontPageItems[3] } onClick={ event => selectItem(pageParser.frontPageItems[3]) } /> }
                <CatalogRedeemVoucherView text={ GetCatalogPageText(pageParser, 1) } />
            </Column>
        </Grid>
    );
}
