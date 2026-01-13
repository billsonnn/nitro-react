import { FC, KeyboardEvent, useEffect, useState } from "react"
import { INavigatorSearchFilter, LocalizeText, SearchFilterOptions } from "../../../../api"
import { useNavigator } from "../../../../hooks"

export interface NavigatorSearchViewProps
{
    sendSearch: (searchValue: string, contextCode: string) => void;
}

export const NavigatorSearchView: FC<NavigatorSearchViewProps> = props =>
{
    const { sendSearch = null } = props
    const [ searchFilterIndex, setSearchFilterIndex ] = useState(0)
    const [ searchValue, setSearchValue ] = useState("")
    const { topLevelContext = null, searchResult = null } = useNavigator()

    const processSearch = () =>
    {
        if(!topLevelContext) return

        let searchFilter = SearchFilterOptions[searchFilterIndex]

        if(!searchFilter) searchFilter = SearchFilterOptions[0]

        const searchQuery = ((searchFilter.query ? (searchFilter.query + ":") : "") + searchValue)

        sendSearch((searchQuery || ""), topLevelContext.code)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== "Enter") return

        processSearch()
    }

    useEffect(() =>
    {
        if(!searchResult) return

        const split = searchResult.data.split(":")

        let filter: INavigatorSearchFilter = null
        let value: string = ""

        if(split.length >= 2)
        {
            const [ query, ...rest ] = split

            filter = SearchFilterOptions.find(option => (option.query === query))
            value = rest.join(":")
        }
        else
        {
            value = searchResult.data
        }

        if(!filter) filter = SearchFilterOptions[0]

        setSearchFilterIndex(SearchFilterOptions.findIndex(option => (option === filter)))
        setSearchValue(value)
    }, [ searchResult ])

    return (
        <div className="mb-1.5 flex w-full gap-[13px]">
            <div className="illumina-card-filter relative flex h-6 w-[116px] items-center gap-[3px] px-2.5">
                <select className="text-[13px]" value={ searchFilterIndex } onChange={ event => setSearchFilterIndex(parseInt(event.target.value)) }>
                    { SearchFilterOptions.map((filter, index) => {
                        return <option className="!text-black" key={ index } value={ index }>{ LocalizeText("navigator.filter." + filter.name) }</option>
                    })}
                </select>
                <i className="pointer-events-none mt-[3px] h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px] bg-no-repeat" />
            </div>
            <div className="illumina-input relative w-full">
                <input type="text" className="size-full bg-transparent pl-[9px] pr-[25px] text-[13px] italic text-black" placeholder={ LocalizeText("navigator.filter.input.placeholder") } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } onKeyDown={ event => handleKeyDown(event) } />
                <i className="absolute right-[3px] top-[3px] h-[18px] w-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-335px_0px] bg-no-repeat" />
            </div>
        </div>
    )
}
