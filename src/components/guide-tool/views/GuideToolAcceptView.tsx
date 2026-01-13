import { GuideSessionGuideDecidesMessageComposer } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { LocalizeText, SendMessageComposer } from "../../../api"
import { Button } from "../../../common"

interface GuideToolAcceptViewProps
{
    helpRequestDescription: string;
    helpRequestAverageTime: number;
}

export const GuideToolAcceptView: FC<GuideToolAcceptViewProps> = props =>
{
    const { helpRequestDescription = null } = props
    
    const answerRequest = (response: boolean) => SendMessageComposer(new GuideSessionGuideDecidesMessageComposer(response))

    return (
        <>
            <div className="mb-0.5 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
            <div className="flex h-[212px] gap-5 bg-white px-4 pb-2.5 pt-8 dark:bg-[#33312b]">
                <div className="mt-px h-[45px] w-[37px] shrink-0 bg-[url('/client-assets/images/help/reporter.png?v=2451779')]" />
                <div className="flex flex-col justify-between">
                    <div>
                        <p className="mb-1 text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.help.request.guide.accept.request.title") }</p>
                        <p className="flex-1 break-words text-[13px] text-[#1F1F1F]">{ helpRequestDescription }</p>
                    </div>
                    <div className="mt-5 flex flex-col gap-2">
                        <Button className="w-fit gap-1.5" onClick={ event => answerRequest(true) }>
                            <i className="block h-3.5 w-4 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-180px_-83px]" />
                            { LocalizeText("guide.help.request.guide.accept.accept.button") }
                        </Button>
                        <Button variant="underline" className="w-fit" onClick={ event => answerRequest(false) }>
                            { LocalizeText("guide.help.request.guide.accept.skip.link") }
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mt-1.5 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
        </>
    )
}
