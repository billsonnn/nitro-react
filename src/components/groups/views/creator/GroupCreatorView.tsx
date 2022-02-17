import { GroupBuyComposer, GroupBuyDataComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { HasHabboClub, LocalizeText } from '../../../../api';
import { Base, Button, Column, Flex, Text } from '../../../../common';
import { SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { NotificationUtilities } from '../../../../views/notification-center/common/NotificationUtilities';
import { useGroupsContext } from '../../GroupsContext';
import { GroupsActions } from '../../reducers/GroupsReducer';
import { GroupTabBadgeView } from '../tabs/GroupTabBadgeView';
import { GroupTabColorsView } from '../tabs/GroupTabColorsView';
import { GroupTabIdentityView } from '../tabs/GroupTabIdentityView';
import { GroupCreatorTabConfirmationView } from './GroupCreatorTabConfirmationView';

const TABS: number[] = [1, 2, 3, 4];

interface GroupCreatorViewProps
{
    isVisible: boolean;
    onClose: () => void;
}

export const GroupCreatorView: FC<GroupCreatorViewProps> = props =>
{
    const { isVisible = false, onClose = null } = props;
    const [ currentTab, setCurrentTab ] = useState<number>(1);
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { groupName = null, groupDescription = null, groupHomeroomId = null, groupColors = null, groupBadgeParts = null } = groupsState;

    const buyGroup = useCallback(() =>
    {
        if(!groupBadgeParts) return;

        const badge = [];

        groupBadgeParts.forEach((part) =>
        {
            if(part.code)
            {
                badge.push(part.key);
                badge.push(part.color);
                badge.push(part.position);
            }
        });

        SendMessageHook(new GroupBuyComposer(groupName, groupDescription, groupHomeroomId, groupColors[0], groupColors[1], badge));
    }, [ groupName, groupDescription, groupHomeroomId, groupColors, groupBadgeParts ]);

    const previousStep = useCallback(() =>
    {
        if(currentTab === 1) return onClose();

        setCurrentTab(value => value - 1);
    }, [ currentTab, onClose ]);

    const nextStep = useCallback(() =>
    {
        switch(currentTab)
        {
            case 1: {
                if(!groupName || groupName.length === 0 || !groupHomeroomId)
                {
                    NotificationUtilities.simpleAlert(LocalizeText('group.edit.error.no.name.or.room.selected'));

                    return;
                }

                break;
            }
            case 4:
                buyGroup();
                break;
        }

        setCurrentTab(value => (value === 4 ? value : value + 1));
    }, [ currentTab, groupName, groupHomeroomId, buyGroup ]);

    useEffect(() =>
    {
        if(!isVisible)
        {
            setCurrentTab(1);

            dispatchGroupsState({
                type: GroupsActions.RESET_GROUP_SETTINGS
            });

            return;
        }
        
        SendMessageHook(new GroupBuyDataComposer());
    }, [ isVisible, dispatchGroupsState ]);

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-group-creator" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('group.create.title') } onCloseClick={ onClose } />
            <NitroCardContentView>
                <Flex className="creator-tabs">
                    { TABS.map((tab, index) =>
                        {
                            return (
                                <Flex center key={ index } className={ `tab tab-${ ((tab === 1) ? 'blue-flat' : (tab === 4) ? 'yellow' : 'blue-arrow') } ${ (currentTab === tab) ? 'active' : '' }` }>
                                    <Text variant="white">{ LocalizeText(`group.create.steplabel.${ tab }`) }</Text>
                                </Flex>
                            );
                        }) }
                </Flex>
                <Flex alignItems="center" gap={ 2 }>
                    <Base className={ `nitro-group-tab-image tab-${ currentTab }`} />
                    <Column grow gap={ 0 }>
                        <Text bold fontSize={ 4 }>{ LocalizeText(`group.create.stepcaption.${ currentTab }`) }</Text>
                        <Text>{ LocalizeText(`group.create.stepdesc.${ currentTab }`) }</Text>
                    </Column>
                </Flex>
                <Column>
                    { (currentTab === 1) &&
                        <GroupTabIdentityView isCreator={ true } /> }
                    { (currentTab === 2) &&
                        <GroupTabBadgeView /> }
                    { (currentTab === 3) &&
                        <GroupTabColorsView /> }
                    { (currentTab === 4) &&
                        <GroupCreatorTabConfirmationView /> }
                </Column>
                <Flex justifyContent="between">
                    <Button variant="link" className="text-black" onClick={ previousStep }>
                        { LocalizeText(currentTab === 1 ? 'generic.cancel' : 'group.create.previousstep') }
                    </Button>
                    <Button disabled={ ((currentTab === 4) && !HasHabboClub()) } variant={ ((currentTab === 4) ? HasHabboClub() ? 'success' : 'danger' : 'primary') } onClick={ nextStep }>
                        { LocalizeText((currentTab === 4) ? HasHabboClub() ? 'group.create.confirm.buy' : 'group.create.confirm.viprequired' : 'group.create.nextstep') }
                    </Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
