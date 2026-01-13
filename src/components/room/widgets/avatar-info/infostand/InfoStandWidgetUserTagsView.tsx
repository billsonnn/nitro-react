import { NavigatorSearchComposer } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { CreateLinkEvent, SendMessageComposer } from "../../../../../api"

interface InfoStandWidgetUserTagsViewProps
{
    tags: string[];
}

const processAction = (tag: string) =>
{
    CreateLinkEvent(`navigator/search/${ tag }`)
    SendMessageComposer(new NavigatorSearchComposer("hotel_view", `tag:${ tag }`))
}

export const InfoStandWidgetUserTagsView: FC<InfoStandWidgetUserTagsViewProps> = props =>
{
    const { tags = null } = props

    if(!tags || !tags.length) return null

    return (
        <>
            <div className="mb-[7px] mt-1 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
            <div className="flex flex-wrap gap-0.5">
                { tags && (tags.length > 0) && tags.map((tag, index) => <div key={ index } className="illumina-card-item break-word px-[7px] py-[5px] text-sm !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" onClick={ event => processAction(tag) }>{ tag }</div>) }
            </div>
        </>
    )
}
