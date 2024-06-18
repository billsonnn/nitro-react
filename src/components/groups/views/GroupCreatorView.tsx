import { GroupBuyComposer, GroupBuyDataComposer, GroupBuyDataEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { HasHabboClub, IGroupData, LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
import { useMessageEvent } from '../../../hooks';
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

    const onCloseClose = () =>
    {
        setCloseAction(null);
        setGroupData(null);

        if(onClose) onClose();
    };

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
    };

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
    };

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
    };

    useMessageEvent<GroupBuyDataEvent>(GroupBuyDataEvent, event =>
    {
        const parser = event.getParser();

        const rooms: { id: number, name: string }[] = [];

        parser.availableRooms.forEach((name, id) => rooms.push({ id, name }));

        setAvailableRooms(rooms);
        setPurchaseCost(parser.groupCost);
    });

    useEffect(() =>
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

        SendMessageComposer(new GroupBuyDataComposer());
    }, [ setGroupData ]);

    if(!groupData) return null;

    return (
        <NitroCardView className="h-[355px] w-[390px] border-[1px] border-[solid] border-[#283F5D]        " theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('group.create.title') } onCloseClick={ onCloseClose } />
            <NitroCardContentView>
                <div className="flex items-center justify-center creator-tabs">
                    { TABS.map((tab, index) =>
                    {
                        return (
                            <Flex key={ index } center className={ `relative -ml-[6px] bg-[url('@/assets/images/groups/creator_tabs.png')] bg-no-repeat ${ ((tab === 1) ? 'w-[84px] h-[24px] bg-[0px_0px]' : (tab === 4) ? 'w-[133px] h-[28px] bg-[0px_-104px]' : 'w-[83px] h-[24px] bg-[0px_-52px]') } ${ (currentTab === tab) ? 'active' : '' }` }>
                                <Text variant="white">{ LocalizeText(`group.create.steplabel.${ tab }`) }</Text>
                            </Flex>
                        );
                    }) }
                </div>
                <Column overflow="hidden">
                    <div className="flex items-center gap-2">
                        <div className={ `bg-no-repeat w-[122px] h-[68px] bg-[url('@/assets/images/groups/creator_images.png')] ${ currentTab === 1 && 'bg-[0px_0px] !w-[99px] !h-[50px]' } 
                        ${ currentTab == 2 && '!bg-[-99px_0px] !w-[98px] !h-[62px]' }  ${ currentTab === 3 && '!bg-[0px_-50px] !w-[96px] !h-[45px]' } ${ currentTab === 4 || currentTab === 5 && '!bg-[0px_-95px] !w-[114px] !h-[61px]' }  ` } />
                        <Column grow gap={ 0 }>
                            <Text bold fontSize={ 4 }>{ LocalizeText(`group.create.stepcaption.${ currentTab }`) }</Text>
                            <Text>{ LocalizeText(`group.create.stepdesc.${ currentTab }`) }</Text>
                        </Column>
                    </div>
                    <Column overflow="hidden">
                        { (currentTab === 1) &&
                            <GroupTabIdentityView availableRooms={ availableRooms } groupData={ groupData } isCreator={ true } setCloseAction={ setCloseAction } setGroupData={ setGroupData } onClose={ null } /> }
                        { (currentTab === 2) &&
                            <GroupTabBadgeView groupData={ groupData } setCloseAction={ setCloseAction } setGroupData={ setGroupData } /> }
                        { (currentTab === 3) &&
                            <GroupTabColorsView groupData={ groupData } setCloseAction={ setCloseAction } setGroupData={ setGroupData } /> }
                        { (currentTab === 4) &&
                            <GroupTabCreatorConfirmationView groupData={ groupData } purchaseCost={ purchaseCost } setGroupData={ setGroupData } /> }
                    </Column>
                    <div className="flex justify-between">
                        <Button className="text-black" variant="link" onClick={ previousStep }>
                            { LocalizeText(currentTab === 1 ? 'generic.cancel' : 'group.create.previousstep') }
                        </Button>
                        <Button disabled={ ((currentTab === 4) && !HasHabboClub()) } variant={ ((currentTab === 4) ? HasHabboClub() ? 'success' : 'danger' : 'primary') } onClick={ nextStep }>
                            { LocalizeText((currentTab === 4) ? HasHabboClub() ? 'group.create.confirm.buy' : 'group.create.confirm.viprequired' : 'group.create.nextstep') }
                        </Button>
                    </div>
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
};
