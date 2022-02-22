import { IssueMessageData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { GetSessionDataManager } from '../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../layout';
import { useModToolsContext } from '../../ModToolsContext';
import { ModToolsIssueInfoView } from './ModToolsIssueInfoView';
import { ModToolsMyIssuesTabView } from './ModToolsMyIssuesTabView';
import { ModToolsOpenIssuesTabView } from './ModToolsOpenIssuesTabView';
import { ModToolsPickedIssuesTabView } from './ModToolsPickedIssuesTabView';

interface ModToolsTicketsViewProps
{
    onCloseClick: () => void;
}

const TABS: string[] = [
    'Open Issues',
    'My Issues',
    'Picked Issues'
];

export const ModToolsTicketsView: FC<ModToolsTicketsViewProps> = props =>
{
    const { onCloseClick = null } = props;
    const { modToolsState = null } = useModToolsContext();
    const { tickets= null } = modToolsState;
    const [ currentTab, setCurrentTab ] = useState<number>(0);
    const [ issueInfoWindows, setIssueInfoWindows ] = useState<number[]>([]);

    const openIssues = useMemo(() =>
    {
        if(!tickets) return [];
        
        return tickets.filter(issue => issue.state === IssueMessageData.STATE_OPEN);
    }, [tickets]);

    const myIssues = useMemo(() =>
    {
        if(!tickets) return [];

        return tickets.filter(issue => (issue.state === IssueMessageData.STATE_PICKED) && (issue.pickerUserId === GetSessionDataManager().userId));
    }, [tickets]);

    const pickedIssues = useMemo(() =>
    {
        if(!tickets) return [];

        return tickets.filter(issue => issue.state === IssueMessageData.STATE_PICKED);
    }, [tickets]);

    const onIssueInfoClosed = useCallback((issueId: number) =>
    {
        const indexOfValue = issueInfoWindows.indexOf(issueId);

        if(indexOfValue === -1) return;

        const newValues = Array.from(issueInfoWindows);
        newValues.splice(indexOfValue, 1);
        setIssueInfoWindows(newValues);
    }, [issueInfoWindows]);
    
    const onIssueHandleClicked = useCallback((issueId: number) =>
    {
        if(issueInfoWindows.indexOf(issueId) === -1)
        {
            const newValues = Array.from(issueInfoWindows);
            newValues.push(issueId);
            setIssueInfoWindows(newValues);
        }
        else 
        {
            onIssueInfoClosed(issueId);
        }
    }, [issueInfoWindows, onIssueInfoClosed]);

    const CurrentTabComponent = useCallback(() =>
    {
        switch(currentTab)
        {
            case 0: return <ModToolsOpenIssuesTabView openIssues={openIssues}/>;
            case 1: return <ModToolsMyIssuesTabView myIssues={myIssues} onIssueHandleClick={onIssueHandleClicked}/>;
            case 2: return <ModToolsPickedIssuesTabView pickedIssues={pickedIssues}/>;
            default: return null;
        }
    }, [currentTab, myIssues, onIssueHandleClicked, openIssues, pickedIssues]);

    return (
        <>
            <NitroCardView className="nitro-mod-tools-tickets">
                <NitroCardHeaderView headerText={ 'Tickets' } onCloseClick={ onCloseClick } />
                    <NitroCardTabsView>
                        { TABS.map((tab, index) =>
                            {
                                return (<NitroCardTabsItemView key={ index } isActive={ (currentTab === index) } onClick={ event => setCurrentTab(index) }>
                                    { tab }
                                </NitroCardTabsItemView>);
                            }) }
                    </NitroCardTabsView>
                <NitroCardContentView gap={ 1 }>
                    <CurrentTabComponent />
                </NitroCardContentView>
            </NitroCardView>
            { issueInfoWindows && (issueInfoWindows.length > 0) && issueInfoWindows.map(issueId => <ModToolsIssueInfoView key={ issueId } issueId={ issueId } onIssueInfoClosed={ onIssueInfoClosed } />) }
        </>
    );
}
