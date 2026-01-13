import { IssueMessageData, PickIssuesMessageComposer } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { SendMessageComposer } from "../../../../api"
import { Button } from "../../../../common"

interface ModToolsOpenIssuesTabViewProps
{
    openIssues: IssueMessageData[];
}

export const ModToolsOpenIssuesTabView: FC<ModToolsOpenIssuesTabViewProps> = props =>
{
    const { openIssues = null } = props

    return (
        <>
            <div className="mb-1 flex">
                <p className="w-[162px] text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Type</p>
                <p className="w-[184px] text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Player</p>
                <p className="w-[130px] text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Open</p>
            </div>
            <div className="illumina-scrollbar h-[140px]">
                { openIssues && (openIssues.length > 0) && openIssues.map(issue => (
                    <div key={ issue.issueId } className="flex items-center py-1 odd:bg-[#EEEEEE] dark:odd:bg-[#27251f]">
                        <p className="w-[162px] text-[13px] !leading-3">{ issue.categoryId }</p>
                        <p className="w-[184px] text-[13px] !leading-3">{ issue.reportedUserName }</p>
                        <div className="flex items-center">
                            <p className="w-[100px] text-[13px] !leading-3">{ new Date(Date.now() - issue.issueAgeInMilliseconds).toLocaleTimeString() }</p>
                            <Button onClick={ event => SendMessageComposer(new PickIssuesMessageComposer([ issue.issueId ], false, 0, "pick issue button")) }>Pick</Button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
