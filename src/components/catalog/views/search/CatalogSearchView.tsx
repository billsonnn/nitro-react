import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IFurnitureData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../api';
import { Button } from '../../../../common/Button';
import { Flex } from '../../../../common/Flex';
import { BatchUpdates } from '../../../../hooks';
import { CatalogPage } from '../../common/CatalogPage';
import { CatalogType } from '../../common/CatalogType';
import { FilterCatalogNode, GetOfferNodes } from '../../common/CatalogUtilities';
import { FurnitureOffer } from '../../common/FurnitureOffer';
import { ICatalogNode } from '../../common/ICatalogNode';
import { ICatalogPage } from '../../common/ICatalogPage';
import { IPurchasableOffer } from '../../common/IPurchasableOffer';
import { PageLocalization } from '../../common/PageLocalization';
import { SearchResult } from '../../common/SearchResult';
import { useCatalogContext } from '../../context/CatalogContext';

export const CatalogSearchView: FC<{}> = props =>
{
    const [ searchValue, setSearchValue ] = useState('');
    const { currentType = null, rootNode = null, setActiveNodes = null, offersToNodes = null, searchResult = null, setSearchResult = null, setCurrentPage = null } = useCatalogContext();

    const processSearch = useCallback((search: string) =>
    {
        search = search.toLocaleLowerCase().replace(' ', '');

        if(!search || !search.length) return;

        const furnitureDatas = GetSessionDataManager().getAllFurnitureData({
            loadFurnitureData: null
        });

        if(!furnitureDatas || !furnitureDatas.length) return;

        const foundFurniture: IFurnitureData[] = [];
        const foundFurniLines: string[] = [];

        for(const furniture of furnitureDatas)
        {
            if((currentType === CatalogType.BUILDER) && !furniture.availableForBuildersClub) continue;

            if((currentType === CatalogType.NORMAL) && furniture.excludeDynamic) continue;

            const searchValues = [ furniture.className, furniture.name, furniture.description ].join(' ').replace(/ /gi, '').toLowerCase();

            if((currentType === CatalogType.BUILDER) && (furniture.purchaseOfferId === -1) && (furniture.rentOfferId === -1))
            {
                if((furniture.furniLine !== '') && (foundFurniLines.indexOf(furniture.furniLine) < 0))
                {
                    if(searchValues.indexOf(search) >= 0) foundFurniLines.push(furniture.furniLine);
                }
            }
            else
            {
                const foundNodes = [
                    ...GetOfferNodes(offersToNodes, furniture.purchaseOfferId),
                    ...GetOfferNodes(offersToNodes, furniture.rentOfferId)
                ];

                if(foundNodes.length)
                {
                    if(searchValues.indexOf(search) >= 0) foundFurniture.push(furniture);

                    if(searchValues.length === 250) break;
                }
            }
        }

        const offers: IPurchasableOffer[] = [];

        for(const furniture of foundFurniture) offers.push(new FurnitureOffer(furniture));

        let nodes: ICatalogNode[] = [];

        FilterCatalogNode(search, foundFurniLines, rootNode, nodes);

        BatchUpdates(() =>
        {
            setCurrentPage((new CatalogPage(-1, 'default_3x3', new PageLocalization([], []), offers, false, 1) as ICatalogPage));
            setSearchResult(new SearchResult(search, offers, nodes.filter(node => (node.isVisible))));
            setActiveNodes(prevValue => prevValue.slice(0, 1));
        });
    }, [ offersToNodes, currentType, rootNode, setCurrentPage, setSearchResult, setActiveNodes ]);

    useEffect(() =>
    {
        if(!searchValue) return;
        
        const timeout = setTimeout(() => processSearch(searchValue), 300);

        return () =>
        {
            clearTimeout(timeout);
        }
    }, [ searchValue, processSearch ]);

    return (
        <Flex gap={ 1 }>
            <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } onKeyDown={ event => (event.code === 'Enter') && processSearch(searchValue) } />
            <Button variant="primary" size="sm">
                <FontAwesomeIcon icon="search" />
            </Button>
        </Flex>
    );
}
