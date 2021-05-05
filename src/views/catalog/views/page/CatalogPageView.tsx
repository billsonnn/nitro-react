import { FC } from 'react';
import { useCatalogContext } from '../../context/CatalogContext';
import { CatalogPageViewProps } from './CatalogPageView.types';
import { GetCatalogLayout } from './layout/GetCatalogLayout';

export const CatalogPageView: FC<CatalogPageViewProps> = props =>
{
    const { catalogState = null } = useCatalogContext();
    const { pageParser = null } = catalogState;

    return (
        <div className="row h-100">
            <div className="col-7">
                { pageParser && GetCatalogLayout(pageParser) }
            </div>
            <div className="col">
                preview area
            </div>
        </div>
    );
}
