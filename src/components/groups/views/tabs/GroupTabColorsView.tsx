import { GroupSaveColorsComposer } from "@nitrots/nitro-renderer"
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react"
import { IGroupData, LocalizeText, SendMessageComposer } from "../../../../api"
import { useGroup } from "../../../../hooks"

interface GroupTabColorsViewProps
{
    groupData: IGroupData;
    setGroupData: Dispatch<SetStateAction<IGroupData>>;
    setCloseAction: Dispatch<SetStateAction<{ action: () => boolean }>>;
}

export const GroupTabColorsView: FC<GroupTabColorsViewProps> = props =>
{
    const { groupData = null, setGroupData = null, setCloseAction = null } = props
    const [ colors, setColors ] = useState<number[]>(null)
    const { groupCustomize = null } = useGroup()

    const getGroupColor = (colorIndex: number) =>
    {
        if(colorIndex === 0) return groupCustomize.groupColorsA.find(color => (color.id === colors[colorIndex])).color

        return groupCustomize.groupColorsB.find(color => (color.id === colors[colorIndex])).color
    }

    const selectColor = (colorIndex: number, colorId: number) =>
    {
        setColors(prevValue =>
        {
            const newColors = [ ...prevValue ]

            newColors[colorIndex] = colorId

            return newColors
        })
    }

    const saveColors = useCallback(() =>
    {
        if(!groupData || !colors || !colors.length) return false

        if(groupData.groupColors === colors) return true

        if(groupData.groupId <= 0)
        {
            setGroupData(prevValue =>
            {
                const newValue = { ...prevValue }

                newValue.groupColors = [ ...colors ]

                return newValue
            })

            return true
        }
        
        SendMessageComposer(new GroupSaveColorsComposer(groupData.groupId, colors[0], colors[1]))

        return true
    }, [ groupData, colors, setGroupData ])

    useEffect(() =>
    {
        if(!groupCustomize.groupColorsA || !groupCustomize.groupColorsB || groupData.groupColors) return

        const groupColors = [ groupCustomize.groupColorsA[0].id, groupCustomize.groupColorsB[0].id ]

        setGroupData(prevValue =>
        {
            return { ...prevValue, groupColors }
        })
    }, [ groupCustomize, groupData.groupColors, setGroupData ])

    useEffect(() =>
    {
        if(groupData.groupId <= 0)
        {
            setColors(groupData.groupColors ? [ ...groupData.groupColors ] : null)

            return
        }
        
        setColors(groupData.groupColors)
    }, [ groupData ])

    useEffect(() =>
    {
        setCloseAction({ action: saveColors })

        return () => setCloseAction(null)
    }, [ setCloseAction, saveColors ])

    if(!colors) return null
    
    return (
        <div className="flex justify-between">
            <div className="mr-[23px]">
                <p className="mb-[5px] text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.color.guild.color") }</p>
                { groupData.groupColors && (groupData.groupColors.length > 0) &&
                    <div className="illumina-previewer flex gap-1 p-2">
                        <i className="h-[30px] w-9 bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] bg-[-501px_-124px]" style={ { backgroundColor: "#" + getGroupColor(0) } } />
                        <i className="h-[30px] w-9 bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] bg-[-501px_-124px]" style={ { backgroundColor: "#" + getGroupColor(1) } } />
                    </div> }
            </div>
            <div className="flex gap-[17px]">
                <div className="w-[135px]">
                    <p className="mb-[5px] text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.color.primary.color") }</p>
                    <div className="grid w-full grid-cols-9">
                        { groupData.groupColors && groupCustomize.groupColorsA && groupCustomize.groupColorsA.map((item, index) => (
                            <div key={ index } className={`size-[15px] bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] ${(colors[0] === item.id) ? "z-10 bg-[-407px_-124px]" : "bg-[-391px_-124px]"}`} style={ { backgroundColor: "#" + item.color } } onClick={ () => selectColor(0, item.id) }></div>
                        ))}
                    </div>
                </div>
                <div className="w-[90px]">
                    <p className="mb-[5px] text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.color.secondary.color") }</p>
                    <div className="grid w-full grid-cols-6">
                        { groupData.groupColors && groupCustomize.groupColorsB && groupCustomize.groupColorsB.map((item, index) => (
                            <div key={ index } className={`size-[15px] bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] ${(colors[1] === item.id) ? "z-10 bg-[-407px_-124px]" : "bg-[-391px_-124px]"}`} style={ { backgroundColor: "#" + item.color } } onClick={ () => selectColor(1, item.id) }></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
