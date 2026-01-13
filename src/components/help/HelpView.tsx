import { ILinkEventTracker } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { AddEventLinkTracker, RemoveLinkEventTracker, ReportState } from "../../api"
import { useHelp } from "../../hooks"
import { HelpIndexView } from "./views/HelpIndexView"
import { ReportSummaryView } from "./views/ReportSummaryView"
import { SelectReportedChatsView } from "./views/SelectReportedChatsView"
import { SelectReportedUserView } from "./views/SelectReportedUserView"
import { ThanksView } from "./views/ThanksView"
import { NameChangeView } from "./views/name-change/NameChangeView"

export const HelpView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false)
    const { activeReport = null, setActiveReport = null, report = null } = useHelp()

    const onClose = () =>
    {
        setActiveReport(null)
        setIsVisible(false)
    }

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split("/")
        
                if(parts.length < 2) return
        
                switch(parts[1])
                {
                case "show":
                    setIsVisible(true)
                    return
                case "hide":
                    setIsVisible(false)
                    return
                case "toggle":
                    setIsVisible(prevValue => !prevValue)
                    return
                case "tour":
                    // todo: launch tour
                    return
                case "report":
                    if((parts.length >= 5) && (parts[2] === "room"))
                    {
                        const roomId = parseInt(parts[3])
                        const unknown = unescape(parts.splice(4).join("/"))
                        //this.reportRoom(roomId, unknown, "");
                    }
                    return
                }
            },
            eventUrlPrefix: "help/"
        }

        AddEventLinkTracker(linkTracker)

        return () => RemoveLinkEventTracker(linkTracker)
    }, [])

    useEffect(() =>
    {
        if(!activeReport) return

        setIsVisible(true)
    }, [ activeReport ])
    
    const CurrentStepView = () =>
    {
        if(activeReport)
        {
            switch(activeReport.currentStep)
            {
            case ReportState.SELECT_USER:
                return <SelectReportedUserView onClose={ onClose } />
            case ReportState.SELECT_CHATS:
                return <SelectReportedChatsView onClose={ onClose } />
            case ReportState.REPORT_SUMMARY:
                return <ReportSummaryView />
            case ReportState.THANKS:
                return <ThanksView onClose={ onClose } />
            }
        }

        return <HelpIndexView onClose={ onClose } />
    }

    return (
        <>
            { isVisible && <CurrentStepView /> }
            <NameChangeView />
        </>
    )
}
