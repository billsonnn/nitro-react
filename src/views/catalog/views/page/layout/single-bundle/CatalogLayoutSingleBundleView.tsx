import { FC } from 'react';
import { NitroCardGridView, NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../../../layout';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogPageDetailsView } from '../../../page-details/CatalogPageDetailsView';
import { CatalogProductView } from '../../product/CatalogProductView';
import { CatalogPurchaseView } from '../../purchase/CatalogPurchaseView';
import { CatalogLayoutSingleBundleViewProps } from './CatalogLayoutSingleBundleView.types';

export const CatalogLayoutSingleBundleView: FC<CatalogLayoutSingleBundleViewProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    return (
        <NitroLayoutGrid>
            <NitroLayoutGridColumn size={ 7 }>
                <NitroCardGridView>
                    { activeOffer && activeOffer.products && (activeOffer.products.length > 0) && activeOffer.products.map((product, index) =>
                        {
                            return <CatalogProductView key={ index } isActive={ false } product={ product } />
                        }) }
                </NitroCardGridView>
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 }>
                <CatalogPageDetailsView pageParser={ pageParser } />
                { activeOffer && <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } /> }
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
