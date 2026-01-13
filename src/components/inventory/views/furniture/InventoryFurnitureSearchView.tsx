import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { GroupItem, LocalizeText } from "../../../../api"
import { Button } from "../../../../common"

export interface InventoryFurnitureSearchViewProps
{
    groupItems: GroupItem[];
    setGroupItems: Dispatch<SetStateAction<GroupItem[]>>;
}

export const InventoryFurnitureSearchView: FC<InventoryFurnitureSearchViewProps> = props =>
{
    const { groupItems = [], setGroupItems = null } = props
    const [ searchValue, setSearchValue ] = useState("")

    useEffect(() =>
    {
        let filteredGroupItems = [ ...groupItems ]

        if(searchValue && searchValue.length)
        {
            const comparison = searchValue.toLocaleLowerCase()

            filteredGroupItems = groupItems.filter(item =>
            {
                if(comparison && comparison.length)
                {
                    if(item.name.toLocaleLowerCase().includes(comparison)) return item
                }

                return null
            })
        }

        setGroupItems(filteredGroupItems)
    }, [ groupItems, setGroupItems, searchValue ])

    return (
        <div className="flex items-center gap-1.5">
            <div className="illumina-input relative h-[25px] w-[165px]">
                <input type="text" className="absolute left-0 top-0 size-full bg-transparent px-[9px] text-[13px] text-black" placeholder={ LocalizeText("generic.search") } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
            </div>
            <Button variant="primary">{ LocalizeText("generic.search") }</Button>
        </div>
    )
}
