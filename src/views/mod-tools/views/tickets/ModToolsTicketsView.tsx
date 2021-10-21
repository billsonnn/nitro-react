import { IssueMessageData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../layout';
import { useModToolsContext } from '../../context/ModToolsContext';
import { ModToolsTicketsViewProps } from './ModToolsTicketsView.types';
import { ModToolsOpenIssuesTabView } from './open-issues/ModToolsOpenIssuesTabView';

const TABS: string[] = [
    'Open Issues',
    'My Issues',
    'Picked Issues'
];

export const ModToolsTicketsView: FC<ModToolsTicketsViewProps> = props =>
{
    const { onCloseClick = null } = props;
    const { modToolsState = null } = useModToolsContext();
    const { settings = null } = modToolsState;
    const [ currentTab, setCurrentTab ] = useState<number>(0);

    const openIssues = useMemo(() =>
    {
        if(!settings) return [];
        
        return settings.issues.filter(issue => issue.state === IssueMessageData.STATE_OPEN)
    }, [settings]);

    const CurrentTabComponent = useCallback(() =>
    {
        switch(currentTab)
        {
            case 0: return <ModToolsOpenIssuesTabView openIssues={openIssues}/>;
            default: return null;
        }
    }, [currentTab, openIssues]);

    console.log(settings);

    return (
        <NitroCardView className="nitro-mod-tools-tickets" simple={ false }>
            <NitroCardHeaderView headerText={ 'Tickets' } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="p-0 text-black">
                <NitroCardTabsView>
                    { TABS.map((tab, index) =>
                        {
                            return (<NitroCardTabsItemView key={ index } isActive={ currentTab === index } onClick={ () => setCurrentTab(index) }>
                                { tab }
                            </NitroCardTabsItemView>);
                        }) }
                </NitroCardTabsView>
                <div className="p-2">
                    {settings && <CurrentTabComponent /> }
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
