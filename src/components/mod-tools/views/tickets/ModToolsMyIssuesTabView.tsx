import { IssueMessageData, ReleaseIssuesMessageComposer } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { SendMessageComposer } from "../../../../api"
import { Button } from "../../../../common"

interface ModToolsMyIssuesTabViewProps
{
    myIssues: IssueMessageData[];
    handleIssue: (issueId: number) => void;
}

export const ModToolsMyIssuesTabView: FC<ModToolsMyIssuesTabViewProps> = props =>
{
    const { myIssues = null, handleIssue = null } = props

    return (
        <>
            <div className="mb-1 flex">
                <p className="w-[162px] text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Type</p>
                <p className="w-[110px] text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Player</p>
                <p className="w-[220px] text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Open</p>
            </div>
            <div className="illumina-scrollbar h-[140px]">
                { myIssues && (myIssues.length > 0) && myIssues.map(issue => (
                    <div key={ issue.issueId } className="flex items-center py-0.5 odd:bg-[#EEEEEE] dark:odd:bg-[#27251f]">
                        <p className="w-[162px] text-[13px] !leading-3">{ issue.categoryId }</p>
                        <p className="w-[110px] text-[13px] !leading-3">{ issue.reportedUserName }</p>
                        <div className="flex w-[220px] items-center gap-0.5">
                            <div className="pr-3 text-[13px] !leading-3">{ new Date(Date.now() - issue.issueAgeInMilliseconds).toLocaleTimeString() }</div>
                            <Button onClick={ event => handleIssue(issue.issueId) }>Handle</Button>
                            <Button onClick={ event => SendMessageComposer(new ReleaseIssuesMessageComposer([ issue.issueId ])) }>Release</Button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
