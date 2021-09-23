import { FC } from 'react';
import { CatalogLayoutPets3View } from '../pets3/CatalogLayoutPets3View';
import { CatalogLayoutPets2ViewProps } from './CatalogLayoutPets2View.types';

export const CatalogLayoutPets2View: FC<CatalogLayoutPets2ViewProps> = props =>
{
    return <CatalogLayoutPets3View { ...props } />
}
