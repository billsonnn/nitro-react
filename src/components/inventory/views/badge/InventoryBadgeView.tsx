import { FC, useEffect, useState } from "react"
import { LocalizeBadgeName, LocalizeText, UnseenItemCategory } from "../../../../api"
import { Button, LayoutBadgeImageView } from "../../../../common"
import { useInventoryBadges, useInventoryUnseenTracker } from "../../../../hooks"
import { InventoryBadgeItemView } from "./InventoryBadgeItemView"

export const InventoryBadgeView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false)
    const { badgeCodes = [], activeBadgeCodes = [], selectedBadgeCode = null, isWearingBadge = null, canWearBadges = null, toggleBadge = null, getBadgeId = null, activate = null, deactivate = null } = useInventoryBadges()
    const { isUnseen = null, removeUnseen = null } = useInventoryUnseenTracker()

    useEffect(() =>
    {
        if(!selectedBadgeCode || !isUnseen(UnseenItemCategory.BADGE, getBadgeId(selectedBadgeCode))) return

        removeUnseen(UnseenItemCategory.BADGE, getBadgeId(selectedBadgeCode))
    }, [ selectedBadgeCode, isUnseen, removeUnseen, getBadgeId ])

    useEffect(() =>
    {
        if(!isVisible) return

        const id = activate()

        return () => deactivate(id)
    }, [ isVisible, activate, deactivate ])

    useEffect(() =>
    {
        setIsVisible(true)

        return () => setIsVisible(false)
    }, [])

    return (
        <div className="flex h-[270px] w-full gap-2.5">
            <div className="relative flex flex-col justify-between">
                <div className="mb-2 h-full">
                    <div className="illumina-scrollbar grid size-full !grid-cols-[repeat(5,minmax(48px,0fr))] !grid-rows-[repeat(auto-fit,minmax(43px,0fr))] !gap-1.5 overflow-y-auto overflow-x-hidden pt-0.5">
                        { badgeCodes && (badgeCodes.length > 0) && badgeCodes.map((badgeCode, index) =>
                        {
                            if(isWearingBadge(badgeCode)) return null

                            return <InventoryBadgeItemView key={ index } badgeCode={ badgeCode } />
                        }) }
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col justify-between">
                <div className="relative flex flex-col">
                    <p className="text-sm [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("inventory.badges.activebadges") }</p>
                    <div className="grid !grid-cols-3 !grid-rows-[repeat(auto-fit,minmax(48px,0fr))] !gap-1.5">
                        { activeBadgeCodes && (activeBadgeCodes.length > 0) && activeBadgeCodes.map((badgeCode, index) => <InventoryBadgeItemView key={ index } badgeCode={ badgeCode } />) }
                    </div>
                </div>
                { !!selectedBadgeCode &&
                    <div className="flex w-full flex-col">
                        <div className="mb-1.5 flex gap-2.5">
                            <LayoutBadgeImageView shrink badgeCode={ selectedBadgeCode } />
                            <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeBadgeName(selectedBadgeCode) }</p>
                        </div>
                        <Button variant="primary" disabled={ !isWearingBadge(selectedBadgeCode) && !canWearBadges() } onClick={ event => toggleBadge(selectedBadgeCode) }>{ LocalizeText(isWearingBadge(selectedBadgeCode) ? "inventory.badges.clearbadge" : "inventory.badges.wearbadge") }</Button>
                    </div> }
            </div>
        </div>
    )
}
