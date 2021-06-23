import { FC, useState } from 'react';
import { NitroCardAccordionItemView } from '../../../../layout/card/accordion/item/NitroCardAccordionItemView';
import { NitroCardAccordionView } from '../../../../layout/card/accordion/NitroCardAccordionView';
import { useFriendListContext } from '../../context/FriendListContext';
import { FriendListFriendsViewProps } from './FriendListFriendsView.types';

export const FriendListFriendsView: FC<FriendListFriendsViewProps> = props =>
{
    const { friendListState = null } = useFriendListContext();

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
