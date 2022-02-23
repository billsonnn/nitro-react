import { GroupDeleteComposer, GroupSaveBadgeComposer, GroupSaveColorsComposer, GroupSaveInformationComposer, GroupSavePreferencesComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../layout';
import { useGroupsContext } from '../../GroupsContext';
import { GroupsActions } from '../../reducers/GroupsReducer';
import { GroupSharedTabBadgeView } from '../shared-tabs/GroupSharedTabBadgeView';
import { GroupSharedTabColorsView } from '../shared-tabs/GroupSharedTabColorsView';
import { GroupSharedTabIdentityView } from '../shared-tabs/GroupSharedTabIdentityView';
import { GroupManagerTabSettingsView } from './tab-settings/GroupManagerTabSettingsView';

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
        SendMessageHook(new GroupSaveBadgeComposer(groupId, badge));
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
            <NitroCardContentView className="p-0">
                <NitroCardTabsView>
                    { TABS.map(tab =>
                        {
                            return (<NitroCardTabsItemView key={ tab } isActive={ currentTab === tab } onClick={ () => setCurrentTab(tab) }>
                                { LocalizeText(`group.edit.tab.${tab}`) }
                            </NitroCardTabsItemView>);
                        }) }
                </NitroCardTabsView>
                <div className="p-2">
                    <div className="d-flex align-items-center mb-2">
                        <div className={ 'flex-shrink-0 tab-image tab-' + currentTab }>
                            <div></div>
                        </div>
                        <div className="w-100 text-black ms-2">
                            <div className="fw-bold h4 m-0">{ LocalizeText('group.edit.tabcaption.' + currentTab) }</div>
                            <div>{ LocalizeText('group.edit.tabdesc.' + currentTab) }</div>
                        </div>
                    </div>
                    <div className="text-black manager-tab">
                        { currentTab === 1 && <GroupSharedTabIdentityView /> }
                        { currentTab === 2 && <GroupSharedTabBadgeView skipDefault={ true } /> }
                        { currentTab === 3 && <GroupSharedTabColorsView /> }
                        { currentTab === 5 && <GroupManagerTabSettingsView /> }
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                        <button className="btn btn-danger" onClick={ deleteGroup }>{ LocalizeText('group.delete') }</button>
                        <button className="btn btn-success" onClick={ saveGroup }>{ LocalizeText('save') }</button>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
