import { FC } from 'react';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutInfoLoyaltyView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    
    return (
        <div className="h-100 nitro-catalog-layout-info-loyalty text-black d-flex flex-row">
            <div className="overflow-auto h-100 d-flex flex-column info-loyalty-content">
                <div dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
            </div>
        </div>
    );
}
