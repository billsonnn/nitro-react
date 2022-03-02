import { GroupDeleteComposer, GroupSaveColorsComposer, GroupSaveInformationComposer, GroupSavePreferencesComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Base, Button, Column, Flex, Text } from '../../../../common';
import { SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../layout';
import { useGroupsContext } from '../../GroupsContext';
import { GroupsActions } from '../../reducers/GroupsReducer';
import { GroupTabBadgeView } from '../tabs/GroupTabBadgeView';
import { GroupTabColorsView } from '../tabs/GroupTabColorsView';
import { GroupTabIdentityView } from '../tabs/GroupTabIdentityView';
import { GroupTabSettingsView } from '../tabs/GroupTabSettingsView';

const TABS: number[] = [1, 2, 3, 5];

export const GroupManagerView: FC<{}> = props =>
{
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { groupId = null, groupName = null, groupDescription = null, groupColors = null, groupBadgeParts = null, groupState = null, groupCanMembersDecorate = null } = groupsState;

    const [ currentTab, setCurrentTab ] = useState<number>(1);

    const onClose = useCallback(() =>
    {
        dispatchGroupsState({
            type: GroupsActions.RESET_GROUP_SETTINGS
        });
    }, [ dispatchGroupsState ]);

    const saveGroup = useCallback(() =>
    {
        const badge = [];

        if(!groupBadgeParts) return;

        groupBadgeParts.forEach((part) =>
        {
            if(part.code)
            {
                badge.push(part.key);
                badge.push(part.color);
                badge.push(part.position);
            }
        });

        SendMessageHook(new GroupSaveInformationComposer(groupId, groupName, groupDescription));
        //SendMessageHook(new GroupSaveBadgeComposer(groupId, badge));
        SendMessageHook(new GroupSaveColorsComposer(groupId, groupColors[0], groupColors[1]));
        SendMessageHook(new GroupSavePreferencesComposer(groupId, groupState, groupCanMembersDecorate ? 0 : 1));

        onClose();
    }, [ groupBadgeParts, groupId, groupName, groupDescription, groupColors, groupState, groupCanMembersDecorate, onClose ]);

    const deleteGroup = useCallback(() =>
    {
        if(window.confirm(LocalizeText('group.deleteconfirm.title') + ' - ' + LocalizeText('group.deleteconfirm.desc')))
        {
            SendMessageHook(new GroupDeleteComposer(groupId));
            onClose();
        }
    }, [ groupId, onClose ]);

    if(!groupId) return null;
    
    return (
        <NitroCardView className="nitro-group-manager" simple={ false }>
            <NitroCardHeaderView headerText={ LocalizeText('group.window.title') } onCloseClick={ onClose } />
            <NitroCardTabsView>
                { TABS.map(tab =>
                    {
                        return (<NitroCardTabsItemView key={ tab } isActive={ currentTab === tab } onClick={ () => setCurrentTab(tab) }>
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
                        <GroupTabIdentityView /> }
                    { currentTab === 2 &&
                        <GroupTabBadgeView skipDefault={ true } /> }
                    { currentTab === 3 &&
                        <GroupTabColorsView /> }
                    { currentTab === 5 &&
                        <GroupTabSettingsView /> }
                </Column>
                <Flex justifyContent="between">
                    <Button variant="danger" onClick={ deleteGroup }>{ LocalizeText('group.delete') }</Button>
                    <Button variant="success" onClick={ saveGroup }>{ LocalizeText('save') }</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
