import { IssueMessageData } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { Column } from "../../../../common"

interface ModToolsPickedIssuesTabViewProps
{
    pickedIssues: IssueMessageData[];
}

export const ModToolsPickedIssuesTabView: FC<ModToolsPickedIssuesTabViewProps> = props =>
{
    const { pickedIssues = null } = props
    
    return (
        <Column gap={ 0 } overflow="hidden">
            <div className="mb-1 flex">
                <p className="w-[100px] text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Type</p>
                <p className="w-[150px] text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Player</p>
                <p className="w-[150px] text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Open</p>
                <p className="w-[110px] text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Picker</p>
            </div>
            <div className="illumina-scrollbar h-[140px]">
                { pickedIssues && (pickedIssues.length > 0) && pickedIssues.map(issue =>
                {
                    return (
                        <div key={ issue.issueId } className="flex items-center py-0.5 odd:bg-[#EEEEEE] dark:odd:bg-[#27251f]">
                            <p className="w-[100px] text-[13px] !leading-3">{ issue.categoryId }</p>
                            <p className="w-[150px] text-[13px] !leading-3">{ issue.reportedUserName }</p>
                            <p className="w-[150px] text-[13px] !leading-3">{ new Date(Date.now() - issue.issueAgeInMilliseconds).toLocaleTimeString() }</p>
                            <p className="w-[110px] text-[13px] !leading-3">{ issue.pickerUserName }</p>
                        </div>
                    )
                }) }
            </div>
        </Column>
    )
}
