import { FC, useState } from 'react';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../layout';
import { ModToolsTicketsViewProps } from './ModToolsTicketsView.types';

const TABS: string[] = [
    'Open Issues',
    'My Issues',
    'Picked Issues'
];

export const ModToolsTicketsView: FC<ModToolsTicketsViewProps> = props =>
{
    const { onCloseClick = null } = props;

    const [ currentTab, setCurrentTab ] = useState<number>(0);

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
                <div className="p-2"></div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
