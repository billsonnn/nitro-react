import { FC } from 'react';
import { NitroCardGridView } from '../../../../../../layout';
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
        <div className="row h-100">
            <div className="d-flex flex-column col-7 h-100">
                <NitroCardGridView columns={ 5 }>
                    { activeOffer && activeOffer.products && (activeOffer.products.length > 0) && activeOffer.products.map((product, index) =>
                        {
                            return <CatalogProductView key={ index } isActive={ false } product={ product } />
                        }) }
                </NitroCardGridView>
            </div>
            <div className="position-relative d-flex flex-column col-5">
                <CatalogPageDetailsView pageParser={ pageParser } />
                { activeOffer && <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } /> }
            </div>
        </div>
    );
}
