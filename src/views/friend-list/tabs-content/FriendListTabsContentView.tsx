import { FC, useContext } from 'react';
import { FriendListContext } from '../FriendListView';
import { FriendListTabs } from '../FriendListView.types';
import { FriendListTabsContentViewProps } from './FriendListTabsContentView.types';
import { FriendListTabFriendsView } from './friends/FriendListTabFriendsView';

export const FriendListTabsContentView: FC<FriendListTabsContentViewProps> = props =>
{
    const friendListContext = useContext(FriendListContext);
    
    return (
        <div className="px-3 pb-3">
            { friendListContext && friendListContext.currentTab && friendListContext.currentTab === FriendListTabs.FRIENDS && <FriendListTabFriendsView /> }
            { friendListContext && friendListContext.currentTab && friendListContext.currentTab === FriendListTabs.REQUESTS }
            { friendListContext && friendListContext.currentTab && friendListContext.currentTab === FriendListTabs.SEARCH }
        </div>
    );
}
