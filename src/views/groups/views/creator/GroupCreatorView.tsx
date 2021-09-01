import { GroupBuyDataComposer, GroupBuyDataEvent } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { LocalizeText } from '../../../../api';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { useGroupsContext } from '../../context/GroupsContext';
import { GroupsActions } from '../../context/GroupsContext.types';
import { GroupCreatorViewProps } from './GroupCreatorView.types';
import { GroupCreatorTabIdentityView } from './views/creator-tab-identity/GroupCreatorTabIdentityView';

const TABS: number[] = [1, 2, 3, 4];

export const GroupCreatorView: FC<GroupCreatorViewProps> = props =>
{
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { groupName = null, groupHomeroomId = null } = groupsState;

    const { isVisible = false, onClose = null } = props;

    const [ currentTab, setCurrentTab ] = useState<number>(1);
    const [ availableRooms, setAvailableRooms ] = useState<Map<number, string>>(null);
    const [ cost, setCost ] = useState<number>(0);

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

    const onGroupBuyDataEvent = useCallback((event: GroupBuyDataEvent) =>
    {
        const parser = event.getParser();

        setAvailableRooms(parser.availableRooms);
        setCost(parser.groupCost);
    }, []);

    CreateMessageHook(GroupBuyDataEvent, onGroupBuyDataEvent);

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
                <div className="text-black">
                    { currentTab === 1 && <GroupCreatorTabIdentityView availableRooms={ availableRooms } /> }
                </div>
                <div className="d-flex justify-content-between mt-2">
                    <Button variant="link" className="text-black" onClick={ previousStep }>{ LocalizeText(currentTab === 1 ? 'generic.cancel' : 'group.create.previousstep') }</Button>
                    <button className="btn btn-primary" onClick={ nextStep }>{ LocalizeText('group.create.nextstep') }</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
