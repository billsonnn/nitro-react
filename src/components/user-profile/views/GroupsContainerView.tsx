import { GroupInformationComposer, GroupInformationParser, HabboGroupEntryData } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { GetGroupInformation, LocalizeText, SendMessageComposer, ToggleFavoriteGroup } from "../../../api"
import { GridProps, LayoutBadgeImageView } from "../../../common"

interface GroupsContainerViewProps extends GridProps
{
    itsMe: boolean;
    groups: HabboGroupEntryData[];
}

export const GroupsContainerView: FC<GroupsContainerViewProps> = props =>
{
    const { itsMe = null, groups = null, ...rest } = props
    const [ selectedGroupId, setSelectedGroupId ] = useState<number>(null)
    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null)

    useEffect(() =>
    {
        if(!selectedGroupId) return
        
        SendMessageComposer(new GroupInformationComposer(selectedGroupId, false))
    }, [ selectedGroupId ])

    useEffect(() =>
    {
        setGroupInformation(null)

        if(groups.length > 0)
        {
            setSelectedGroupId(prevValue =>
            {
                if(prevValue === groups[0].groupId)
                {
                    SendMessageComposer(new GroupInformationComposer(groups[0].groupId, false))
                }

                return groups[0].groupId
            })
        }
    }, [ groups ])

    if(!groups || !groups.length) return (
        <p className="!dark:text-[#cccccc] text-xs font-semibold !leading-3 text-[#1B1B1B]  [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
            {itsMe
                ? LocalizeText("extendedprofile.nogroups.me")
                : LocalizeText("extendedprofile.nogroups.user")
            }
        </p>
    )
    
    return (
        <div className="flex items-center gap-3">
            { groups.map((group, index) => (
                <div key={ index } className="relative !size-auto cursor-pointer">
                    { itsMe && <i className={ "block size-3.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] absolute -right-0.5 -top-0.5 z-20 " + (group.favourite ? "bg-[-330px_-103px]" : "bg-[-315px_-103px]") } onClick={ () => ToggleFavoriteGroup(group) } /> }
                    <LayoutBadgeImageView badgeCode={ group.badgeCode } isGroup={ true } isShadow={ true } onClick={ () => GetGroupInformation(group.groupId) } />
                </div>
            ))}
        </div>
    )
}
