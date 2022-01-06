import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IFurnitureData, INodeData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../api';
import { Button } from '../../../../common/Button';
import { Flex } from '../../../../common/Flex';
import { GetOfferNodes } from '../../common/CatalogUtilities';
import { useCatalogContext } from '../../context/CatalogContext';
import { CatalogActions } from '../../reducers/CatalogReducer';

export const CatalogSearchView: FC<{}> = props =>
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
        <Flex gap={ 1 }>
            <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
            <Button variant="primary" size="sm">
                <FontAwesomeIcon icon="search" />
            </Button>
        </Flex>
    );
}
