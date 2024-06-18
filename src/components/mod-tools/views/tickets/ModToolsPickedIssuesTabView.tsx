import { IssueMessageData } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { Column, Grid } from '../../../../common';

interface ModToolsPickedIssuesTabViewProps
{
    pickedIssues: IssueMessageData[];
}

export const ModToolsPickedIssuesTabView: FC<ModToolsPickedIssuesTabViewProps> = props =>
{
    const { pickedIssues = null } = props;

    return (
        <Column gap={ 0 } overflow="hidden">
            <Column gap={ 2 }>
                <Grid className="text-black font-bold	 border-bottom pb-1" gap={ 1 }>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-3">Room/Player</div>
                    <div className="col-span-4">Opened</div>
                    <div className="col-span-3">Picker</div>
                </Grid>
            </Column>
            <Column className="striped-children" gap={ 0 } overflow="auto">
                { pickedIssues && (pickedIssues.length > 0) && pickedIssues.map(issue =>
                {
                    return (
                        <Grid key={ issue.issueId } alignItems="center" className="text-black py-1 border-bottom" gap={ 1 }>
                            <div className="col-span-2">{ issue.categoryId }</div>
                            <div className="col-span-3">{ issue.reportedUserName }</div>
                            <div className="col-span-4">{ new Date(Date.now() - issue.issueAgeInMilliseconds).toLocaleTimeString() }</div>
                            <div className="col-span-3">{ issue.pickerUserName }</div>
                        </Grid>
                    );
                }) }
            </Column>
        </Column>
    );
};
