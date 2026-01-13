import { BotRemoveComposer } from "@nitrots/nitro-renderer"
import { FC, useMemo } from "react"
import { AvatarInfoRentableBot, BotSkillsEnum, LocalizeText, SendMessageComposer } from "../../../../../api"
import { Button, LayoutAvatarImageView, LayoutBadgeImageView } from "../../../../../common"
import { LayoutTimesView } from "../../../../../common/layout/LayoutTimesView"

interface InfoStandWidgetRentableBotViewProps
{
    avatarInfo: AvatarInfoRentableBot;
    onClose: () => void;
}

export const InfoStandWidgetRentableBotView: FC<InfoStandWidgetRentableBotViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props

    const canPickup = useMemo(() =>
    {
        if(avatarInfo.botSkills.indexOf(BotSkillsEnum.NO_PICK_UP) >= 0) return false

        if(!avatarInfo.amIOwner && !avatarInfo.amIAnyRoomController) return false

        return true
    }, [ avatarInfo ])

    const pickupBot = () => SendMessageComposer(new BotRemoveComposer(avatarInfo.webID))
    
    if(!avatarInfo) return

    return (
        <div className="relative flex flex-col items-end">
            <div className="illumina-card relative w-[206px] px-2.5 py-1.5">
                <div className="flex items-end justify-between">
                    <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ avatarInfo.name }</p>
                    <LayoutTimesView onClick={ onClose } />
                </div>
                <div className="mb-[7px] mt-[3px] h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                <div className="flex gap-[9px]">
                    <div className="illumina-previewer relative flex w-[74px] items-center justify-center">
                        <LayoutAvatarImageView className="z-10" figure={ avatarInfo.figure } direction={ 2 } />
                        <div className="absolute left-0 top-0 size-full bg-[url('/client-assets/images/infostand/bot-bg.png?v=2451779')] bg-center bg-no-repeat" />
                    </div>
                    <div className="flex w-full items-center justify-center">
                        { (avatarInfo.badges.length > 0) && avatarInfo.badges.map((result, index) => {
                            return <div key={ index } className="illumina-card-item badge-image relative flex size-12 cursor-pointer items-center justify-center bg-center bg-no-repeat">
                                <LayoutBadgeImageView key={ result } badgeCode={ result } showInfo={ false } />
                            </div>
                        })}
                    </div>
                </div>
                <div className="my-1 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                <p className="size-full break-words py-1 text-[13px] !leading-4 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ avatarInfo.motto }</p>
                <div className="mb-[7px] mt-1 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                <div className="mb-[9px]">
                    <p className="text-[13px] !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                        { LocalizeText("infostand.text.botowner", [ "name" ], [ avatarInfo.ownerName ]) }
                    </p>
                </div>
            </div>
            { canPickup &&
                <div className="mt-1 flex items-center justify-end gap-1">
                    <Button variant="primary" className="!px-2" onClick={ pickupBot }>{ LocalizeText("infostand.button.pickup") }</Button>
                </div> }
        </div>
    )
}
