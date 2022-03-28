import { GroupBuyComposer, GroupBuyDataComposer, GroupBuyDataEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { HasHabboClub, LocalizeText, SendMessageComposer } from '../../../api';
import { Base, Button, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
import { BatchUpdates, UseMessageEventHook } from '../../../hooks';
import { IGroupData } from '../common/IGroupData';
import { GroupTabBadgeView } from './tabs/GroupTabBadgeView';
import { GroupTabColorsView } from './tabs/GroupTabColorsView';
import { GroupTabCreatorConfirmationView } from './tabs/GroupTabCreatorConfirmationView';
import { GroupTabIdentityView } from './tabs/GroupTabIdentityView';

interface GroupCreatorViewProps
{
    onClose: () => void;
}

const TABS: number[] = [ 1, 2, 3, 4 ];

export const GroupCreatorView: FC<GroupCreatorViewProps> = props =>
{
    const { onClose = null } = props;
    const [ currentTab, setCurrentTab ] = useState<number>(1);
    const [ closeAction, setCloseAction ] = useState<{ action: () => boolean }>(null);
    const [ groupData, setGroupData ] = useState<IGroupData>(null);
    const [ availableRooms, setAvailableRooms ] = useState<{ id: number, name: string }[]>(null);
    const [ purchaseCost, setPurchaseCost ] = useState<number>(0);

    const close = () =>
    {
        setCloseAction(null);
        setGroupData(null);

        if(onClose) onClose();
    }

    const buyGroup = () =>
    {
        if(!groupData) return;

        const badge = [];

        groupData.groupBadgeParts.forEach(part =>
        {
            if(part.code)
            {
                badge.push(part.key);
                badge.push(part.color);
                badge.push(part.position);
            }
        });

        SendMessageComposer(new GroupBuyComposer(groupData.groupName, groupData.groupDescription, groupData.groupHomeroomId, groupData.groupColors[0], groupData.groupColors[1], badge));
    }

    const previousStep = () =>
    {
        if(closeAction && closeAction.action)
        {
            if(!closeAction.action()) return;
        }

        if(currentTab === 1)
        {
            onClose();

            return;
        }

        setCurrentTab(value => value - 1);
    }

    const nextStep = () =>
    {
        if(closeAction && closeAction.action)
        {
            if(!closeAction.action()) return;
        }

        if(currentTab === 4)
        {
            buyGroup();

            return;
        }

        setCurrentTab(value => (value === 4 ? value : value + 1));
    }

    const onGroupBuyDataEvent = useCallback((event: GroupBuyDataEvent) =>
    {
        const parser = event.getParser();

        const rooms: { id: number, name: string }[] = [];

        parser.availableRooms.forEach((name, id) => rooms.push({ id, name }));

        BatchUpdates(() =>
        {
            setAvailableRooms(rooms);
            setPurchaseCost(parser.groupCost);
        });
    }, []);

    UseMessageEventHook(GroupBuyDataEvent, onGroupBuyDataEvent);

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            setCurrentTab(1);

            setGroupData({
                groupId: -1,
                groupName: null,
                groupDescription: null,
                groupHomeroomId: -1,
                groupState: 1,
                groupCanMembersDecorate: true,
                groupColors: null,
                groupBadgeParts: null
            });
        });
        
        SendMessageComposer(new GroupBuyDataComposer());
    }, [ setGroupData ]);

    if(!groupData) return null;

    return (
        <NitroCardView className="nitro-group-creator" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('group.create.title') } onCloseClick={ close } />
            <NitroCardContentView>
                <Flex center className="creator-tabs">
                    { TABS.map((tab, index) =>
                        {
                            return (
                                <Flex center key={ index } className={ `tab tab-${ ((tab === 1) ? 'blue-flat' : (tab === 4) ? 'yellow' : 'blue-arrow') } ${ (currentTab === tab) ? 'active' : '' }` }>
                                    <Text variant="white">{ LocalizeText(`group.create.steplabel.${ tab }`) }</Text>
                                </Flex>
                            );
                        }) }
                </Flex>
                <Column overflow="hidden">
                    <Flex alignItems="center" gap={ 2 }>
                        <Base className={ `nitro-group-tab-image tab-${ currentTab }`} />
                        <Column grow gap={ 0 }>
                            <Text bold fontSize={ 4 }>{ LocalizeText(`group.create.stepcaption.${ currentTab }`) }</Text>
                            <Text>{ LocalizeText(`group.create.stepdesc.${ currentTab }`) }</Text>
                        </Column>
                    </Flex>
                    <Column overflow="hidden">
                        { (currentTab === 1) &&
                            <GroupTabIdentityView groupData={ groupData } setGroupData={ setGroupData } setCloseAction={ setCloseAction } close={ null } isCreator={ true } availableRooms={ availableRooms } /> }
                        { (currentTab === 2) &&
                            <GroupTabBadgeView groupData={ groupData } setGroupData={ setGroupData } setCloseAction={ setCloseAction } /> }
                        { (currentTab === 3) &&
                            <GroupTabColorsView groupData={ groupData } setGroupData={ setGroupData } setCloseAction={ setCloseAction } /> }
                        { (currentTab === 4) &&
                            <GroupTabCreatorConfirmationView groupData={ groupData } setGroupData={ setGroupData } purchaseCost={ purchaseCost } /> }
                    </Column>
                    <Flex justifyContent="between">
                        <Button variant="link" className="text-black" onClick={ previousStep }>
                            { LocalizeText(currentTab === 1 ? 'generic.cancel' : 'group.create.previousstep') }
                        </Button>
                        <Button disabled={ ((currentTab === 4) && !HasHabboClub()) } variant={ ((currentTab === 4) ? HasHabboClub() ? 'success' : 'danger' : 'primary') } onClick={ nextStep }>
                            { LocalizeText((currentTab === 4) ? HasHabboClub() ? 'group.create.confirm.buy' : 'group.create.confirm.viprequired' : 'group.create.nextstep') }
                        </Button>
                    </Flex>
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
};
