import { FC, useState } from "react"
import { DispatchUiEvent, GetConfiguration, LocalizeText, ReportState, ReportType, VisitDesktop } from "../../../api"
import { Button, NitroBigCardContentView, NitroBigCardHeaderView, NitroBigCardView } from "../../../common"
import { LayoutTimesView } from "../../../common/layout/LayoutTimesView"
import { GuideToolEvent } from "../../../events"
import { useHelp } from "../../../hooks"

export interface HelpIndexViewProps
{
    onClose: () => void;
}

export const HelpIndexView: FC<HelpIndexViewProps> = props =>
{
    const [ isLeaveRoom, setIsLeaveRoom ] = useState(false)
    const { setActiveReport = null } = useHelp()
    const { onClose = null } = props

    const onReportClick = () =>
    {
        setActiveReport(prevValue =>
        {
            const currentStep = ReportState.SELECT_USER
            const reportType = ReportType.BULLY

            return { ...prevValue, currentStep, reportType }
        })
    }
    const onEmergencyClick = () =>
    {
        // if(isLeaveRoom) {
        //     VisitDesktop()
        // }
        VisitDesktop()
        DispatchUiEvent(new GuideToolEvent(GuideToolEvent.CREATE_HELP_REQUEST))
        onClose()
    }

    const needHelpClick = () =>
    {
        DispatchUiEvent(new GuideToolEvent(GuideToolEvent.CREATE_HELP_REQUEST))
        onClose()
    }

    return (
        <NitroBigCardView uniqueKey="help-center" className="illumina-help-center w-[420px]" onCloseClick={ onClose }>
            <NitroBigCardHeaderView headerText={ LocalizeText("help.main.frame.title") } />
            <NitroBigCardContentView className="text-[#010101]">
                <div className="mb-[7px] flex w-full justify-end">
                    <LayoutTimesView onClick={ onClose } />
                </div>
                <div className="mb-7">
                    <div className="mb-3.5 flex w-full items-center">
                        <div className="h-0.5 w-[170px] border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                        <span className="px-3 text-[11px] font-semibold uppercase text-[#010101] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("help.main2.bully.title") }</span>
                        <div className="h-0.5 flex-1 border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    </div>
                    <div className="flex">
                        <div className="h-[130px] w-[170px] shrink-0 bg-[url('/client-assets/images/help/bully.png?v=2451779')] bg-center bg-no-repeat" />
                        <div className="ml-3.5">
                            <p className="mb-2.5 text-[13px] font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" onClick={ onReportClick }>{ LocalizeText("help.main2.bully.subtitle") }</p>
                            <p className="mb-[18px] text-xs !leading-4">{ LocalizeText("help.main2.bully.description") }</p>
                            <Button onClick={ onReportClick }>{ LocalizeText("help.main2.bully.button") }</Button>
                        </div>
                    </div>
                </div>
                <div className="mb-7">
                    <div className="mb-3.5 flex w-full items-center">
                        <div className="h-0.5 w-[170px] border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                        <span className="px-3 text-[11px] font-semibold uppercase [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("help.main.help.section.title") }</span>
                        <div className="h-0.5 flex-1 border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    </div>
                    <div className="flex">
                        <div className="h-[130px] w-[170px] shrink-0 bg-[url('/client-assets/images/help/need-help.png?v=2451779')] bg-no-repeat dark:bg-[url('/client-assets/images/help/need-help-dark.png?v=2451779')]" />
                        <div className="ml-3.5">
                            <p className="mb-2.5 text-[13px] font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("help.main.help.title") }</p>
                            <p className="mb-[18px] text-xs !leading-4">{ LocalizeText("help.main.help.content") }</p>
                            <Button onClick={ needHelpClick } disabled={ !GetConfiguration("guides.enabled") }>{ LocalizeText("help.main.help.button") }</Button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="mb-3.5 flex w-full items-center">
                        <span className="px-3 text-[11px] font-semibold uppercase [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("help.main.self.section.title") }</span>
                        <div className="h-0.5 flex-1 border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    </div>
                    <div className="illumina-previewer flex items-center justify-between px-[22px] py-3">
                        <div className="w-[168px]">
                            <p className="mb-2.5 text-center text-[13px] font-semibold underline [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("help.main.self.tips.title") }</p>
                            <p className="text-center text-xs !leading-4">{ LocalizeText("help.main.self.tips.content") }</p>
                        </div>
                        <div className="h-[45px] w-0.5 border-l border-[#CCCCCC] bg-white dark:border-[#36322C] dark:bg-black" />
                        <div className="w-[168px]">
                            <p className="mb-2.5 text-center text-[13px] font-semibold underline [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("help.main.self.way.title") }</p>
                            <p className="text-center text-xs !leading-4">{ LocalizeText("help.main.self.way.content") }</p>
                        </div>
                    </div>
                </div>
                <div className="my-2 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                <div className="illumina-emergency flex h-[68px] items-center justify-between px-[22px] py-[18px]">
                    <div>
                        <p className="mb-1.5 text-sm font-semibold !leading-3 text-white">{ LocalizeText("help.main2.emergency.title") }</p>
                        <p className="text-sm !leading-3 text-white">{ LocalizeText("help.main2.emergency.subtitle") }</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Button onClick={ onEmergencyClick }>{ LocalizeText("help.main2.emergency.button") }</Button>
                        {/* <div className="flex items-center gap-1.5 mt-1.5">
                            <input type="checkbox" id="leaveRoom" className="illumina-input" onChange={() => setIsLeaveRoom(!isLeaveRoom)} />
                            <label htmlFor="leaveRoom" className="text-[13px] text-white">{ LocalizeText("help.main2.emergency.leave") }</label>
                        </div> */}
                    </div>
                </div>
            </NitroBigCardContentView>
        </NitroBigCardView>
    )
}
