import { FC } from "react"
import { LocalizeText } from "../../../../api"
import { Button, DraggableWindow, LayoutAvatarImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useFurnitureFriendFurniWidget } from "../../../../hooks"

export const FurnitureFriendFurniView: FC<{}> = props =>
{
    const { objectId = -1, type = 0, stage = 0, usernames = [], figures = [], date = null, onClose = null, respond = null } = useFurnitureFriendFurniWidget()

    const getLockView = () =>
    {
        let bg = {}

        if(type === 0)
        {
            bg = {
                backgroundPosition: "0px 0px",
                height: "190px"
            }
        }
        else if(type === 3)
        {
            bg = {
                backgroundPosition: "0px -214px",
                height: "187px"
            }
        }
        else if(type === 4)
        {
            bg = {
                backgroundPosition: "0 -416px",
                height: "194px"
            }
        }

        return bg
    }

    if(objectId === -1) return null

    if(stage > 0)
    {
        return (
            <NitroCardView uniqueKey="engraving-confirm" className="illumina-engraving-confirm w-[300px]">
                <NitroCardHeaderView headerText={ LocalizeText("friend.furniture.confirm.lock.caption") } onCloseClick={ onClose } />
                <NitroCardContentView>
                    <p className="mb-2.5 text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                        { LocalizeText("friend.furniture.confirm.lock.subtitle") }
                    </p>
                    <div className="mb-2 flex justify-center">
                        <i className="h-[39px] w-[31px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-278px_-212px]" />
                    </div>
                    <div className="my-3.5 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <div className="flex items-center justify-between px-[11px]">
                        <Button onClick={ event => respond(false) }>{ LocalizeText("friend.furniture.confirm.lock.button.cancel") }</Button>
                        <Button onClick={ event => respond(true) }>{ LocalizeText("friend.furniture.confirm.lock.button.confirm") }</Button>
                    </div>
                </NitroCardContentView>
            </NitroCardView>
        )
    }

    if((usernames.length > 0) && (type === 0))
    {
        return (
            <DraggableWindow uniqueKey="engraving" handleSelector=".illumina-engraving">
                <div className="illumina-engraving relative w-[373px] bg-[url('/client-assets/images/room-widgets/friend-furni/spritesheet.png?v=2451779')]" style={ getLockView() }>
                    <button className="absolute right-7 top-[27px] h-[13px] w-[11px] cursor-pointer" onClick={ onClose } />
                    <div className="flex h-[108px] justify-center">
                        <LayoutAvatarImageView className="!h-full !bg-[6px_-25px]" figure={ figures[0] } direction={ 2 } />
                        <LayoutAvatarImageView className="!h-full !bg-[-14px_-25px]" figure={ figures[1] } direction={ 4 } />
                    </div>
                    <div className="mt-[5px] flex flex-col">
                        <div className="mb-[3px] flex justify-center">
                            <div className="flex flex-col gap-3">
                                <p className="text-center text-sm font-semibold text-[#612C53] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                                    { LocalizeText("lovelock.engraving.caption") }
                                </p>
                                <p className="text-center text-sm font-semibold text-[#612C53] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ date }</p>
                            </div>
                        </div>
                        <div className="mt-1.5 flex items-center justify-center gap-[25px]">
                            <p className="text-sm font-semibold text-[#612C53] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ usernames[0] }</p>
                            <p className="text-sm font-semibold text-[#612C53] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ usernames[1] }</p>
                        </div>
                    </div>
                </div>
            </DraggableWindow>
        )
    }

    if((usernames.length > 0) && (type === 4))
    {
        return (
            <DraggableWindow uniqueKey="engraving" handleSelector=".illumina-engraving">
                <div className="illumina-engraving relative w-[373px] bg-[url('/client-assets/images/room-widgets/friend-furni/spritesheet.png?v=2451779')]" style={ getLockView() }>
                    <button className="absolute right-7 top-[27px] h-[13px] w-[11px] cursor-pointer" onClick={ onClose } />
                    <div className="flex h-[121px] justify-center">
                        <LayoutAvatarImageView className="!h-full !bg-[6px_-12px]" figure={ figures[0] } direction={ 2 } />
                        <LayoutAvatarImageView className="!h-full !bg-[-14px_-12px]" figure={ figures[1] } direction={ 4 } />
                    </div>
                    <div className="mt-1.5 flex flex-col">
                        <div className="flex justify-center">
                            <div className="flex flex-col gap-3.5">
                                <p className="text-center text-sm font-semibold text-[#2B2521] [text-shadow:_0_1px_0_#948C94]">
                                    { LocalizeText("habboween.engraving.caption") }
                                </p>
                                <p className="text-center text-sm font-semibold text-[#2B2521] [text-shadow:_0_1px_0_#948C94]">{ date }</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-[25px]">
                            <p className="text-sm font-semibold text-[#6C125D] [text-shadow:_0_1px_0_#948C94]">{ usernames[0] }</p>
                            <p className="text-sm font-semibold text-[#6C125D] [text-shadow:_0_1px_0_#948C94]">{ usernames[1] }</p>
                        </div>
                    </div>
                </div>
            </DraggableWindow>
        )
    }
}
