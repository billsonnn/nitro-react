import { IssueMessageData } from '@nitrots/nitro-renderer';

export interface ModToolsMyIssuesTabViewProps
{
    myIssues: IssueMessageData[];
    onIssueHandleClick(issueId: number): void;
}
