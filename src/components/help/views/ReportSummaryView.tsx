import { CallForHelpMessageComposer } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { ReportState, ReportType, SendMessageComposer } from "../../../api"
import { useHelp } from "../../../hooks"

export const ReportSummaryView: FC<{}> = props =>
{
    const { activeReport = null, setActiveReport = null } = useHelp()

    const submitReport = () =>
    {
        const chats: (string | number)[] = []

        switch(activeReport.reportType)
        {
        case ReportType.BULLY:
        case ReportType.EMERGENCY:
        case ReportType.ROOM: {
            const reportedRoomId = ((activeReport.roomId <= 0) ? activeReport.reportedChats[0].roomId : activeReport.roomId)

            activeReport.reportedChats.forEach(entry => chats.push(entry.webId, entry.message))

            SendMessageComposer(new CallForHelpMessageComposer(activeReport.message, activeReport.cfhTopic, activeReport.reportedUserId, reportedRoomId, chats))
            break
        }
        }

        setActiveReport(prevValue =>
        {
            return { ...prevValue, reportedUserId: -1, reportedChats: [], currentStep: ReportState.THANKS }
        })
    }

    submitReport()

    return null
}
