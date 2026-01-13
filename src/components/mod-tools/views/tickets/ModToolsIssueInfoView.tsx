import { CloseIssuesMessageComposer, ReleaseIssuesMessageComposer } from "@nitrots/nitro-renderer"
import { FC, useState } from "react"
import { SendMessageComposer } from "../../../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useModTools } from "../../../../hooks"
import { ModToolsUserInfo } from "../user/ModToolsUserInfo"
import { CfhChatlogView } from "./CfhChatlogView"

interface IssueInfoViewProps
{
    issueId: number;
    onIssueInfoClosed(issueId: number): void;
}

export const ModToolsIssueInfoView: FC<IssueInfoViewProps> = props =>
{
    const { issueId = null, onIssueInfoClosed = null } = props
    const [ cfhChatlogOpen, setcfhChatlogOpen ] = useState(false)
    const { tickets = [], openUserInfo = null } = useModTools()
    const ticket = tickets.find(issue => (issue.issueId === issueId))

    const releaseIssue = (issueId: number) =>
    {
        SendMessageComposer(new ReleaseIssuesMessageComposer([ issueId ]))

        onIssueInfoClosed(issueId)
    }

    const closeIssue = (resolutionType: number) =>
    {
        SendMessageComposer(new CloseIssuesMessageComposer([ issueId ], resolutionType))

        onIssueInfoClosed(issueId)
    }
    
    return (
        <>
            <NitroCardView uniqueKey="mod-tools-handle-issue" className="illumina-mod-tools-handle-issue">
                <NitroCardHeaderView headerText="Issue handling" onCloseClick={ () => onIssueInfoClosed(issueId) } />
                <NitroCardContentView>
                    <div className="flex gap-1.5">
                        <div className="flex flex-col gap-1.5">
                            <div className="illumina-input min-h-[70px] p-1.5">
                                <div className="mb-1 flex gap-1">
                                    <p className="w-[90px] text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Caller</p>
                                    <p className="w-[90px] text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Category</p>
                                    <p className="w-[90px] text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Reported User</p>
                                </div>
                                <div className="flex items-center gap-1 py-1 even:bg-[#EEEEEE] dark:even:bg-[#33312B]">
                                    <p className="w-[90px] text-[13px] !leading-3" onClick={ event => openUserInfo(ticket.reporterUserId) }>{ ticket.reporterUserName }</p>
                                    <p className="w-[90px] overflow-hidden truncate text-[13px] !leading-3">Other</p>
                                    <p className="w-[90px] text-[13px] !leading-3" onClick={ event => openUserInfo(ticket.reportedUserId) }>{ ticket.reportedUserName }</p>
                                </div>
                            </div>
                            <div>
                                <p className="mb-1.5 text-center text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">User Info</p>
                                <ModToolsUserInfo userId={ ticket.reporterUserId } />
                            </div>
                            <div>
                                <p className="mb-1.5 text-center text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">User Info</p>
                                <ModToolsUserInfo userId={ ticket.reportedUserId } />
                            </div>
                        </div>
                        <div className="w-[120px]">
                            <div className="mb-1.5 flex flex-col gap-1">
                                <Button onClick={ event => closeIssue(CloseIssuesMessageComposer.RESOLUTION_USELESS) }>Close as useless</Button>
                                <Button onClick={ event => closeIssue(CloseIssuesMessageComposer.RESOLUTION_ABUSIVE) }>Close as abusive</Button>
                                <Button onClick={ event => closeIssue(CloseIssuesMessageComposer.RESOLUTION_RESOLVED) }>Close as resolved</Button> 
                                <Button onClick={ event => releaseIssue(issueId) } >Release</Button>
                            </div>
                            <div className="mb-9 flex gap-1.5 opacity-50">
                                <input type="checkbox" className="illumina-input" />
                                <label className="text-xs">Open next issue automatically when this one is closed.</label>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Button className="w-full" disabled>To player support</Button>
                                <Button className="w-full" onClick={ () => setcfhChatlogOpen(!cfhChatlogOpen) }>Chatlog</Button>
                            </div>
                        </div>
                    </div>
                </NitroCardContentView>
            </NitroCardView>
            { cfhChatlogOpen &&
                <CfhChatlogView issueId={ issueId } onCloseClick={ () => setcfhChatlogOpen(false) }/> }
        </>
    )
}
