import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RoomMuteComposer, RoomSettingsComposer, RoomStaffPickComposer, SecurityLevel, UserHomeRoomComposer } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { GetGroupInformation, GetSessionDataManager, LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, Column, Flex, LayoutBadgeImageView, LayoutRoomThumbnailView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text, UserProfileIconView } from '../../../../common';
import { FloorplanEditorEvent, NavigatorEvent, RoomWidgetThumbnailEvent } from '../../../../events';
import { BatchUpdates, DispatchUiEvent } from '../../../../hooks';
import { useNavigatorContext } from '../../NavigatorContext';
import { NavigatorActions } from '../../reducers/NavigatorReducer';

export class NavigatorRoomInfoViewProps
{
    onCloseClick: () => void;
}

export const NavigatorRoomInfoView: FC<NavigatorRoomInfoViewProps> = props =>
{
    const { onCloseClick = null } = props;
    const [ roomThumbnail, setRoomThumbnail ] = useState(null);
    const [ isRoomPicked, setIsRoomPicked ] = useState(false);
    const [ isRoomMuted, setIsRoomMuted ] = useState(false);
    const { navigatorState = null, dispatchNavigatorState = null } = useNavigatorContext();
    const { roomInfoData = null, homeRoomId = null } = navigatorState;

    const hasPermission = (permission: string) =>
    {
        switch(permission)
        {
            case 'settings':
                return GetSessionDataManager().securityLevel >= SecurityLevel.MODERATOR || roomInfoData.currentRoomOwner;
            case 'staff_pick':
                return GetSessionDataManager().securityLevel >= SecurityLevel.COMMUNITY;
            default: return false;
        }
    }
    
    const processAction = (action: string, value?: string) =>
    {
        if(!roomInfoData || !roomInfoData.enteredGuestRoom) return;

        switch(action)
        {
            case 'set_home_room':
                let newRoomId = -1;

                if(homeRoomId !== roomInfoData.enteredGuestRoom.roomId)
                {
                    newRoomId = roomInfoData.enteredGuestRoom.roomId;
                }

                dispatchNavigatorState({
                    type: NavigatorActions.SET_HOME_ROOM_ID,
                    payload: {
                        homeRoomId: newRoomId
                    }
                });

                SendMessageComposer(new UserHomeRoomComposer(newRoomId));
                return;
            case 'navigator_search_tag':
                return;
            case 'open_room_thumbnail_camera':
                DispatchUiEvent(new RoomWidgetThumbnailEvent(RoomWidgetThumbnailEvent.TOGGLE_THUMBNAIL));
                return;
            case 'open_group_info':
                GetGroupInformation(roomInfoData.enteredGuestRoom.habboGroupId);
                return;
            case 'toggle_room_link':
                DispatchUiEvent(new NavigatorEvent(NavigatorEvent.TOGGLE_ROOM_LINK));
                return;
            case 'open_room_settings':
                SendMessageComposer(new RoomSettingsComposer(roomInfoData.enteredGuestRoom.roomId));
                return;
            case 'toggle_pick':
                setIsRoomPicked(value => !value);
                SendMessageComposer(new RoomStaffPickComposer(roomInfoData.enteredGuestRoom.roomId));
                return;
            case 'toggle_mute':
                setIsRoomMuted(value => !value);
                SendMessageComposer(new RoomMuteComposer());
            return;
            case 'open_floorplan_editor':
                DispatchUiEvent(new FloorplanEditorEvent(FloorplanEditorEvent.TOGGLE_FLOORPLAN_EDITOR));
                return;
            case 'close':
                onCloseClick();
                return;
        }
        
    }

    useEffect(() =>
    {
        if(!roomInfoData || !roomInfoData.enteredGuestRoom) return;

        BatchUpdates(() =>
        {
            setIsRoomPicked(roomInfoData.enteredGuestRoom.roomPicker);
            setIsRoomMuted(roomInfoData.enteredGuestRoom.allInRoomMuted);
        });
    }, [ roomInfoData ]);

    if(!roomInfoData) return null;
    
    return (
        <NitroCardView className="nitro-room-info" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.roomsettings.roominfo') } onCloseClick={ () => processAction('close') } />
            <NitroCardContentView className="text-black">
                { roomInfoData.enteredGuestRoom &&
                    <>
                        <Flex gap={ 2 } overflow="hidden">
                            <LayoutRoomThumbnailView roomId={ roomInfoData.enteredGuestRoom.roomId } customUrl={ roomInfoData.enteredGuestRoom.officialRoomPicRef }>
                                { hasPermission('settings') && <i className="icon icon-camera-small position-absolute b-0 r-0 m-1 cursor-pointer top-0" onClick={ () => processAction('open_room_thumbnail_camera') } /> }
                            </LayoutRoomThumbnailView>
                            <Column grow gap={ 1 } overflow="hidden">
                                <Flex gap={ 1 }>
                                    <Column grow gap={ 1 }>
                                        <Flex gap={ 1 }>
                                            <i onClick={ () => processAction('set_home_room') } className={ 'flex-shrink-0 icon icon-house-small cursor-pointer' + classNames({ ' gray': homeRoomId !== roomInfoData.enteredGuestRoom.roomId }) } />
                                            <Text bold>{ roomInfoData.enteredGuestRoom.roomName }</Text>
                                        </Flex>
                                        { roomInfoData.enteredGuestRoom.showOwner &&
                                            <Flex alignItems="center" gap={ 1 }>
                                                <Text variant="muted">{ LocalizeText('navigator.roomownercaption') }</Text>
                                                <Flex alignItems="center" gap={ 1 }>
                                                    <UserProfileIconView userId={ roomInfoData.enteredGuestRoom.ownerId } />
                                                    <Text>{ roomInfoData.enteredGuestRoom.ownerName }</Text>
                                                </Flex>
                                            </Flex> }
                                        <Flex alignItems="center" gap={ 1 }>
                                            <Text variant="muted">{ LocalizeText('navigator.roomrating') }</Text>
                                            <Text>{ roomInfoData.enteredGuestRoom.score }</Text>
                                        </Flex>
                                        { (roomInfoData.enteredGuestRoom.tags.length > 0) &&
                                            <Flex alignItems="center" gap={ 1 }>
                                                { roomInfoData.enteredGuestRoom.tags.map(tag =>
                                                    {
                                                        return <Text key={ tag } pointer className="bg-muted rounded p-1" onClick={ event => processAction('navigator_search_tag', tag) }>#{ tag }</Text>
                                                    }) }
                                            </Flex> }
                                    </Column>
                                    <Column alignItems="center" gap={ 1 }>
                                        { hasPermission('settings') &&
                                            <i className="icon icon-cog cursor-pointer" title={ LocalizeText('navigator.room.popup.info.room.settings') } onClick={ event => processAction('open_room_settings') } /> }
                                        <FontAwesomeIcon icon="link" title={ LocalizeText('navigator.embed.caption') } className="cursor-pointer" onClick={ event => DispatchUiEvent(new NavigatorEvent(NavigatorEvent.TOGGLE_ROOM_LINK)) } />
                                    </Column>
                                </Flex>
                                <Text overflow="auto" style={ { maxHeight: 50 } }>{ roomInfoData.enteredGuestRoom.description }</Text>
                                { (roomInfoData.enteredGuestRoom.habboGroupId > 0) &&
                                    <Flex pointer alignItems="center" gap={ 1 } onClick={ () => processAction('open_group_info') }>
                                        <LayoutBadgeImageView className="flex-none" badgeCode={ roomInfoData.enteredGuestRoom.groupBadgeCode } isGroup={ true } />
                                        <Text underline>
                                            { LocalizeText('navigator.guildbase', ['groupName'], [roomInfoData.enteredGuestRoom.groupName]) }
                                        </Text>
                                    </Flex> }
                            </Column>
                        </Flex>
                    <Column gap={ 1 }>
                        { hasPermission('staff_pick') &&
                            <Button onClick={ () => processAction('toggle_pick') }>
                                { LocalizeText(isRoomPicked ? 'navigator.staffpicks.unpick' : 'navigator.staffpicks.pick') }
                            </Button> }
                        <Button variant="danger" disabled>
                            { LocalizeText('help.emergency.main.report.room') }
                        </Button>
                        { hasPermission('settings') &&
                            <>
                                <Button onClick={ () => processAction('toggle_mute') }>
                                    { LocalizeText(isRoomMuted ? 'navigator.muteall_on' : 'navigator.muteall_off') }
                                </Button>
                                <Button onClick={ () => processAction('open_floorplan_editor') }>
                                    { LocalizeText('open.floor.plan.editor') }
                                </Button>
                            </> }
                    </Column>
                </> }
                
            </NitroCardContentView>
        </NitroCardView>
    );
};
