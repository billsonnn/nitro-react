import { GroupBadgePart, GroupInformationEvent, GroupSettingsEvent } from "@nitrots/nitro-renderer"
import { FC, useState } from "react"
import { IGroupData, LocalizeText } from "../../../api"
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from "../../../common"
import { useMessageEvent } from "../../../hooks"
import { GroupTabBadgeView } from "./tabs/GroupTabBadgeView"
import { GroupTabColorsView } from "./tabs/GroupTabColorsView"
import { GroupTabIdentityView } from "./tabs/GroupTabIdentityView"
import { GroupTabSettingsView } from "./tabs/GroupTabSettingsView"

const TABS: number[] = [ 1, 2, 3, 5 ]

export const GroupManagerView: FC<{}> = props =>
{
    const [ currentTab, setCurrentTab ] = useState<number>(1)
    const [ closeAction, setCloseAction ] = useState<{ action: () => boolean }>(null)
    const [ groupData, setGroupData ] = useState<IGroupData>(null)

    const TAB_HEAD_IMAGE = {
        1: {
            position: "bg-[-131px_-43px]"
        },
        2: {
            position: "bg-[-247px_-37px]"
        },
        3: {
            position: "bg-[-361px_-38px]"
        },
        4: {
            position: "bg-[-10px_-37px]"
        },
        5: {
            position: "bg-[-10px_-37px]"
        }
    }

    const onClose = () =>
    {
        setCloseAction(prevValue =>
        {
            if(prevValue && prevValue.action) prevValue.action()

            return null
        })

        setGroupData(null)
    }

    const changeTab = (tab: number) =>
    {
        if(closeAction && closeAction.action) closeAction.action()

        setCurrentTab(tab)
    }

    useMessageEvent<GroupInformationEvent>(GroupInformationEvent, event =>
    {
        const parser = event.getParser()

        if(!groupData || (groupData.groupId !== parser.id)) return

        setGroupData(prevValue =>
        {
            const newValue = { ...prevValue }

            newValue.groupName = parser.title
            newValue.groupDescription = parser.description
            newValue.groupState = parser.type
            newValue.groupCanMembersDecorate = parser.canMembersDecorate

            return newValue
        })
    })

    useMessageEvent<GroupSettingsEvent>(GroupSettingsEvent, event =>
    {
        const parser = event.getParser()

        const groupBadgeParts: GroupBadgePart[] = []

        parser.badgeParts.forEach((part, id) =>
        {
            groupBadgeParts.push(new GroupBadgePart(
                part.isBase ? GroupBadgePart.BASE : GroupBadgePart.SYMBOL,
                part.key,
                part.color,
                part.position
            ))
        })

        setGroupData({
            groupId: parser.id,
            groupName: parser.title,
            groupDescription: parser.description,
            groupHomeroomId: parser.roomId,
            groupState: parser.state,
            groupCanMembersDecorate: parser.canMembersDecorate,
            groupColors: [ parser.colorA, parser.colorB ],
            groupBadgeParts
        })
    })

    if(!groupData || (groupData.groupId <= 0)) return null
    
    return (
        <NitroCardView uniqueKey="group-manager" className="illumina-group-manager h-[520px] w-[392px]" customZIndex={ 501 }>
            <NitroCardHeaderView headerText={ LocalizeText("group.window.title") } onCloseClick={ onClose } />
            <NitroCardContentView className="h-full">
                <div className="mt-[13px] flex h-full flex-col">
                    <div className="mb-2.5 flex gap-[3px]">
                        <i className={ `h-[62px] w-[114px] bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] bg-no-repeat dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] ${ TAB_HEAD_IMAGE[currentTab].position }` } />
                        <div className="flex flex-col">
                            <p className="mb-1 text-lg font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText(`group.edit.tabcaption.${ currentTab }`) }</p>
                            <p className="text-sm">{ LocalizeText(`group.edit.tabdesc.${ currentTab }`) }</p>
                        </div>
                    </div>
                    <NitroCardTabsView>
                        { TABS.map(tab => (
                            <NitroCardTabsItemView key={ tab } className="w-full" isActive={ currentTab === tab } onClick={ () => changeTab(tab) }>
                                { LocalizeText(`group.edit.tab.${ tab }`) }
                            </NitroCardTabsItemView>
                        ))}
                    </NitroCardTabsView>
                    <div className="mt-2.5 flex w-full flex-1 flex-col justify-between">
                        { (currentTab === 1) &&
                            <GroupTabIdentityView groupData={ groupData } setGroupData={ setGroupData } setCloseAction={ setCloseAction } onClose={ onClose } /> }
                        { (currentTab === 2) &&
                            <GroupTabBadgeView groupData={ groupData } setGroupData={ setGroupData } setCloseAction={ setCloseAction } skipDefault={ true } /> }
                        { (currentTab === 3) &&
                            <GroupTabColorsView groupData={ groupData } setGroupData={ setGroupData } setCloseAction={ setCloseAction } /> }
                        { (currentTab === 5) &&
                            <GroupTabSettingsView groupData={ groupData } setGroupData={ setGroupData } setCloseAction={ setCloseAction } /> }
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
