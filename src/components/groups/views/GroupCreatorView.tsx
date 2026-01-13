import { GroupBuyComposer, GroupBuyDataComposer, GroupBuyDataEvent } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { HasHabboClub, IGroupData, LocalizeText, SendMessageComposer } from "../../../api"
import { Button, LayoutCurrencyIcon, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../common"
import { useMessageEvent, useNotification, usePurse } from "../../../hooks"
import { GroupTabBadgeView } from "./tabs/GroupTabBadgeView"
import { GroupTabColorsView } from "./tabs/GroupTabColorsView"
import { GroupTabCreatorConfirmationView } from "./tabs/GroupTabCreatorConfirmationView"
import { GroupTabIdentityView } from "./tabs/GroupTabIdentityView"

interface GroupCreatorViewProps
{
    onClose: () => void;
}

const TABS: number[] = [ 1, 2, 3, 4 ]

export const GroupCreatorView: FC<GroupCreatorViewProps> = props =>
{
    const { onClose = null } = props
    const [ currentTab, setCurrentTab ] = useState<number>(1)
    const [ closeAction, setCloseAction ] = useState<{ action: () => boolean }>(null)
    const [ groupData, setGroupData ] = useState<IGroupData>(null)
    const [ availableRooms, setAvailableRooms ] = useState<{ id: number, name: string }[]>(null)
    const [ purchaseCost, setPurchaseCost ] = useState<number>(0)
    const { getCurrencyAmount } = usePurse()
    const { showConfirm = null } = useNotification()

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
        }
    }

    const getTabStyle = (tab: number) =>
    {
        let style = ""
        
        if((tab === 1) && currentTab === 1)
        {
            style = "bg-[-85px_-3px] !w-[84px] pt-1"
        }
        else if((tab === 1) && currentTab !== 1)
        {
            style = "bg-[0px_-3px] !w-[84px] pt-2"
        }
        else if((tab === 4) && currentTab === 4)
        {
            style = "bg-[-472px_0px] w-[133px] h-[33px] ml-[-9px] mt-[-1px] pt-1.5"
        }
        else if((tab === 4) && currentTab !== 4)
        {
            style = "bg-[-338px_-3px] w-[133px] ml-[-9px] mt-0.5 pt-1.5"
        }
        else if(currentTab === tab)
        {
            style = "bg-[-254px_-3px] w-[83px] ml-[-5px] pt-1"
        }
        else
        {
            style = "bg-[-170px_-3px] w-[83px] ml-[-7px] pt-2"
        }
        
        return style
    }

    const onCloseClose = () =>
    {
        setCloseAction(null)
        setGroupData(null)

        if(onClose) onClose()
    }

    const buyGroup = () =>
    {
        if(!groupData) return

        if(getCurrencyAmount(-1) < purchaseCost) {
            showConfirm(LocalizeText("catalog.alert.notenough.credits.description"), null, null, LocalizeText("generic.ok"), null, LocalizeText("catalog.alert.notenough.title"))
        }

        const badge = []

        groupData.groupBadgeParts.forEach(part =>
        {
            if(part.code)
            {
                badge.push(part.key)
                badge.push(part.color)
                badge.push(part.position)
            }
        })

        SendMessageComposer(new GroupBuyComposer(groupData.groupName, groupData.groupDescription, groupData.groupHomeroomId, groupData.groupColors[0], groupData.groupColors[1], badge))
    }

    const previousStep = () =>
    {
        if(currentTab === 1)
        {
            onClose()
        }

        if(closeAction && closeAction.action)
        {
            if(!closeAction.action()) return
        }

        setCurrentTab(value => value - 1)
    }

    const nextStep = () =>
    {
        if(closeAction && closeAction.action)
        {
            if(!closeAction.action()) return
        }
        
        if(currentTab === 4) {
            buyGroup()
            return
        }

        setCurrentTab(value => (value === 4 ? value : value + 1))
    }

    useMessageEvent<GroupBuyDataEvent>(GroupBuyDataEvent, event =>
    {
        const parser = event.getParser()

        const rooms: { id: number, name: string }[] = []

        parser.availableRooms.forEach((name, id) => rooms.push({ id, name }))

        setAvailableRooms(rooms)
        setPurchaseCost(parser.groupCost)
    })

    useEffect(() =>
    {
        setCurrentTab(1)

        setGroupData({
            groupId: -1,
            groupName: null,
            groupDescription: null,
            groupHomeroomId: -1,
            groupState: 1,
            groupCanMembersDecorate: true,
            groupColors: null,
            groupBadgeParts: null
        })
        
        SendMessageComposer(new GroupBuyDataComposer())
    }, [ setGroupData ])

    if(!groupData) return null

    return (
        <NitroCardView uniqueKey="group-creator" className="illumina-group-creator h-[520px] w-[392px]">
            <NitroCardHeaderView headerText={ LocalizeText("group.create.title") } onCloseClick={ onCloseClose } />
            <NitroCardContentView className="h-full">
                <div className="flex items-start pt-px">
                    { TABS.map((tab, index) => (
                        <div key={ index } className={ `flex h-7 justify-center gap-1 bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] ${ getTabStyle(tab) }`}>
                            <p className="text-sm font-semibold text-white">{ LocalizeText(`group.create.steplabel.${ tab }`) }</p>
                            {tab === 4 &&
                                <span className="mt-[-2px]">
                                    <LayoutCurrencyIcon type="big" currency={ -1 } />
                                </span> }
                        </div>
                    ))}
                </div>
                <div className="mt-[13px] flex h-full flex-col">
                    <div className="flex gap-[3px]">
                        <i className={ `h-[62px] w-[114px] bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] bg-no-repeat dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] ${ TAB_HEAD_IMAGE[currentTab].position }` } />
                        <div className="flex flex-col">
                            <p className="mb-1 text-lg font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText(`group.create.stepcaption.${ currentTab }`) }</p>
                            <p className="text-sm">{ LocalizeText(`group.create.stepdesc.${ currentTab }`) }</p>
                        </div>
                    </div>
                    <div className="mt-2.5 flex w-full flex-1 flex-col justify-between">
                        { (currentTab === 1) &&
                            <GroupTabIdentityView groupData={ groupData } setGroupData={ setGroupData } setCloseAction={ setCloseAction } onClose={ null } isCreator={ true } availableRooms={ availableRooms } /> }
                        { (currentTab === 2) &&
                            <GroupTabBadgeView groupData={ groupData } setGroupData={ setGroupData } setCloseAction={ setCloseAction } /> }
                        { (currentTab === 3) &&
                            <GroupTabColorsView groupData={ groupData } setGroupData={ setGroupData } setCloseAction={ setCloseAction } /> }
                        { (currentTab === 4) &&
                            <GroupTabCreatorConfirmationView groupData={ groupData } setGroupData={ setGroupData } purchaseCost={ purchaseCost } /> }
                        <div className="flex items-end justify-between">
                            <Button variant="underline" onClick={ previousStep }>
                                { LocalizeText(currentTab === 1 ? "generic.cancel" : "group.create.previousstep") }
                            </Button>
                            {currentTab !== 4 &&
                                <Button onClick={ nextStep }>
                                    { LocalizeText("group.create.nextstep") }
                                </Button> }
                            {currentTab === 4 && HasHabboClub() &&
                                <div className="illumina-groups-purchase flex w-[248px] justify-between px-3.5 py-2" onClick={ nextStep }>
                                    <div className="flex w-[140px] items-center gap-2.5">
                                        <LayoutCurrencyIcon type="big" currency={ -1 } />
                                        <p className="text-sm text-[#090909]">{ LocalizeText("group.create.confirm.buyinfo", [ "amount" ], [ purchaseCost.toString() ]) }</p>
                                    </div>
                                    <Button>
                                        { LocalizeText("group.create.confirm.buy") }
                                    </Button>
                                </div> }
                            {currentTab === 4 && !HasHabboClub() &&
                                <div className="illumina-groups-purchase disabled flex w-[248px] justify-between px-3.5 py-2">
                                    <div className="flex w-[140px] items-center gap-2.5">
                                        <LayoutCurrencyIcon type="big" currency={ -1 } />
                                        <p className="text-sm text-[#090909]">{ LocalizeText("group.create.confirm.buyinfo", [ "amount" ], [ purchaseCost.toString() ]) }</p>
                                    </div>
                                    <Button disabled>
                                        { LocalizeText("group.create.confirm.buy") }
                                    </Button>
                                </div> }
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
