import { FC } from 'react';
import { GetCatalogPageImage, GetCatalogPageText } from '../../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogProductView } from '../../product/CatalogProductView';
import { CatalogPurchaseView } from '../../purchase/CatalogPurchaseView';
import { CatalogLayoutSingleBundleViewProps } from './CatalogLayoutSingleBundleView.types';

export const CatalogLayoutSingleBundleView: FC<CatalogLayoutSingleBundleViewProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    return (
        <div className="row h-100 nitro-catalog-layout-single-bundle">
            <div className="col-7 h-100">
                <div className="row row-cols-5 align-content-start g-0 mb-n1 w-100 catalog-offers-container single-bundle-items-container h-100 overflow-auto">
                    { activeOffer && activeOffer.products && (activeOffer.products.length > 0) && activeOffer.products.map((product, index) =>
                        {
                            return <CatalogProductView key={ index } isActive={ false } product={ product } />
                        }) }
                </div>
            </div>
            <div className="position-relative d-flex flex-column col-5 justify-content-center align-items-center h-100 overflow-auto">
                <div className="d-block mb-2">
                    <img alt="" src={ GetCatalogPageImage(pageParser, 1) } />
                </div>
                <div className="fs-6 text-center text-black lh-sm overflow-hidden">{ GetCatalogPageText(pageParser, 0) }</div>
                { activeOffer && <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } /> }
            </div>
        </div>
    );
}
