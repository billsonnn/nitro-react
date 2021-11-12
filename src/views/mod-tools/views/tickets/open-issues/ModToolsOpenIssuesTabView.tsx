import { PickIssuesMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { SendMessageHook } from '../../../../../hooks';
import { ModToolsOpenIssuesTabViewProps } from './ModToolsOpenIssuesTabView.types';

export const ModToolsOpenIssuesTabView: FC<ModToolsOpenIssuesTabViewProps> = props =>
{
    const { openIssues = null } = props;

    const onPickIssue = useCallback((issueId: number) =>
    {
        SendMessageHook(new PickIssuesMessageComposer([issueId], false, 0, 'pick issue button'));
    }, []);

    return (
        <>
            <table className="table text-black table-striped">
                <thead>
                    <tr>
                        <th scope="col">Type</th>
                        <th scope="col">Room/Player</th>
                        <th scope="col">Opened</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {openIssues.map(issue =>
                        {
                            return (
                            <tr className="text-black" key={issue.issueId}>
                                <td>{issue.categoryId}</td>
                                <td>{issue.reportedUserName}</td>
                                <td>{new Date(Date.now() - issue.issueAgeInMilliseconds).toLocaleTimeString()}</td>
                                <td><button className="btn btn-sm btn-success" onClick={() => onPickIssue(issue.issueId)}>Pick Issue</button></td>
                            </tr>)
                        })
                    }
                </tbody>
            </table>
        </>
    );
}
