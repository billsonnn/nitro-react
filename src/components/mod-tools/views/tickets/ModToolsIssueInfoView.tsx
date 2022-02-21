import { CloseIssuesMessageComposer, ReleaseIssuesMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Button, Column, Grid, Text } from '../../../../common';
import { ModToolsOpenUserInfoEvent } from '../../../../events/mod-tools/ModToolsOpenUserInfoEvent';
import { dispatchUiEvent, SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { getSourceName } from '../../common/IssueCategoryNames';
import { useModToolsContext } from '../../ModToolsContext';
import { CfhChatlogView } from './CfhChatlogView';

interface IssueInfoViewProps
{
    issueId: number;
    onIssueInfoClosed(issueId: number): void;
}

export const ModToolsIssueInfoView: FC<IssueInfoViewProps> = props =>
{
    const { issueId = null, onIssueInfoClosed = null } = props;
    const { modToolsState = null } = useModToolsContext();
    const { tickets = null } = modToolsState;
    const [ cfhChatlogOpen, setcfhChatlogOpen ] = useState(false);

    const ticket = useMemo(() =>
    {
        if(!tickets || !tickets.length) return null;

        return tickets.find(issue => issue.issueId === issueId);
    }, [ issueId, tickets ]);

    const releaseIssue = (issueId: number) =>
    {
        SendMessageHook(new ReleaseIssuesMessageComposer([ issueId ]));

        onIssueInfoClosed(issueId);
    }

    const closeIssue = (resolutionType: number) =>
    {
        SendMessageHook(new CloseIssuesMessageComposer([ issueId ], resolutionType));

        onIssueInfoClosed(issueId)
    }

    const openUserInfo = (userId: number) => dispatchUiEvent(new ModToolsOpenUserInfoEvent(userId));
    
    return (
        <>
            <NitroCardView className="nitro-mod-tools-handle-issue" simple>
                <NitroCardHeaderView headerText={'Resolving issue ' + issueId} onCloseClick={() => onIssueInfoClosed(issueId)} />
                <NitroCardContentView className="text-black">
                    <Text fontSize={ 4 }>Issue Information</Text>
                    <Grid>
                        <Column size={ 8 }>
                            <table className="table table-striped table-sm table-text-small text-black m-0">
                                <tbody>
                                    <tr>
                                        <th>Source</th>
                                        <td>{ getSourceName(ticket.categoryId) }</td>
                                    </tr>
                                    <tr>
                                        <th>Category</th>
                                        <td>{ LocalizeText('help.cfh.topic.' + ticket.reportedCategoryId) }</td>
                                    </tr>
                                    <tr>
                                        <th>Description</th>
                                        <td>{ ticket.message }</td>
                                    </tr>
                                    <tr>
                                        <th>Caller</th>
                                        <td>
                                            <Text bold underline pointer onClick={ event => openUserInfo(ticket.reporterUserId) }>{ ticket.reporterUserName }</Text>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Reported User</th>
                                        <td>
                                            <Text bold underline pointer onClick={ event => openUserInfo(ticket.reportedUserId) }>{ ticket.reportedUserName }</Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Column>
                        <Column size={ 4 } gap={ 1 }>
                            <Button variant="secondary" onClick={ () => setcfhChatlogOpen(!cfhChatlogOpen) }>Chatlog</Button>
                            <Button onClick={ event => closeIssue(CloseIssuesMessageComposer.RESOLUTION_USELESS) }>Close as useless</Button>
                            <Button variant="danger" onClick={ event => closeIssue(CloseIssuesMessageComposer.RESOLUTION_ABUSIVE) }>Close as abusive</Button>
                            <Button variant="success" onClick={ event => closeIssue(CloseIssuesMessageComposer.RESOLUTION_RESOLVED) }>Close as resolved</Button> 
                            <Button variant="secondary" onClick={ event => releaseIssue(issueId)} >Release</Button>
                        </Column>
                    </Grid>
                </NitroCardContentView>
            </NitroCardView>
            { cfhChatlogOpen &&
                <CfhChatlogView issueId={ issueId } onCloseClick={ () => setcfhChatlogOpen(false) }/> }
        </>
    );
}
