import { RoomObjectType } from "@nitrots/nitro-renderer"
import { FC, useMemo, useState } from "react"
import { ChatEntryType, GetSessionDataManager, IReportedUser, LocalizeText, ReportState } from "../../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../common"
import { useChatHistory, useHelp } from "../../../hooks"

export interface SelectReportedUserViewProps
{
    onClose: () => void;
}

export const SelectReportedUserView: FC<SelectReportedUserViewProps> = props =>
{
    const [ selectedUserId, setSelectedUserId ] = useState(-1)
    const { chatHistory = [] } = useChatHistory()
    const { setActiveReport = null } = useHelp()
    const { onClose = null } = props

    const availableUsers = useMemo(() =>
    {
        const users: Map<number, IReportedUser> = new Map()

        chatHistory.forEach(chat =>
        {
            if((chat.type === ChatEntryType.TYPE_CHAT) && (chat.entityType === RoomObjectType.USER) && (chat.webId !== GetSessionDataManager().userId) && !users.has(chat.webId)) users.set(chat.webId, { id: chat.webId, username: chat.name, imageUrl: chat.imageUrl })
        })

        return Array.from(users.values())
    }, [ chatHistory ])

    const submitUser = (userId: number) =>
    {
        if(userId <= 0) return

        setActiveReport(prevValue =>
        {
            return { ...prevValue, reportedUserId: userId, currentStep: ReportState.SELECT_CHATS }
        })
    }

    const selectUser = (userId: number) =>
    {
        setSelectedUserId(prevValue =>
        {
            if(userId === prevValue) return -1

            return userId
        })
    }

    const back = () =>
    {
        setActiveReport(prevValue =>
        {
            return { ...prevValue, currentStep: (prevValue.currentStep - 1) }
        })
    }

    return (
        <NitroCardView uniqueKey="help-select-reported-user" className="illumina-help-select-reported-user h-[490px] w-[290px]">
            <NitroCardHeaderView headerText={ LocalizeText("help.bully.title") } onCloseClick={ onClose } />
            <NitroCardContentView className="h-full">
                <p className="mb-3 font-semibold text-[#484848] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("help.bully.subtitle") }</p>
                <p className="mb-2 text-sm">{ LocalizeText("help.emergency.main.step.two.description") }</p>
                <div className="flex flex-1 flex-col justify-between overflow-hidden">
                    <div className="illumina-scrollbar flex h-[344px] flex-col">
                        { availableUsers.map(user => (
                            <div key={ user.id } className={`flex h-[42px] w-full shrink-0 cursor-pointer items-center px-[18px] ${(selectedUserId === user.id) ? "illumina-previewer" : ""}`} onClick={ event => selectUser(user.id) }>
                                { user.imageUrl && (user.imageUrl.length > 0) && <div className="relative size-[30px] overflow-hidden">
                                    <i className="absolute -left-2.5 -top-5 h-[65px] w-[50px] shrink-0 scale-50 overflow-hidden bg-[center_-6px] bg-no-repeat" style={ { backgroundImage: `url(${ user.imageUrl })` } } />
                                </div> }
                                <span className="text-sm font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" dangerouslySetInnerHTML={ { __html: (user.username) } } />
                            </div>
                        ))}
                    </div>
                    <div className="mt-1.5 flex flex-col items-center justify-center gap-1">
                        <Button className="!h-[21px]" onClick={ () => submitUser(selectedUserId) }>
                            { LocalizeText("help.bully.submit") }
                        </Button>
                        <Button variant="underline" onClick={ back }>
                            { LocalizeText("generic.back") }
                        </Button>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
