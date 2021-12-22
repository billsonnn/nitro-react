import { FC } from 'react';
import { UseMountEffect } from '../../../../../../../hooks';
import { CatalogLayoutProps } from '../../CatalogLayout.types';

export interface CatalogLayoutMarketplacePublicItemsViewProps extends CatalogLayoutProps
{

}

export const CatalogLayoutMarketplacePublicItemsView: FC<CatalogLayoutMarketplacePublicItemsViewProps> = props =>
{
    UseMountEffect(() =>
    {
        //request stuff
    });
    
    return null;
}
