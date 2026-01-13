import { CatalogGroupsComposer, StringDataType } from "@nitrots/nitro-renderer"
import { FC, useEffect, useMemo, useState } from "react"
import { CreateLinkEvent, LocalizeText, SendMessageComposer } from "../../../../../api"
import { Button } from "../../../../../common"
import { useCatalog } from "../../../../../hooks"
import { CatalogPurchaseWidgetView } from "./CatalogPurchaseWidgetView"

export const CatalogGuildSelectorWidgetView: FC<{}> = props =>
{
    const [ selectedGroupIndex, setSelectedGroupIndex ] = useState<number>(0)
    const { currentOffer = null, catalogOptions = null, setPurchaseOptions = null } = useCatalog()
    const { groups = null } = catalogOptions

    const previewStuffData = useMemo(() =>
    {
        if(!groups || !groups.length) return null

        const group = groups[selectedGroupIndex]

        if(!group) return null

        const stuffData = new StringDataType()

        stuffData.setValue([ "0", group.groupId.toString(), group.badgeCode, group.colorA, group.colorB ])

        return stuffData
    }, [ selectedGroupIndex, groups ])

    useEffect(() =>
    {
        if(!currentOffer) return

        setPurchaseOptions(prevValue =>
        {
            const newValue = { ...prevValue }

            newValue.extraParamRequired = true
            newValue.extraData = ((previewStuffData && previewStuffData.getValue(1)) || null)
            newValue.previewStuffData = previewStuffData

            return newValue
        })
    }, [ currentOffer, previewStuffData, setPurchaseOptions ])

    useEffect(() =>
    {
        SendMessageComposer(new CatalogGroupsComposer())
    }, [])

    if(!groups || !groups.length)
    {
        return (
            <div className="mt-3 flex items-center justify-center">
                <div className="illumina-catalogue-info flex max-w-[200px] flex-col items-center p-2.5">
                    <p className="mb-1.5 w-full text-sm text-white">{ LocalizeText("catalog.guild_selector.members_only") }</p>
                    <Button className="w-fit" onClick={ event => CreateLinkEvent("navigator/toggle") }>
                        { LocalizeText("catalog.guild_selector.find_groups") }
                    </Button>
                </div>
            </div>
        )
    }

    const selectedGroup = groups[selectedGroupIndex]

    return (<div className="flex h-[57px] flex-col justify-end">
        <div className="mb-2.5 flex w-full items-center justify-center">
            <div className="illumina-card-filter relative flex h-[26px] w-[170px] items-center gap-[3px] px-2.5">
                <select className="w-full text-[13px]" value={ selectedGroupIndex } onChange={ event => setSelectedGroupIndex(parseInt(event.target.value)) }>
                    { groups.map((group, index) => <option className="!text-black" key={ index } value={ index }>{ group.groupName }</option>) }
                </select>
                { !!selectedGroup &&
                    <div className="flex h-3 w-5 items-center border border-black">
                        <div className="h-full" style={ { width: "10px", backgroundColor: "#" + selectedGroup.colorA } } />
                        <div className="h-full" style={ { width: "10px", backgroundColor: "#" + selectedGroup.colorB } } />
                    </div> }
                <i className="pointer-events-none ml-2.5 mt-[3px] h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px] bg-no-repeat" />
            </div>
        </div>
        <CatalogPurchaseWidgetView />
    </div>)
}
