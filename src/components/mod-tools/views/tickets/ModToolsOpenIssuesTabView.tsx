import { IssueMessageData, PickIssuesMessageComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { SendMessageComposer } from '../../../../api';
import { Base, Button, Column, Grid } from '../../../../common';

interface ModToolsOpenIssuesTabViewProps
{
    openIssues: IssueMessageData[];
}

export const ModToolsOpenIssuesTabView: FC<ModToolsOpenIssuesTabViewProps> = props =>
{
    const { openIssues = null } = props;

    return (
        <Column gap={ 0 } overflow="hidden">
            <Column gap={ 2 }>
                <Grid gap={ 1 } className="text-black fw-bold border-bottom pb-1">
                    <Base className="g-col-2">Type</Base>
                    <Base className="g-col-3">Room/Player</Base>
                    <Base className="g-col-4">Opened</Base>
                    <Base className="g-col-3"></Base>
                </Grid>
            </Column>
            <Column overflow="auto" className="striped-children" gap={ 0 }>
                { openIssues && (openIssues.length > 0) && openIssues.map(issue =>
                {
                    return (
                        <Grid key={ issue.issueId } gap={ 1 } alignItems="center" className="text-black py-1 border-bottom">
                            <Base className="g-col-2">{ issue.categoryId }</Base>
                            <Base className="g-col-3">{ issue.reportedUserName }</Base>
                            <Base className="g-col-4">{ new Date(Date.now() - issue.issueAgeInMilliseconds).toLocaleTimeString() }</Base>
                            <Base className="g-col-3">
                                <Button variant="success" onClick={ event => SendMessageComposer(new PickIssuesMessageComposer([ issue.issueId ], false, 0, 'pick issue button')) }>Pick Issue</Button>
                            </Base>
                        </Grid>
                    );
                }) }
            </Column>
        </Column>
    );
}
