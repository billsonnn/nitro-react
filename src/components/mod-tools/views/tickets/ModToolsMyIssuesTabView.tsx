import { IssueMessageData, ReleaseIssuesMessageComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { SendMessageComposer } from '../../../../api';
import { Button, Column, Grid } from '../../../../common';

interface ModToolsMyIssuesTabViewProps
{
    myIssues: IssueMessageData[];
    handleIssue: (issueId: number) => void;
}

export const ModToolsMyIssuesTabView: FC<ModToolsMyIssuesTabViewProps> = props =>
{
    const { myIssues = null, handleIssue = null } = props;

    return (
        <Column gap={ 0 } overflow="hidden">
            <Column gap={ 2 }>
                <Grid className="text-black font-bold	 border-bottom pb-1" gap={ 1 }>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-3">Room/Player</div>
                    <div className="col-span-3">Opened</div>
                    <div className="col-span-2"></div>
                    <div className="col-span-2"></div>
                </Grid>
            </Column>
            <Column className="striped-children" gap={ 0 } overflow="auto">
                { myIssues && (myIssues.length > 0) && myIssues.map(issue =>
                {
                    return (
                        <Grid key={ issue.issueId } alignItems="center" className="text-black py-1 border-bottom" gap={ 1 }>
                            <div className="col-span-2">{ issue.categoryId }</div>
                            <div className="col-span-3">{ issue.reportedUserName }</div>
                            <div className="col-span-3">{ new Date(Date.now() - issue.issueAgeInMilliseconds).toLocaleTimeString() }</div>
                            <div className="col-span-2">
                                <Button variant="primary" onClick={ event => handleIssue(issue.issueId) }>Handle</Button>
                            </div>
                            <div className="col-span-2">
                                <Button variant="danger" onClick={ event => SendMessageComposer(new ReleaseIssuesMessageComposer([ issue.issueId ])) }>Release</Button>
                            </div>
                        </Grid>
                    );
                }) }
            </Column>
        </Column>
    );
};
