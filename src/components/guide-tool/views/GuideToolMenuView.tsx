import { FC } from "react"
import { LocalizeText } from "../../../api"

interface GuideToolMenuViewProps
{
    isOnDuty: boolean;
    isHandlingGuideRequests: boolean;
    setIsHandlingGuideRequests: (value: boolean) => void;
    isHandlingHelpRequests: boolean;
    setIsHandlingHelpRequests: (value: boolean) => void;
    isHandlingBullyReports: boolean;
    setIsHandlingBullyReports: (value: boolean) => void;
    guidesOnDuty: number;
    helpersOnDuty: number;
    guardiansOnDuty: number;
    processAction: (action: string) => void;
}

export const GuideToolMenuView: FC<GuideToolMenuViewProps> = props =>
{
    const {
        isOnDuty = false,
        isHandlingGuideRequests = false,
        setIsHandlingGuideRequests = null,
        isHandlingHelpRequests = false,
        setIsHandlingHelpRequests = null,
        isHandlingBullyReports = false,
        setIsHandlingBullyReports = null,
        guidesOnDuty = 0,
        helpersOnDuty = 0,
        guardiansOnDuty = 0,
        processAction = null
    } = props
    
    return (
        <>
            <div className="illumina-previewer mb-2 p-3.5">
                <div className="flex items-end gap-2">
                    <input type="checkbox" className="illumina-input toggle" checked={ isOnDuty } onChange={ event => processAction("toggle_duty") } />
                    <div className="flex flex-col gap-1">
                        <p className="text-[13px] !leading-3 text-[#797979] [text-shadow:_0_1px_0_#fff] dark:text-white/60 dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.help.guide.tool.yourstatus") }</p>
                        <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText(`guide.help.guide.tool.duty.${ (isOnDuty ? "on" : "off") }`) }</p>
                    </div>
                </div>
            </div>
            <div className={`flex flex-col gap-1 ${isOnDuty ? "opacity-25" : "opacity-100"}`}>
                <p className="mb-1 text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.help.guide.tool.tickettypeselection.caption") }</p>
                <div className="flex items-center gap-2">
                    <input disabled={ isOnDuty } type="checkbox" className="illumina-input" checked={ isHandlingGuideRequests } onChange={ event => setIsHandlingGuideRequests(event.target.checked) } />
                    <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.help.guide.tool.tickettypeselection.guiderequests") }</p>
                </div>
                <div className="flex items-center gap-2">
                    <input disabled={ isOnDuty } type="checkbox" className="illumina-input" checked={ isHandlingHelpRequests } onChange={ event => setIsHandlingHelpRequests(event.target.checked) } />
                    <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.help.guide.tool.tickettypeselection.onlyhelprequests") }</p>
                </div>
                <div className="flex items-center gap-2">
                    <input disabled={ isOnDuty } type="checkbox" className="illumina-input" checked={ isHandlingBullyReports } onChange={ event => setIsHandlingBullyReports(event.target.checked) } />
                    <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.help.guide.tool.tickettypeselection.bullyreports") }</p>
                </div>
            </div>
            <div className="my-2 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
            <div className="ml-1 flex items-center gap-2">
                <i className="block h-6 w-[23px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-247px_-253px]" />
                <div className="flex flex-col gap-1">
                    <p className="text-[13px] !leading-3 text-[#010101] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" dangerouslySetInnerHTML={ { __html: LocalizeText("guide.help.guide.tool.helpersonduty", [ "amount" ], [ helpersOnDuty.toString() ]) } } />
                    <p className="text-[13px] !leading-3 text-[#010101] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" dangerouslySetInnerHTML={ { __html: LocalizeText("guide.help.guide.tool.guardiansonduty", [ "amount" ], [ guardiansOnDuty.toString() ]) } } />
                </div>
            </div>
            {/* <div className="my-2 h-0.5 w-full border-b border-white dark:border-[#36322C] bg-[#CCCCCC] dark:bg-black" />
            <div className="flex justify-center">
                <Button variant="underline" className="!text-[13px]" disabled>{ LocalizeText("guide.help.guide.tool.skill.link") }</Button>
            </div> */}
        </>
    )
}
