import { FC, useEffect, useMemo, useState } from "react"
import { GetSessionDataManager, LocalizeText, RoomObjectItem } from "../../../../api"
import { DraggableWindowPosition, InfiniteScroll, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"

interface ChooserWidgetViewProps
{
    title: string;
    items: RoomObjectItem[];
    selectItem: (item: RoomObjectItem) => void;
    onClose: () => void;
}

export const ChooserWidgetView: FC<ChooserWidgetViewProps> = props =>
{
    const { title = null, items = [], selectItem = null, onClose = null } = props
    const [ selectedItem, setSelectedItem ] = useState<RoomObjectItem>(null)
    const [ searchValue, setSearchValue ] = useState("")
    const canSeeId = GetSessionDataManager().isModerator

    const filteredItems = useMemo(() =>
    {
        const value = searchValue.toLocaleLowerCase()

        return items.filter(item => item.name?.toLocaleLowerCase().includes(value))
    }, [ items, searchValue ])

    useEffect(() =>
    {
        if(!selectedItem) return

        selectItem(selectedItem)
    }, [ selectedItem, selectItem ])

    return (
        <NitroCardView uniqueKey="chooser" className="illumina-chooser h-[167px] max-h-[70vh] min-h-[167px] w-[203px] resize-y overflow-auto" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText={ title } onCloseClick={ onClose } />
            <NitroCardContentView>
                <input type="text" className="illumina-input mb-[5px] h-[25px] shrink-0 px-[9px] !text-xs placeholder:italic" placeholder={ LocalizeText("generic.search") } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
                <InfiniteScroll className="illumina-scrollbar relative w-full" rows={ filteredItems } rowRender={ row => {
                    return (
                        <div className={`flex cursor-pointer justify-between gap-2.5 px-[9px] py-[5px] even:bg-[#EEEEEE] dark:even:bg-[#33312B] ${selectedItem === row && "!bg-[#CCCCCC] dark:!bg-[#211d19]"}`} onClick={ event => setSelectedItem(row) }>
                            <p className="w-full truncate text-clip font-volter text-[9px]">{ row.name }</p>
                            <p className="text-right font-volter text-[9px]">{ canSeeId && (`${row.id}`) }</p>
                        </div>
                    )
                }} />
            </NitroCardContentView>
        </NitroCardView>
    )
}
