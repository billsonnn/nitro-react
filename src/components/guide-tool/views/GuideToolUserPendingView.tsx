import { GuideSessionRequesterCancelsMessageComposer } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { LocalizeText, SendMessageComposer } from "../../../api"
import { Button } from "../../../common"

interface GuideToolUserPendingViewProps
{
    helpRequestDescription: string;
    helpRequestAverageTime: number;
}

export const GuideToolUserPendingView: FC<GuideToolUserPendingViewProps> = props =>
{
    const { helpRequestDescription = null, helpRequestAverageTime = 0 } = props

    const cancelRequest = () => SendMessageComposer(new GuideSessionRequesterCancelsMessageComposer())

    return (
        <div className="flex flex-col items-center">
            <div className="illumina-previewer flex min-h-[100px] w-full gap-5 px-3 pt-3.5">
                <div className="dark:g-[url('/client-assets/images/help/help-request-pending-dark.png?v=2451779')] h-[60px] w-[50px] shrink-0 self-end bg-[url('/client-assets/images/help/help-request-pending.png?v=2451779')]" />
                <div className="w-[calc(100%-70px)]">
                    <p className="mb-3.5 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.help.request.type.1") }</p>
                    <p className="break-words pb-3.5 text-sm text-[#1F1F1F]">{ helpRequestDescription }</p>
                </div>
            </div>
            <div className="mt-3.5">
                <p className="mb-2 font-semibold text-[#484848] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.help.request.user.pending.info.title") }</p>
                <p className="mb-3.5 text-[13px] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.help.request.user.pending.info.message") }</p>
                <p className="text-xs font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.help.request.user.pending.info.waiting", [ "waitingtime" ], [ helpRequestAverageTime.toString() ]) }</p>
            </div>
            <div className="my-3 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
            <Button className="w-fit gap-1.5" onClick={ cancelRequest }>
                <div className="mt-px h-3 w-[11px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-270px_-70px]" />
                <p>{ LocalizeText("guide.help.request.user.pending.cancel.button") }</p>
            </Button>
        </div>
    )
}
