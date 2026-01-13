import { GroupSaveBadgeComposer } from "@nitrots/nitro-renderer"
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react"
import { GroupBadgePart, IGroupData, LocalizeText, SendMessageComposer } from "../../../../api"
import { LayoutBadgeImageView } from "../../../../common"
import { useGroup } from "../../../../hooks"
import { GroupBadgeCreatorView } from "../GroupBadgeCreatorView"

interface GroupTabBadgeViewProps
{
    skipDefault?: boolean;
    setCloseAction: Dispatch<SetStateAction<{ action: () => boolean }>>;
    groupData: IGroupData;
    setGroupData: Dispatch<SetStateAction<IGroupData>>;
}

export const GroupTabBadgeView: FC<GroupTabBadgeViewProps> = props =>
{
    const { groupData = null, setGroupData = null, setCloseAction = null, skipDefault = null } = props
    const [ badgeParts, setBadgeParts ] = useState<GroupBadgePart[]>(null)
    const { groupCustomize = null } = useGroup()

    const getModifiedBadgeCode = () =>
    {
        if(!badgeParts || !badgeParts.length) return ""

        let badgeCode = ""

        badgeParts.forEach(part => (part.code && (badgeCode += part.code)))

        return badgeCode
    }

    const saveBadge = useCallback(() =>
    {
        if(!groupData || !badgeParts || !badgeParts.length) return false

        if((groupData.groupBadgeParts === badgeParts)) return true

        if(groupData.groupId <= 0)
        {
            setGroupData(prevValue =>
            {
                const newValue = { ...prevValue }

                newValue.groupBadgeParts = badgeParts

                return newValue
            })

            return true
        }

        const badge = []

        badgeParts.forEach(part =>
        {
            if(!part.code) return
            
            badge.push(part.key)
            badge.push(part.color)
            badge.push(part.position)
        })
        
        SendMessageComposer(new GroupSaveBadgeComposer(groupData.groupId, badge))

        return true
    }, [ groupData, badgeParts, setGroupData ])

    useEffect(() =>
    {
        if(groupData.groupBadgeParts) return
        
        const badgeParts = [
            new GroupBadgePart(GroupBadgePart.BASE, groupCustomize.badgeBases[4].id, groupCustomize.badgePartColors[10].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, groupCustomize.badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, groupCustomize.badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, groupCustomize.badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 6, groupCustomize.badgePartColors[10].id)
        ]

        setGroupData(prevValue =>
        {
            const groupBadgeParts = badgeParts

            return { ...prevValue, groupBadgeParts }
        })
    }, [ groupData.groupBadgeParts, groupCustomize, setGroupData ])

    useEffect(() =>
    {
        if(groupData.groupId <= 0)
        {
            setBadgeParts(groupData.groupBadgeParts ? [ ...groupData.groupBadgeParts ] : null)

            return
        }
        
        setBadgeParts(groupData.groupBadgeParts)
    }, [ groupData ])

    useEffect(() =>
    {
        setCloseAction({ action: saveBadge })

        return () => setCloseAction(null)
    }, [ setCloseAction, saveBadge ])
    
    return (
        <div className="flex gap-5">
            <div className="flex flex-col">
                <p className="mb-[5px] text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.badge.badge") }</p>
                <div className="illumina-previewer relative flex size-[94px] shrink-0 items-center justify-center overflow-hidden p-[3px]">
                    <LayoutBadgeImageView badgeCode={ getModifiedBadgeCode() } isGroup={ true } />
                </div>
            </div>
            <div className="flex w-full flex-col">
                <GroupBadgeCreatorView badgeParts={ badgeParts } setBadgeParts={ setBadgeParts } />
            </div>
        </div>
    )
}
