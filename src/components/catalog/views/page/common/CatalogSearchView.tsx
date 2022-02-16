import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IFurnitureData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../../api';
import { Button } from '../../../../../common/Button';
import { Flex } from '../../../../../common/Flex';
import { BatchUpdates } from '../../../../../hooks';
import { useCatalogContext } from '../../../CatalogContext';
import { CatalogPage } from '../../../common/CatalogPage';
import { CatalogType } from '../../../common/CatalogType';
import { FilterCatalogNode, GetOfferNodes } from '../../../common/CatalogUtilities';
import { FurnitureOffer } from '../../../common/FurnitureOffer';
import { ICatalogNode } from '../../../common/ICatalogNode';
import { ICatalogPage } from '../../../common/ICatalogPage';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';
import { PageLocalization } from '../../../common/PageLocalization';
import { SearchResult } from '../../../common/SearchResult';

export const CatalogSearchView: FC<{}> = props =>
{
    const [ searchValue, setSearchValue ] = useState('');
    const [ needsProcessing, setNeedsProcessing ] = useState(false);
    const { currentType = null, rootNode = null, setActiveNodes = null, offersToNodes = null, searchResult = null, setSearchResult = null, setCurrentPage = null } = useCatalogContext();

    const updateSearchValue = (value: string) =>
    {
        BatchUpdates(() =>
        {
            if(!value || !value.length)
            {
                setSearchValue('');

                if(searchResult) setSearchResult(null);
            }
            else
            {
                setSearchValue(value);
                setNeedsProcessing(true);
            }
        });
    }

    const processSearch = useCallback((search: string) =>
    {
        setNeedsProcessing(false);

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

                    if(foundFurniture.length === 250) break;
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
        });
    }, [ offersToNodes, currentType, rootNode, setCurrentPage, setSearchResult ]);

    useEffect(() =>
    {
        if(!needsProcessing) return;

        const timeout = setTimeout(() => processSearch(searchValue), 300);

        return () => clearTimeout(timeout);
    }, [ searchValue, needsProcessing, processSearch ]);

    return (
        <Flex gap={ 1 }>
            <Flex fullWidth alignItems="center" position="relative">
                <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchValue } onChange={ event => updateSearchValue(event.target.value) } onKeyDown={ event => ((event.code === 'Enter') || (event.code === 'NumpadEnter')) && processSearch(searchValue) } />
            </Flex>
            { (!searchValue || !searchValue.length) &&
                <Button variant="primary" size="sm" className="catalog-search-button">
                    <FontAwesomeIcon icon="search" />
                </Button> }
            { searchValue && !!searchValue.length &&
                <Button variant="primary" size="sm" className="catalog-search-button" onClick={ event => updateSearchValue('') }>
                    <FontAwesomeIcon icon="times" />
                </Button> }
        </Flex>
    );
}
