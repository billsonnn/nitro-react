import { FC, useContext, useState } from 'react';
import { NitroCardAccordionItemView } from '../../../layout/card/accordion/item/NitroCardAccordionItemView';
import { NitroCardAccordionView } from '../../../layout/card/accordion/NitroCardAccordionView';
import { FriendListContext } from '../FriendListView';
import { FriendListFriendsViewProps } from './FriendListFriendsView.types';

export const FriendListFriendsView: FC<FriendListFriendsViewProps> = props =>
{
    const friendListContext = useContext(FriendListContext);

    const [ isOnlineFriendsExtended, setIsOnlineFriendsExtended ] = useState(false);
    const [ isOfflineFriendsExtended, setIsOfflineFriendsExtended ] = useState(false);

    function toggleOnlineFriends(): void
    {
        setIsOnlineFriendsExtended(value => !value);
    }

    function toggleOfflineFriends(): void
    {
        setIsOfflineFriendsExtended(value => !value);
    }

    return (
        <>
            <NitroCardAccordionView>
                <NitroCardAccordionItemView headerText="Friends (0)">
                    abc
                </NitroCardAccordionItemView>
                <NitroCardAccordionItemView headerText="Offline Friends (0)">
                    abc
                </NitroCardAccordionItemView>
            </NitroCardAccordionView>
        </>
    );
}
