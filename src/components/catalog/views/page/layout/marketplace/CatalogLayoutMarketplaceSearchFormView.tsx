import { FC, useCallback, useEffect, useState } from 'react';
import { IMarketplaceSearchOptions, LocalizeText, MarketplaceSearchType } from '../../../../../../api';
import { Button, Column, Flex, Text } from '../../../../../../common';

export interface SearchFormViewProps
{
    searchType: number;
    sortTypes: number[];
    onSearch(options: IMarketplaceSearchOptions): void;
}

export const SearchFormView: FC<SearchFormViewProps> = props =>
{
    const { searchType = null, sortTypes = null, onSearch = null } = props;
    const [ sortType, setSortType ] = useState(sortTypes ? sortTypes[0] : 3); // first item of SORT_TYPES_ACTIVITY
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ min, setMin ] = useState(0);
    const [ max, setMax ] = useState(0);
    
    const onSortTypeChange = useCallback((sortType: number) =>
    {
        setSortType(sortType);

        if((searchType === MarketplaceSearchType.BY_ACTIVITY) || (searchType === MarketplaceSearchType.BY_VALUE)) onSearch({ minPrice: -1, maxPrice: -1, query: '', type: sortType });
    }, [ onSearch, searchType ]);

    const onClickSearch = useCallback(() =>
    {
        const minPrice = ((min > 0) ? min : -1);
        const maxPrice = ((max > 0) ? max : -1);

        onSearch({ minPrice: minPrice, maxPrice: maxPrice, type: sortType, query: searchQuery })
    }, [ max, min, onSearch, searchQuery, sortType ]);

    useEffect( () => 
    {
        if(!sortTypes || !sortTypes.length) return;
        
        const sortType = sortTypes[0];

        setSortType(sortType);

        if(searchType === MarketplaceSearchType.BY_ACTIVITY || MarketplaceSearchType.BY_VALUE === searchType) onSearch({ minPrice: -1, maxPrice: -1, query: '', type: sortType });
    }, [ onSearch, searchType, sortTypes ]);

    return (
        <Column gap={ 1 }>
            <Flex alignItems="center" gap={ 1 }>
                <Text className="col-3">{ LocalizeText('catalog.marketplace.sort_order') }</Text>
                <select className="form-select form-select-sm" value={ sortType } onChange={ event => onSortTypeChange(parseInt(event.target.value)) }>
                    { sortTypes.map(type => <option key={ type } value={ type }>{ LocalizeText(`catalog.marketplace.sort.${ type }`) }</option>) }
                </select>
            </Flex>
            { searchType === MarketplaceSearchType.ADVANCED &&
                <>
                    <Flex alignItems="center" gap={ 1 }>
                        <Text className="col-3">{ LocalizeText('catalog.marketplace.search_name') }</Text>
                        <input className="form-control form-control-sm" type="text" value={ searchQuery } onChange={ event => setSearchQuery(event.target.value) }/>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <Text className="col-3">{ LocalizeText('catalog.marketplace.search_price') }</Text>
                        <Flex fullWidth gap={ 1 }>
                            <input className="form-control form-control-sm" type="number" min={ 0 } value={ min } onChange={ event => setMin(event.target.valueAsNumber) } />
                            <input className="form-control form-control-sm" type="number" min={ 0 } value={ max } onChange={ event => setMax(event.target.valueAsNumber) } />
                        </Flex>
                    </Flex>
                    <Button variant="secondary" className="mx-auto" onClick={ onClickSearch }>{ LocalizeText('generic.search') }</Button>
                </> }
        </Column>
    );
}
