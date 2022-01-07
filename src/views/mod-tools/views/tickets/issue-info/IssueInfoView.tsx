import { CloseIssuesMessageComposer, ReleaseIssuesMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../../api';
import { ModToolsOpenUserInfoEvent } from '../../../../../events/mod-tools/ModToolsOpenUserInfoEvent';
import { dispatchUiEvent, SendMessageHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { getSourceName } from '../../../common/IssueCategoryNames';
import { useModToolsContext } from '../../../context/ModToolsContext';
import { CfhChatlogView } from './CfhChatlogView';
import { IssueInfoViewProps } from './IssueInfoView.types';

export const IssueInfoView: FC<IssueInfoViewProps> = props =>
{
    const { issueId = null, onIssueInfoClosed = null } = props;
    const { modToolsState = null } = useModToolsContext();
    const { tickets= null } = modToolsState;
    const [ cfhChatlogOpen, setcfhChatlogOpen ] = useState(false);

    const ticket = useMemo(() =>
    {
        return tickets.find( issue => issue.issueId === issueId);
    }, [issueId, tickets]);

    const onReleaseIssue = useCallback((issueId: number) =>
    {
        SendMessageHook(new ReleaseIssuesMessageComposer([issueId]));
        onIssueInfoClosed(issueId);
    }, [onIssueInfoClosed]);

    const openUserInfo = useCallback((userId: number) =>
    {
        dispatchUiEvent(new ModToolsOpenUserInfoEvent(userId));
    }, []); 

    const closeIssue = useCallback((resolutionType: number) =>
    {
        SendMessageHook(new CloseIssuesMessageComposer([issueId], resolutionType));
        onIssueInfoClosed(issueId)
    }, [issueId, onIssueInfoClosed]);
    
    return (
        <>
        <NitroCardView className="nitro-mod-tools-handle-issue" simple={true}>
            <NitroCardHeaderView headerText={'Resolving issue ' + issueId} onCloseClick={() => onIssueInfoClosed(issueId)} />
            <NitroCardContentView className="text-black">
                <div className="row">
                    <div className="col-8">
                        <h3>Issue Information</h3>
                        <div><span className="fw-bold">Source: </span>{getSourceName(ticket.categoryId)}</div>
                        <div><span className="fw-bold">Category: </span>{LocalizeText('help.cfh.topic.' + ticket.reportedCategoryId)}</div>
                        <div><span className="fw-bold">Description: </span>{ticket.message}</div>
                        <div><span className="fw-bold">Caller: </span><button className="btn btn-link fw-bold text-primary" onClick={() => openUserInfo(ticket.reporterUserId)}>{ticket.reporterUserName}</button></div>
                        <div><span className="fw-bold">Reported User: </span><button className="btn btn-link fw-bold text-danger" onClick={() => openUserInfo(ticket.reportedUserId)}>{ticket.reportedUserName}</button></div>
                    </div>
                    <div className="col-4">
                        <div className="d-grid gap-2 mb-4">
                            <button className="btn btn-secondary" onClick={() => setcfhChatlogOpen(!cfhChatlogOpen)}>Chatlog</button>
                        </div>
                        <div className="d-grid gap-2">
                            <button className="btn btn-primary" onClick={() => closeIssue(CloseIssuesMessageComposer.RESOLUTION_USELESS)}>Close as useless</button>
                            <button className="btn btn-danger" onClick={() => closeIssue(CloseIssuesMessageComposer.RESOLUTION_ABUSIVE)}>Close as abusive</button>
                            <button className="btn btn-success" onClick={() => closeIssue(CloseIssuesMessageComposer.RESOLUTION_RESOLVED)}>Close as resolved</button> 
                            <button className="btn btn-secondary" onClick={() => onReleaseIssue(issueId)}>Release</button>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
        { cfhChatlogOpen && <CfhChatlogView issueId={issueId} onCloseClick={() => setcfhChatlogOpen(false) }/>}
        </>
    );
}
