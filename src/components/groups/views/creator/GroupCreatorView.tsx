import { GroupBuyComposer, GroupBuyDataComposer } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { HasHabboClub, LocalizeText } from '../../../../api';
import { SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { useGroupsContext } from '../../GroupsContext';
import { GroupsActions } from '../../reducers/GroupsReducer';
import { GroupSharedTabBadgeView } from '../shared-tabs/GroupSharedTabBadgeView';
import { GroupSharedTabColorsView } from '../shared-tabs/GroupSharedTabColorsView';
import { GroupSharedTabIdentityView } from '../shared-tabs/GroupSharedTabIdentityView';
import { GroupCreatorTabConfirmationView } from './GroupCreatorTabConfirmationView';

const TABS: number[] = [1, 2, 3, 4];

interface GroupCreatorViewProps
{
    isVisible: boolean;
    onClose: () => void;
}

export const GroupCreatorView: FC<GroupCreatorViewProps> = props =>
{
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { groupName = null, groupDescription = null, groupHomeroomId = null, groupColors = null, groupBadgeParts = null } = groupsState;

    const { isVisible = false, onClose = null } = props;

    const [ currentTab, setCurrentTab ] = useState<number>(1);

    useEffect(() =>
    {
        if(!isVisible)
        {
            setCurrentTab(1);
            dispatchGroupsState({
                type: GroupsActions.RESET_GROUP_SETTINGS
            });
        }
        else
        {
            SendMessageHook(new GroupBuyDataComposer());
        }
    }, [ isVisible ]);

    const buyGroup = useCallback(() =>
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
                    alert(LocalizeText('group.edit.error.no.name.or.room.selected'));
                    return;
                }
                break;
            }
            case 4: {
                buyGroup();
                break;
            }
        }

        setCurrentTab(value =>
            {
                return (value === 4 ? value : value + 1)
            });
    }, [ currentTab, groupName, groupHomeroomId ]);

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-group-creator" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('group.create.title') } onCloseClick={ onClose } />
            <NitroCardContentView className="pb-2">
                <div className="creator-tabs mb-2">
                    { TABS.map((tab, index) =>
                    {
                        return (<div key={ index } className={ 'tab tab-' + (tab === 1 ? 'blue-flat' : tab === 4 ? 'yellow' : 'blue-arrow') + classNames({ ' active': currentTab === tab }) }>
                                    <div>{ LocalizeText('group.create.steplabel.' + tab) }</div>
                                </div>);
                    }) }
                </div>
                <div className="d-flex align-items-center mb-2">
                    <div className={ 'flex-shrink-0 tab-image tab-' + currentTab }>
                        <div></div>
                    </div>
                    <div className="w-100 text-black ms-2">
                        <div className="fw-bold h4 m-0">{ LocalizeText('group.create.stepcaption.' + currentTab) }</div>
                        <div>{ LocalizeText('group.create.stepdesc.' + currentTab) }</div>
                    </div>
                </div>
                <div className="text-black creator-tab">
                    { currentTab === 1 && <GroupSharedTabIdentityView isCreator={ true } /> }
                    { currentTab === 2 && <GroupSharedTabBadgeView /> }
                    { currentTab === 3 && <GroupSharedTabColorsView /> }
                    { currentTab === 4 && <GroupCreatorTabConfirmationView /> }
                </div>
                <div className="d-flex justify-content-between mt-2">
                    <Button variant="link" className="text-black" onClick={ previousStep }>{ LocalizeText(currentTab === 1 ? 'generic.cancel' : 'group.create.previousstep') }</Button>
                    <button disabled={ currentTab === 4 && !HasHabboClub() } className={ 'btn ' + (currentTab === 4 ? HasHabboClub() ? 'btn-success' : 'btn-danger' : 'btn-primary') } onClick={ nextStep }>{ LocalizeText(currentTab === 4 ? HasHabboClub() ? 'group.create.confirm.buy' : 'group.create.confirm.viprequired' : 'group.create.nextstep') }</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
