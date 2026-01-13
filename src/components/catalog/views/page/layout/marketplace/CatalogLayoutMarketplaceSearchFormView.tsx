import { FC, useCallback, useEffect, useState } from "react"
import { IMarketplaceSearchOptions, LocalizeText, MarketplaceSearchType } from "../../../../../../api"
import { Button } from "../../../../../../common"

export interface SearchFormViewProps
{
    searchType: number;
    sortTypes: number[];
    onSearch(options: IMarketplaceSearchOptions): void;
}

export const SearchFormView: FC<SearchFormViewProps> = props =>
{
    const { searchType = null, sortTypes = null, onSearch = null } = props
    const [ sortType, setSortType ] = useState(sortTypes ? sortTypes[0] : 3) // first item of SORT_TYPES_ACTIVITY
    const [ searchQuery, setSearchQuery ] = useState("")
    const [ min, setMin ] = useState(0)
    const [ max, setMax ] = useState(0)
    
    const onSortTypeChange = useCallback((sortType: number) =>
    {
        setSortType(sortType)

        if((searchType === MarketplaceSearchType.BY_ACTIVITY) || (searchType === MarketplaceSearchType.BY_VALUE)) onSearch({ minPrice: -1, maxPrice: -1, query: "", type: sortType })
    }, [ onSearch, searchType ])

    const onClickSearch = useCallback(() =>
    {
        const minPrice = ((min > 0) ? min : -1)
        const maxPrice = ((max > 0) ? max : -1)

        onSearch({ minPrice: minPrice, maxPrice: maxPrice, type: sortType, query: searchQuery })
    }, [ max, min, onSearch, searchQuery, sortType ])

    useEffect(() => 
    {
        if(!sortTypes || !sortTypes.length) return
        
        const sortType = sortTypes[0]

        setSortType(sortType)

        if(searchType === MarketplaceSearchType.BY_ACTIVITY || MarketplaceSearchType.BY_VALUE === searchType) onSearch({ minPrice: -1, maxPrice: -1, query: "", type: sortType })
    }, [ onSearch, searchType, sortTypes ])

    return (
        <div className="illumina-furni-item mt-[5px] flex h-[120px] w-[360px] flex-col items-center justify-center">
            { searchType === MarketplaceSearchType.ADVANCED
                ? <div className="flex flex-col p-[10px_10px_8px_13px]">
                    <div className="mb-[5px] flex w-full">
                        <p className="w-[117px] shrink-0 text-sm text-[#6A6A6A]">{ LocalizeText("catalog.marketplace.search_name") }</p>
                        <input className="illumina-input h-5 w-full px-2.5" type="text" value={ searchQuery } onChange={ event => setSearchQuery(event.target.value) }/>
                    </div>
                    <div className="mb-[5px] flex w-full">
                        <p className="w-[117px] shrink-0 text-sm text-[#6A6A6A]">{ LocalizeText("catalog.marketplace.search_price") }</p>
                        <div className="flex w-full items-center justify-between">
                            <input className="illumina-input h-5 w-[70px] px-2.5" type="number" min={ 0 } value={ min } onChange={ event => setMin(event.target.valueAsNumber) } />
                            <input className="illumina-input h-5 w-[70px] px-2.5" type="number" min={ 0 } value={ max } onChange={ event => setMax(event.target.valueAsNumber) } />
                        </div>
                    </div>
                    <div className="mb-[5px] flex w-full">
                        <p className="w-[117px] shrink-0 text-sm text-[#6A6A6A]">{ LocalizeText("catalog.marketplace.sort_order") }</p>
                        <div className="illumina-select relative flex h-6 w-full items-center gap-[3px] px-2.5">
                            <select className="w-full" value={ sortType } onChange={ event => onSortTypeChange(parseInt(event.target.value)) }>
                                { sortTypes.map(type => <option className="!text-black" key={ type } value={ type }>{ LocalizeText(`catalog.marketplace.sort.${ type }`) }</option>) }
                            </select>
                            <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={ onClickSearch }>{ LocalizeText("generic.search") }</Button>
                    </div>
                </div>
                : <div className="flex flex-col items-center gap-3.5">
                    <p className="text-sm text-[#6C6C6C]">{ LocalizeText("catalog.marketplace.sort_order") }</p>
                    <div className="illumina-select relative flex h-6 items-center gap-[3px] px-2.5">
                        <select className="w-full" value={ sortType } onChange={ event => onSortTypeChange(parseInt(event.target.value)) }>
                            { sortTypes.map(type => <option className="!text-black" key={ type } value={ type }>{ LocalizeText(`catalog.marketplace.sort.${ type }`) }</option>) }
                        </select>
                        <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                    </div>
                </div> }
        </div>
    )
}
