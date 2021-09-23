import { IFurnitureData, INodeData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../api';
import { GetOfferNodes } from '../../common/CatalogUtilities';
import { useCatalogContext } from '../../context/CatalogContext';
import { CatalogActions } from '../../reducers/CatalogReducer';
import { CatalogSearchViewProps } from './CatalogSearchView.types';

export const CatalogSearchView: FC<CatalogSearchViewProps> = props =>
{
    const [ searchValue, setSearchValue ] = useState('');
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { offerRoot = null, searchResult = null } = catalogState;

    useEffect(() =>
    {
        setSearchValue(prevValue =>
            {
                if(!searchResult && prevValue && prevValue.length) return '';

                return prevValue;
            });
    }, [ searchResult ]);

    const processSearch = useCallback((search: string) =>
    {
        if(!search || !search.length || !offerRoot)
        {
            dispatchCatalogState({
                type: CatalogActions.SET_SEARCH_RESULT,
                payload: {
                    searchResult: null
                }
            });

            return;
        }

        search = search.toLocaleLowerCase();

        const furnitureData = GetSessionDataManager().getAllFurnitureData({
            loadFurnitureData: null
        });

        if(!furnitureData) return;

        const foundPages: INodeData[] = [];
        const foundFurniture: IFurnitureData[] = [];

        for(const furniture of furnitureData)
        {
            if((furniture.purchaseOfferId === -1) && (furniture.rentOfferId === -1)) continue;
            
            const pages = [
                ...GetOfferNodes(offerRoot, furniture.purchaseOfferId),
                ...GetOfferNodes(offerRoot, furniture.rentOfferId)
            ];

            if(!pages.length) continue;

            const searchValue = [ furniture.className, furniture.name ].join(' ').toLocaleLowerCase();

            if(searchValue.indexOf(search) === -1) continue;

            foundPages.push(...pages);
            foundFurniture.push(furniture);
        }

        const uniquePages = foundPages.filter((value, index, self) =>
        {
            return (self.indexOf(value) === index);
        });

        const catalogPage: INodeData = {
            visible: true,
            icon: 0,
            pageId: -1,
            pageName: LocalizeText('generic.search'),
            localization: LocalizeText('generic.search'),
            children: [ ...uniquePages ],
            offerIds: []
        };
        
        dispatchCatalogState({
            type: CatalogActions.SET_SEARCH_RESULT,
            payload: {
                searchResult: {
                    page: catalogPage,
                    furniture: foundFurniture
                }
            }
        });
    }, [ offerRoot, dispatchCatalogState ]);

    useEffect(() =>
    {
        if(!searchValue)
        {
            processSearch(searchValue);

            return;
        }

        const timeout = setTimeout(() => processSearch(searchValue), 300);

        return () =>
        {
            clearTimeout(timeout);
        }
    }, [ searchValue, processSearch ]);

    return (
        <div className="d-flex">
            <div className="d-flex flex-grow-1 me-1">
                <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
            </div>
            <div className="d-flex">
                <button type="button" className="btn btn-primary btn-sm">
                    <i className="fas fa-search"></i>
                </button>
            </div>
        </div>
    );
}
