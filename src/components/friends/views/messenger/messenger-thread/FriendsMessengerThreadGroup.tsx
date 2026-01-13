import { FollowFriendMessageComposer } from "@nitrots/nitro-renderer"
import { FC, useMemo } from "react"
import { GetGroupChatData, GetSessionDataManager, LocalizeText, MessengerGroupType, MessengerThread, MessengerThreadChat, MessengerThreadChatGroup, SendMessageComposer } from "../../../../../api"
import { Button, LayoutAvatarImageView } from "../../../../../common"

export const FriendsMessengerThreadGroup: FC<{ thread: MessengerThread, group: MessengerThreadChatGroup }> = props =>
{
    const { thread = null, group = null } = props

    const groupChatData = useMemo(() => ((group.type === MessengerGroupType.GROUP_CHAT) && GetGroupChatData(group.chats[0].extraData)), [ group ])

    const isOwnChat = useMemo(() =>
    {
        if(!thread || !group) return false
        
        if((group.type === MessengerGroupType.PRIVATE_CHAT) && (group.userId === GetSessionDataManager().userId)) return true

        if(groupChatData && group.chats.length && (groupChatData.userId === GetSessionDataManager().userId)) return true

        return false
    }, [ thread, group, groupChatData ])

    if(!thread || !group) return null
    
    if(!group.userId) return (
        <>
            { group.chats.map((chat, index) => (
                <div key={ index } className="w-full">
                    { (chat.type === MessengerThreadChat.SECURITY_NOTIFICATION) &&
                    <div className="illumina-input mb-2 flex gap-4 py-2.5 pl-[13px] pr-1.5">
                        <i className="mt-1 block h-[21px] w-[23px] shrink-0 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[0px_-153px]" />
                        <p className="text-xs !leading-[13px] text-[#2F2F2F]">{ chat.message }</p>
                    </div> }
                    { (chat.type === MessengerThreadChat.ROOM_INVITE) &&
                    <div className="illumina-input relative mb-2 flex py-2.5 pl-[13px]">
                        <LayoutAvatarImageView className="!absolute -top-3 left-[-5px] !size-[70px] shrink-0 !bg-[center_-15px] drop-shadow-[0px_1px_0_#fff] [image-rendering:initial] dark:drop-shadow-[0px_1px_0_#33312B]" figure={ thread.participant.figure } headOnly={ true } direction={ 2 } scale={ 0.50 } />
                        <div className="ml-10 flex w-full flex-col">
                            <p className="text-xs font-semibold !leading-3 text-[#2F2F2F] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ (LocalizeText("messenger.invitation")) }</p>
                            <p className="mb-2.5 w-[170px] overflow-hidden break-words text-xs !leading-[13px] text-[#2F2F2F]">{ chat.message }</p>
                            <Button className="!h-5 w-fit gap-[5px] !px-1.5" onClick={() => thread && thread.participant && SendMessageComposer(new FollowFriendMessageComposer(thread.participant.id)) }>
                                <i className="block h-2.5 w-[9px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-453px_0px]" />
                                <p className="text-[11px] font-semibold !leading-3 text-[#4a4a4a] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("messenger.invitation.button", [ "username" ], [ thread.participant.name ]) }</p>
                            </Button>
                        </div>
                    </div> }
                </div>
            ))}
        </>
    )
    
    return (
        <div className={`mb-4 flex gap-[9px] last:mb-0 ${isOwnChat ? "justify-start" : "justify-end"}`}>
            { isOwnChat && <LayoutAvatarImageView className="!h-[50px] !w-10 shrink-0 !bg-[center_-30px]" figure={ GetSessionDataManager().figure } direction={ 2 } /> }
            <div className="w-full">
                <p className="mb-1 text-xs font-semibold !leading-3 text-[#565656] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                    { isOwnChat && GetSessionDataManager().userName }
                    { !isOwnChat && (groupChatData ? groupChatData.username : thread.participant.name) }
                </p>
                <div className={`illumina-messenger-message relative min-h-[30px] w-[194px] px-3 py-2.5 ${isOwnChat ? "message-left" : "message-right"}`}>
                    { group.chats.map((chat, index) => <p key={ index } className="break-words text-xs text-[#040404]">{ chat.message }</p>) }
                </div>
            </div>
            { ((group.type === MessengerGroupType.PRIVATE_CHAT) && !isOwnChat) &&
                <LayoutAvatarImageView className="!h-[50px] !w-10 shrink-0 !bg-[center_-30px]" figure={ thread.participant.figure } direction={ 4 } /> }
            { (groupChatData && !isOwnChat) &&
                <LayoutAvatarImageView className="!h-[50px] !w-10 shrink-0 !bg-[center_-30px]" figure={ groupChatData.figure } direction={ 4 } /> }
        </div>
    )
}
