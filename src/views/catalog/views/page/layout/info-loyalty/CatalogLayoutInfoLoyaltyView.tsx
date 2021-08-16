import { FC } from 'react';
import { GetCatalogPageText } from '../../../../common/CatalogUtilities';
import { CatalogLayoutInfoLoyaltyViewProps } from './CatalogLayoutInfoLoyaltyView.types';

export const CatalogLayoutInfoLoyaltyView: FC<CatalogLayoutInfoLoyaltyViewProps> = props =>
{
    const { pageParser = null } = props;
    
    return (
        <div className="h-100 nitro-catalog-layout-info-loyalty text-black d-flex flex-row">
            <div className="overflow-auto h-100 d-flex flex-column info-loyalty-content">
                <div dangerouslySetInnerHTML={ { __html: GetCatalogPageText(pageParser, 0) } } />
            </div>
        </div>
    );
}
