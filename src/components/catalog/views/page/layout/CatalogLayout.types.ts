import { ICatalogPage } from '../../../common/ICatalogPage';

export interface CatalogLayoutProps
{
    page: ICatalogPage;
    hideNavigation: () => void;
}
