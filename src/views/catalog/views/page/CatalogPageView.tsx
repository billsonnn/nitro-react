import { FC } from 'react';
import { useCatalogContext } from '../../context/CatalogContext';
import { CatalogPageViewProps } from './CatalogPageView.types';
import { GetCatalogLayout } from './layout/GetCatalogLayout';
import { CatalogLayoutSearchResultView } from './search-result/CatalogLayoutSearchResultView';

export const CatalogPageView: FC<CatalogPageViewProps> = props =>
{
    const { roomPreviewer = null } = props;
    const { catalogState = null } = useCatalogContext();
    const { pageParser = null, searchResult = null } = catalogState;

    if(searchResult && searchResult.furniture)
    {
        return <CatalogLayoutSearchResultView roomPreviewer={ roomPreviewer } furnitureDatas={ searchResult.furniture } />;
    }

    return ((pageParser && GetCatalogLayout(pageParser, roomPreviewer)) || null);
}
