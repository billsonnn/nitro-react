import { ReleaseIssuesMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { SendMessageHook } from '../../../../../hooks';
import { ModToolsMyIssuesTabViewProps } from './ModToolsMyIssuesTabView.types';

export const ModToolsMyIssuesTabView: FC<ModToolsMyIssuesTabViewProps> = props =>
{
    const { myIssues = null, onIssueHandleClick = null } = props;
    

    const onReleaseIssue = useCallback((issueId: number) =>
    {
        SendMessageHook(new ReleaseIssuesMessageComposer([issueId]));
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
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {myIssues.map(issue =>
                        {
                            return (
                            <tr className="text-black" key={issue.issueId}>
                                <td>{issue.categoryId}</td>
                                <td>{issue.reportedUserName}</td>
                                <td>{new Date(Date.now() - issue.issueAgeInMilliseconds).toLocaleTimeString()}</td>
                                <td><button className="btn btn-sm btn-primary" onClick={() => onIssueHandleClick(issue.issueId)}>Handle</button></td>
                                <td><button className="btn btn-sm btn-danger" onClick={() => onReleaseIssue(issue.issueId)}>Release</button></td>
                            </tr>)
                        })
                    }
                </tbody>
            </table>
        </>
    );
}
