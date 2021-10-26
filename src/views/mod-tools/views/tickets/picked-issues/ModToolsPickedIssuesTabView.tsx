import { FC } from 'react';
import { ModToolsPickedIssuesTabViewProps } from './ModToolsPickedIssuesTabView.types';

export const ModToolsPickedIssuesTabView: FC<ModToolsPickedIssuesTabViewProps> = props =>
{
    const { pickedIssues = null } = props;
    
    return (
        <>
        <table className="table text-black table-striped">
                <thead>
                    <tr>
                        <th scope="col">Type</th>
                        <th scope="col">Room/Player</th>
                        <th scope="col">Opened</th>
                        <th scope="col">Picker</th>
                    </tr>
                </thead>
                <tbody>
                    {pickedIssues.map(issue =>
                        {
                            return (
                            <tr className="text-black" key={issue.issueId}>
                                <td>{issue.categoryId}</td>
                                <td>{issue.reportedUserName}</td>
                                <td>{new Date(Date.now() - issue.issueAgeInMilliseconds).toLocaleTimeString()}</td>
                                <td>{issue.pickerUserName}</td>
                            </tr>)
                        })
                    }
                </tbody>
            </table>
        </>
    );
}
