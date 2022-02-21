import { IssueMessageData, ReleaseIssuesMessageComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { Base, Button, Column, Grid } from '../../../../common';
import { SendMessageHook } from '../../../../hooks';

interface ModToolsMyIssuesTabViewProps
{
    myIssues: IssueMessageData[];
    onIssueHandleClick(issueId: number): void;
}

export const ModToolsMyIssuesTabView: FC<ModToolsMyIssuesTabViewProps> = props =>
{
    const { myIssues = null, onIssueHandleClick = null } = props;

    const onReleaseIssue = (issueId: number) => SendMessageHook(new ReleaseIssuesMessageComposer([issueId]));

    return (
        <Column gap={ 0 } overflow="hidden">
            <Column gap={ 2 }>
                <Grid gap={ 1 } className="text-black fw-bold border-bottom pb-1">
                    <Base className="g-col-2">Type</Base>
                    <Base className="g-col-3">Room/Player</Base>
                    <Base className="g-col-3">Opened</Base>
                    <Base className="g-col-2"></Base>
                    <Base className="g-col-2"></Base>
                </Grid>
            </Column>
            <Column overflow="auto" className="striped-children" gap={ 0 }>
                { myIssues && (myIssues.length > 0) && myIssues.map(issue =>
                    {
                        return (
                            <Grid key={ issue.issueId } gap={ 1 } alignItems="center" className="text-black py-1 border-bottom">
                                <Base className="g-col-2">{ issue.categoryId }</Base>
                                <Base className="g-col-3">{ issue.reportedUserName }</Base>
                                <Base className="g-col-3">{ new Date(Date.now() - issue.issueAgeInMilliseconds).toLocaleTimeString() }</Base>
                                <Base className="g-col-2">
                                    <Button variant="primary" onClick={ event => onIssueHandleClick(issue.issueId) }>Handle</Button>
                                </Base>
                                <Base className="g-col-2">
                                    <Button variant="danger" onClick={ event => onReleaseIssue(issue.issueId) }>Release</Button>
                                </Base>
                            </Grid>
                        );
                    }) }
            </Column>
        </Column>
    );
}
