import { FC } from 'react';
import { CatalogLayoutProps } from './CatalogLayout.types';
import { CatalogLayoutPets3View } from './CatalogLayoutPets3View';

export const CatalogLayoutPets2View: FC<CatalogLayoutProps> = props =>
{
    return <CatalogLayoutPets3View { ...props } />
}
