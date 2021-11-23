import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { NitroCardAccordionSetView, NitroCardAccordionView, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../layout';
import { MessengerFriend } from '../../common/MessengerFriend';
import { FriendsGroupView } from '../friends-group/FriendsGroupView';
import { FriendsRequestView } from '../friends-request/FriendsRequestView';
import { FriendsSearchView } from '../friends-search/FriendsSearchView';
import { FriendsListViewProps } from './FriendsListView.types';

const MODE_FRIENDS: number = 0;
const MODE_SEARCH: number = 1;

export const FriendsListView: FC<FriendsListViewProps> = props =>
{
    const { onlineFriends = [], offlineFriends = [], friendRequests = [], onCloseClick = null } = props;
    const [ selectedFriends, setSelectedFriends ] = useState<MessengerFriend[]>([]);
    const [ mode, setMode ] = useState<number>(0);

    useEffect(() =>
    {
        setSelectedFriends([]);
    }, [ onlineFriends, offlineFriends ]);

    return (
        <NitroCardView className="nitro-friends" uniqueKey="nitro-friends">
            <NitroCardHeaderView headerText={ LocalizeText('friendlist.friends') } onCloseClick={ onCloseClick } />
            <NitroCardTabsView>
                <NitroCardTabsItemView isActive={ (mode === MODE_FRIENDS) } count={ friendRequests.length } onClick={ event => setMode(MODE_FRIENDS) }>
                    { LocalizeText('friendlist.friends') }
                </NitroCardTabsItemView>
                <NitroCardTabsItemView isActive={ (mode === MODE_SEARCH) } onClick={ event => setMode(MODE_SEARCH) }>
                    { LocalizeText('generic.search') }
                </NitroCardTabsItemView>
            </NitroCardTabsView>
            <NitroCardContentView className="p-0 text-black">
                { (mode === MODE_FRIENDS) &&
                    <NitroCardAccordionView>
                        <NitroCardAccordionSetView headerText={ LocalizeText('friendlist.friends') + ` (${onlineFriends.length})` } isExpanded={ true }>
                            <FriendsGroupView list={ onlineFriends } />
                        </NitroCardAccordionSetView>
                        <NitroCardAccordionSetView headerText={ LocalizeText('friendlist.friends.offlinecaption') + ` (${offlineFriends.length})` }>
                            <FriendsGroupView list={ offlineFriends } />
                        </NitroCardAccordionSetView>
                        <FriendsRequestView requests={ friendRequests } />
                    </NitroCardAccordionView> }
                { (mode === MODE_SEARCH) &&
                    <FriendsSearchView /> }
            </NitroCardContentView>
        </NitroCardView>
    );
};
