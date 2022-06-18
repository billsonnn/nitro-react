import { ICatalogPage } from '../../../../../api';

export interface CatalogLayoutProps
{
    page: ICatalogPage;
    hideNavigation: () => void;
}
