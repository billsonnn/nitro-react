import { RoomObjectType } from "@nitrots/nitro-renderer"
import { FC, useMemo, useState } from "react"
import { ChatEntryType, IChatEntry, LocalizeText, ReportState, ReportType } from "../../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../common"
import { useChatHistory, useHelp } from "../../../hooks"

export interface SelectReportedChatsViewProps
{
    onClose: () => void;
}

export const SelectReportedChatsView: FC<SelectReportedChatsViewProps> = props =>
{
    const [ selectedChats, setSelectedChats ] = useState<IChatEntry[]>([])
    const { activeReport = null, setActiveReport = null } = useHelp()
    const { chatHistory = [], messengerHistory = [] } = useChatHistory()
    const { onClose = null } = props

    const userChats = useMemo(() =>
    {
        switch(activeReport.reportType)
        {
        case ReportType.BULLY:
        case ReportType.EMERGENCY:
            return chatHistory.filter(chat => (chat.type === ChatEntryType.TYPE_CHAT) && (chat.webId === activeReport.reportedUserId) && (chat.entityType === RoomObjectType.USER))
        case ReportType.IM:
            return messengerHistory.filter(chat => (chat.webId === activeReport.reportedUserId) && (chat.type === ChatEntryType.TYPE_IM))
        }

        return []
    }, [ activeReport, chatHistory, messengerHistory ])

    const selectChat = (chatEntry: IChatEntry) =>
    {
        setSelectedChats(prevValue =>
        {
            const newValue = [ ...prevValue ]
            const index = newValue.indexOf(chatEntry)

            if(index >= 0) newValue.splice(index, 1)
            else newValue.push(chatEntry)

            return newValue
        })
    }

    const submitChats = () =>
    {
        if(!selectedChats || (selectedChats.length <= 0)) return

        setActiveReport(prevValue =>
        {
            return { ...prevValue, reportedChats: selectedChats, cfhCategory: 2, cfhTopic: 3, currentStep: ReportState.REPORT_SUMMARY }
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
        <NitroCardView uniqueKey="help-select-reported-chats" className="illumina-help-select-reported-chats w-[380px]">
            <NitroCardHeaderView headerText={ LocalizeText("help.bully.title") } onCloseClick={ onClose } />
            <NitroCardContentView className="h-full">
                <p className="mb-3 font-semibold text-[#484848] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("help.emergency.chat_report.subtitle") }</p>
                <p className="mb-2 text-sm">{ LocalizeText("help.emergency.chat_report.description") }</p>
                <div className="flex flex-1 flex-col justify-between overflow-hidden">
                    <div className="illumina-scrollbar flex h-[287px] flex-col">
                        { userChats.map(chat => (
                            <div key={ chat.id } className={`illumina-report-chat-item flex min-h-6 cursor-pointer items-center px-1 ${(selectedChats.indexOf(chat) >= 0) ? "selected" : ""}`} onClick={ event => selectChat(chat) }>
                                <p className="text-[13px]">{ chat.message }</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-1.5 flex flex-col items-center justify-center gap-1">
                        <Button className="!h-[21px]" onClick={ submitChats }>
                            { LocalizeText("help.emergency.main.submit.button") }
                        </Button>
                        <Button variant="underline" onClick={ back } disabled={ (activeReport.reportType === ReportType.IM) }>
                            { LocalizeText("generic.back") }
                        </Button>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
