import { FC } from "react"
import { OfferView } from "../catalog/views/targeted-offer/OfferView"
import { GroupRoomInformationView } from "../groups/views/GroupRoomInformationView"
import { NotificationCenterView } from "../notification-center/NotificationCenterView"
import { PurseView } from "../purse/PurseView"

export const RightSideView: FC<{}> = props =>
{
    return (
        <div className="absolute right-1 top-1 z-50 max-h-[calc(100%-55px)]">
            <div className="relative flex flex-col items-end">
                <PurseView />
                <div className="flex w-[200px] flex-col items-end">
                    <OfferView/>
                    <GroupRoomInformationView />
                    <NotificationCenterView />
                </div>
            </div>
        </div>
    )
}
