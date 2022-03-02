import { GroupBadgePart, GroupInformationEvent, GroupSettingsEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../api';
import { Base, Column, Flex, Text } from '../../../common';
import { CreateMessageHook } from '../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../layout';
import { IGroupData } from '../common/IGroupData';
import { GroupTabBadgeView } from './tabs/GroupTabBadgeView';
import { GroupTabColorsView } from './tabs/GroupTabColorsView';
import { GroupTabIdentityView } from './tabs/GroupTabIdentityView';
import { GroupTabSettingsView } from './tabs/GroupTabSettingsView';

const TABS: number[] = [ 1, 2, 3, 5 ];

export const GroupManagerView: FC<{}> = props =>
{
    const [ currentTab, setCurrentTab ] = useState<number>(1);
    const [ closeAction, setCloseAction ] = useState<{ action: () => boolean }>(null);
    const [ groupData, setGroupData ] = useState<IGroupData>(null);

    const close = () =>
    {
        setCloseAction(prevValue =>
            {
                if(prevValue && prevValue.action) prevValue.action();

                return null;
            });

        setGroupData(null);
    }

    const changeTab = (tab: number) =>
    {
        if(closeAction && closeAction.action) closeAction.action();

        setCurrentTab(tab);
    }

    const onGroupInformationEvent = useCallback((event: GroupInformationEvent) =>
    {
        const parser = event.getParser();

        if(!groupData || (groupData.groupId !== parser.id)) return;

        setGroupData(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.groupName = parser.title;
                newValue.groupDescription = parser.description;
                newValue.groupState = parser.type;
                newValue.groupCanMembersDecorate = parser.canMembersDecorate;

                return newValue;
            });
    }, [ groupData ]);

    CreateMessageHook(GroupInformationEvent, onGroupInformationEvent);

    const onGroupSettingsEvent = useCallback((event: GroupSettingsEvent) =>
    {
        const parser = event.getParser();

        const groupBadgeParts: GroupBadgePart[] = [];

        parser.badgeParts.forEach((part, id) =>
        {
            groupBadgeParts.push(new GroupBadgePart(
                part.isBase ? GroupBadgePart.BASE : GroupBadgePart.SYMBOL,
                part.key,
                part.color,
                part.position
            ));
        });

        setGroupData({
            groupId: parser.id,
            groupName: parser.title,
            groupDescription: parser.description,
            groupHomeroomId: parser.roomId,
            groupState: parser.state,
            groupCanMembersDecorate: parser.canMembersDecorate,
            groupColors: [ parser.colorA, parser.colorB ],
            groupBadgeParts
        });
    }, [ setGroupData ]);

    CreateMessageHook(GroupSettingsEvent, onGroupSettingsEvent);

    if(!groupData || (groupData.groupId <= 0)) return null;
    
    return (
        <NitroCardView className="nitro-group-manager">
            <NitroCardHeaderView headerText={ LocalizeText('group.window.title') } onCloseClick={ close } />
            <NitroCardTabsView>
                { TABS.map(tab =>
                    {
                        return (<NitroCardTabsItemView key={ tab } isActive={ currentTab === tab } onClick={ () => changeTab(tab) }>
                            { LocalizeText(`group.edit.tab.${tab}`) }
                        </NitroCardTabsItemView>);
                    }) }
            </NitroCardTabsView>
            <NitroCardContentView>
                <Flex alignItems="center" gap={ 2 }>
                    <Base className={ `nitro-group-tab-image tab-${ currentTab }`} />
                    <Column grow gap={ 0 }>
                        <Text bold fontSize={ 4 }>{ LocalizeText(`group.edit.tabcaption.${ currentTab }`) }</Text>
                        <Text>{ LocalizeText(`group.edit.tabdesc.${ currentTab }`) }</Text>
                    </Column>
                </Flex>
                <Column grow overflow="hidden">
                    { currentTab === 1 &&
                        <GroupTabIdentityView groupData={ groupData } setGroupData={ setGroupData } setCloseAction={ setCloseAction } /> }
                    { currentTab === 2 &&
                        <GroupTabBadgeView groupData={ groupData } setGroupData={ setGroupData } setCloseAction={ setCloseAction } skipDefault={ true } /> }
                    { currentTab === 3 &&
                        <GroupTabColorsView groupData={ groupData } setGroupData={ setGroupData } setCloseAction={ setCloseAction } /> }
                    { currentTab === 5 &&
                        <GroupTabSettingsView groupData={ groupData } setGroupData={ setGroupData } setCloseAction={ setCloseAction } /> }
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
};
