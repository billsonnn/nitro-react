import { GuideSessionFeedbackMessageComposer } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { LocalizeText, SendMessageComposer } from "../../../api"
import { Button, LayoutAvatarImageView } from "../../../common"

interface GuideToolUserFeedbackViewProps
{
    userName: string;
    userFigure: string;
}

export const GuideToolUserFeedbackView: FC<GuideToolUserFeedbackViewProps> = props =>
{
    const { userName = null, userFigure = null } = props

    const giveFeedback = (recommend: boolean) => SendMessageComposer(new GuideSessionFeedbackMessageComposer(recommend))

    return (
        <>
            <div className="flex items-center justify-between bg-white p-2 dark:bg-[#33312b]">
                <div className="flex items-center gap-2">
                    <LayoutAvatarImageView className="!size-[50px] !bg-[center_-21px]" figure={ userFigure } direction={ 2 } headOnly={ true } />
                    <div>
                        <p className="text-[13px] font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ userName }</p>
                        <p className="text-[13px] text-[#666666]">{ LocalizeText("guide.help.request.user.ongoing.guide.desc") }</p>
                    </div>
                </div>
                <Button variant="underline" className="!text-[#727272]">{ LocalizeText("guide.help.common.report.link") }</Button>
            </div>
            <div className="px-3">
                <div className="mt-3.5">
                    <p className="mb-2.5 font-semibold text-[#484848] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.help.request.user.feedback.closed.title") }</p>
                    <p className="text-sm text-[#070707]">{ LocalizeText("guide.help.request.user.feedback.closed.desc") }</p>
                </div>
                { userName && (userName.length > 0) &&
                    <>
                        <div className="mt-5 flex">
                            <div className="h-[89px] w-11 shrink-0 bg-[url('/client-assets/images/help/solved.png?v=2451779')] dark:bg-[url('/client-assets/images/help/solved-dark.png?v=2451779')]" />
                            <div>
                                <div className="mb-[18px] mt-1 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                                <div className="ml-5">
                                    <p className="text-sm font-semibold text-[#1F1F1F] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.help.request.user.feedback.question") }</p>
                                    <div className="mt-2.5 flex gap-3">
                                        <Button onClick={ event => giveFeedback(true) }>{ LocalizeText("guide.help.request.user.feedback.positive.button") }</Button>
                                        <Button onClick={ event => giveFeedback(false) }>{ LocalizeText("guide.help.request.user.feedback.negative.button") }</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </> }
            </div>
        </>
    )
}
