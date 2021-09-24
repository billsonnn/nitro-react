import { FC, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { NitroCardAccordionItemView, NitroCardAccordionView, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../layout';
import { FriendsGroupView } from '../friends-group/FriendsGroupView';
import { FriendsListViewProps } from './FriendsListView.types';

const TABS: string[] = ['friendlist.friends', 'generic.search'];

export const FriendsListView: FC<FriendsListViewProps> = props =>
{
    const { onlineFriends = [], offlineFriends = [], friendRequests = [], onCloseClick = null } = props;
    
    const [ currentTab, setCurrentTab ] = useState<number>(0);

    return (
        <NitroCardView className="nitro-friends">
                <NitroCardHeaderView headerText={ LocalizeText('friendlist.friends') } onCloseClick={ onCloseClick } />
                <NitroCardContentView className="p-0">
                    <NitroCardTabsView>
                        { TABS.map((tab, index) =>
                            {
                                return (<NitroCardTabsItemView key={ index } isActive={ currentTab === index } onClick={ () => setCurrentTab(index) }>
                                    { LocalizeText(tab) }
                                </NitroCardTabsItemView>);
                            }) }
                    </NitroCardTabsView>
                    <div className="text-black">
                        { currentTab === 0 && <NitroCardAccordionView>
                            <NitroCardAccordionItemView headerText={ LocalizeText('friendlist.friends') + ` (${onlineFriends.length})` } defaultState={ true }>
                                <FriendsGroupView list={ onlineFriends } />
                            </NitroCardAccordionItemView>
                            <NitroCardAccordionItemView headerText={ LocalizeText('friendlist.friends.offlinecaption') + ` (${offlineFriends.length})` }>
                                <FriendsGroupView list={ offlineFriends } />
                            </NitroCardAccordionItemView>
                            { friendRequests.length > 0 && <NitroCardAccordionItemView headerText={ LocalizeText('friendlist.tab.friendrequests') + ` (${friendRequests.length})` }>
                                <FriendsGroupView list={ friendRequests } />
                            </NitroCardAccordionItemView> }
                        </NitroCardAccordionView> }
                    </div>
                </NitroCardContentView>
            </NitroCardView>
    );
};
