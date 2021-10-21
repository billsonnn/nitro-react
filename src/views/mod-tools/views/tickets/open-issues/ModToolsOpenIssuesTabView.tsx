import { FC } from 'react';
import { ModToolsOpenIssuesTabViewProps } from './ModToolsOpenIssuesTabView.types';

export const ModToolsOpenIssuesTabView: FC<ModToolsOpenIssuesTabViewProps> = props =>
{
    const { openIssues = null } = props;

    return (
        <div>{openIssues.length}</div>
    );
}
