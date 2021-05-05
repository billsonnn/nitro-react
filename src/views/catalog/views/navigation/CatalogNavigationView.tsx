import { FC } from 'react';
import { CatalogNavigationViewProps } from './CatalogNavigationView.types';
import { CatalogNavigationSetView } from './set/CatalogNavigationSetView';

export const CatalogNavigationView: FC<CatalogNavigationViewProps> = props =>
{
    const { page = null } = props;
    
    return (
        <div className="nitro-catalog-navigation border border-2 rounded overflow-hidden">
            <div className="navigation-container m-1">
                <CatalogNavigationSetView page={ page } isFirstSet={ true } />
            </div>
        </div>
    );
}
