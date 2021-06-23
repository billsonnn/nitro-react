import { FC } from 'react';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogIconView } from '../../catalog-icon/CatalogIconView';
import { CatalogPageHeaderViewProps } from './CatalogPageHeaderView.types';

export const CatalogPageHeaderView: FC<CatalogPageHeaderViewProps> = props =>
{
    const { catalogState = null } = useCatalogContext();
    const { currentPage = null, pageParser = null } = catalogState;

    return (
        <div className="container-fluid nitro-catalog-page-header bg-light">
            <div className="row h-100">
                <div className="col-2">
                    <CatalogIconView icon={ currentPage.icon } />
                </div>
                <div className="d-flex col-10 flex-column">
                    <div className="d-block">
                        { currentPage.localization }
                    </div>
                    { pageParser && <div className="d-block">
                        { pageParser.localization.texts[0] }
                    </div> }
                </div>
            </div>
        </div>
    );
}
