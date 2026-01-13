import { FC, MouseEvent } from "react"
import { LocalizeText } from "../../../api"
import { Button } from "../../../common"

interface GuideToolUserNoHelpersViewProps
{
    onCloseClick: (event: MouseEvent) => void;
}

export const GuideToolUserNoHelpersView: FC<GuideToolUserNoHelpersViewProps> = props =>
{
    const { onCloseClick = null } = props

    return (
        <>
            <p className="mb-2.5 font-semibold text-[#484848] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.help.request.no_tour_guides.title") }</p>
            <p className="text-sm text-[#070707]">{ LocalizeText("guide.help.request.no_tour_guides.message") }</p>
            <div className="mt-5 flex gap-[30px]">
                <div className="h-[89px] w-11 bg-[url('/client-assets/images/help/solved.png?v=2451779')] dark:bg-[url('/client-assets/images/help/solved-dark.png?v=2451779')]" />
                <Button onClick={ onCloseClick }>{ LocalizeText("guide.help.request.user.thanks.close.button") }</Button>
            </div>
        </>
    )
}