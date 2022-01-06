import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../../../api';
import { IMarketplaceSearchOptions } from '../common/IMarketplaceSearchOptions';
import { MarketplaceSearchType } from '../common/MarketplaceSearchType';

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
        if(searchType === MarketplaceSearchType.BY_ACTIVITY || searchType === MarketplaceSearchType.BY_VALUE)
            onSearch({ minPrice: -1, maxPrice: -1, query: '', type: sortType });
    }, [onSearch, searchType]);

    const onClickSearch = useCallback(() =>
    {
        const minPrice = min > 0 ? min : -1;
        const maxPrice = max > 0 ? max : -1;

        onSearch({ minPrice: minPrice, maxPrice: maxPrice, type: sortType, query: searchQuery })
    }, [max, min, onSearch, searchQuery, sortType]);

    useEffect( () => 
    {
        if(!sortTypes || !sortTypes.length) return;
        
        const sortType = sortTypes[0];
        setSortType(sortType);

        if(searchType === MarketplaceSearchType.BY_ACTIVITY || MarketplaceSearchType.BY_VALUE === searchType)
            onSearch({ minPrice: -1, maxPrice: -1, query: '', type: sortType });
    }, [onSearch, searchType, sortTypes]);

    return (<>
        <div className="d-flex flex-row text-black">
            <div className="mr-2 align-self-center col-4" style={ { whiteSpace: 'nowrap' } }>{ LocalizeText('catalog.marketplace.sort_order') }</div>
            <select className="form-control form-control-sm" value={sortType} onChange={ (event) => onSortTypeChange(parseInt(event.target.value)) }>
                { sortTypes.map( (type, index) => <option key={index} value={type}>{ LocalizeText(`catalog.marketplace.sort.${type}`) }</option>)}
            </select>
        </div>
        { searchType === MarketplaceSearchType.ADVANCED && <>
            <div className="d-flex flex-row text-black">
                <div className="mr-2 align-self-center col-4" style={ { whiteSpace: 'nowrap' } }>{ LocalizeText('catalog.marketplace.search_name') }</div>
                <input className="form-control form-control-sm" type="text" value={ searchQuery} onChange={event => setSearchQuery(event.target.value)}/>
            </div>

            <div className="d-flex flex-row text-black">
                <div className="mr-2 align-self-center col-4" style={ { whiteSpace: 'nowrap' } }>{ LocalizeText('catalog.marketplace.search_price') }</div>
                <input className="form-control form-control-sm" type="number" min={0} value={ min } onChange={ event => setMin(event.target.valueAsNumber) } />
                <input className="form-control form-control-sm" type="number" min={0} value={ max } onChange={ event => setMax(event.target.valueAsNumber) } />
            </div>

            <button className="btn btn-secondary btn-sm float-end mx-auto" onClick={onClickSearch}>{ LocalizeText('generic.search') }</button>
        </>
        }
    </>);
}
