import { FrontPageItem } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo } from 'react';
import { CreateLinkEvent, GetConfiguration } from '../../../../../../api';
import { NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../../../layout';
import { GetCatalogPageText } from '../../../../common/CatalogUtilities';
import { CatalogRedeemVoucherView } from '../../redeem-voucher/CatalogRedeemVoucherView';
import { CatalogLayoutFrontpage4ViewProps } from './CatalogLayoutFrontpage4View.types';
import { CatalogLayoutFrontPageItemView } from './item/CatalogLayoutFrontPageItemView';

export const CatalogLayoutFrontpage4View: FC<CatalogLayoutFrontpage4ViewProps> = props =>
{
    const { pageParser = null } = props;

    const imageLibraryUrl = useMemo(() =>
    {
        console.log(pageParser);
        return GetConfiguration<string>('image.library.url');
    }, []);

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

    if(!pageParser) return null;

    return (
        <NitroLayoutGrid>
            <NitroLayoutGridColumn size={ 4 }>
                { pageParser.frontPageItems[0] &&
                    <CatalogLayoutFrontPageItemView item={ pageParser.frontPageItems[0] } onClick={ event => selectItem(pageParser.frontPageItems[0]) } /> }
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 8 }>
                { pageParser.frontPageItems[1] &&
                    <CatalogLayoutFrontPageItemView item={ pageParser.frontPageItems[1] } onClick={ event => selectItem(pageParser.frontPageItems[1]) } /> }
                { pageParser.frontPageItems[2] &&
                    <CatalogLayoutFrontPageItemView item={ pageParser.frontPageItems[2] } onClick={ event => selectItem(pageParser.frontPageItems[2]) } /> }
                { pageParser.frontPageItems[3] &&
                    <CatalogLayoutFrontPageItemView item={ pageParser.frontPageItems[3] } onClick={ event => selectItem(pageParser.frontPageItems[3]) } /> }
                <CatalogRedeemVoucherView text={ GetCatalogPageText(pageParser, 1) } />
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
