import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RoomMuteComposer, RoomSettingsComposer, RoomStaffPickComposer, SecurityLevel, UserHomeRoomComposer } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetConfiguration, GetGroupInformation, GetSessionDataManager, LocalizeText } from '../../../../api';
import { Button } from '../../../../common/Button';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { NavigatorEvent } from '../../../../events';
import { FloorplanEditorEvent } from '../../../../events/floorplan-editor/FloorplanEditorEvent';
import { RoomWidgetThumbnailEvent } from '../../../../events/room-widgets/thumbnail';
import { BatchUpdates } from '../../../../hooks';
import { dispatchUiEvent } from '../../../../hooks/events';
import { SendMessageHook } from '../../../../hooks/messages';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, UserProfileIconView } from '../../../../layout';
import { RoomThumbnailView } from '../../../../layout/room-thumbnail/RoomThumbnailView';
import { BadgeImageView } from '../../../../views/shared/badge-image/BadgeImageView';
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
    
    const processAction = useCallback((action: string, value?: string) =>
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

                SendMessageHook(new UserHomeRoomComposer(newRoomId));
                return;
            case 'navigator_search_tag':
                return;
            case 'open_room_thumbnail_camera':
                dispatchUiEvent(new RoomWidgetThumbnailEvent(RoomWidgetThumbnailEvent.TOGGLE_THUMBNAIL));
                return;
            case 'open_group_info':
                GetGroupInformation(roomInfoData.enteredGuestRoom.habboGroupId);
                return;
            case 'toggle_room_link':
                dispatchUiEvent(new NavigatorEvent(NavigatorEvent.TOGGLE_ROOM_LINK));
                return;
            case 'open_room_settings':
                SendMessageHook(new RoomSettingsComposer(roomInfoData.enteredGuestRoom.roomId));
                return;
            case 'toggle_pick':
                setIsRoomPicked(value => !value);
                SendMessageHook(new RoomStaffPickComposer(roomInfoData.enteredGuestRoom.roomId));
                return;
            case 'toggle_mute':
                setIsRoomMuted(value => !value);
                SendMessageHook(new RoomMuteComposer());
            return;
            case 'open_floorplan_editor':
                dispatchUiEvent(new FloorplanEditorEvent(FloorplanEditorEvent.TOGGLE_FLOORPLAN_EDITOR));
                return;
            case 'close':
                onCloseClick();
                return;
        }
        
    }, [ onCloseClick, dispatchNavigatorState, roomInfoData, homeRoomId ]);

    useEffect(() =>
    {
        if(!roomInfoData || !roomInfoData.enteredGuestRoom) return;

        let thumbnailUrl: string = null;
        
        if(roomInfoData.enteredGuestRoom.officialRoomPicRef)
        {
            thumbnailUrl = (GetConfiguration<string>('image.library.url') + roomInfoData.enteredGuestRoom.officialRoomPicRef);
        }
        else
        {
            thumbnailUrl = (GetConfiguration<string>('thumbnails.url').replace('%thumbnail%', roomInfoData.enteredGuestRoom.roomId.toString()));
        }

        BatchUpdates(() =>
        {
            setRoomThumbnail(thumbnailUrl);
            setIsRoomPicked(roomInfoData.enteredGuestRoom.roomPicker);
            setIsRoomMuted(roomInfoData.enteredGuestRoom.allInRoomMuted);
        });
    }, [ roomInfoData ]);

    if(!roomInfoData) return null;
    
    return (
        <NitroCardView className="nitro-room-info" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('navigator.roomsettings.roominfo') } onCloseClick={ () => processAction('close') } />
            <NitroCardContentView className="text-black">
                { roomInfoData.enteredGuestRoom &&
                    <>
                        <Flex gap={ 2 } overflow="hidden">
                            <RoomThumbnailView customUrl={ roomInfoData.enteredGuestRoom.officialRoomPicRef }>
                                { hasPermission('settings') && <i className="icon icon-camera-small position-absolute b-0 r-0 m-1 cursor-pointer" onClick={ () => processAction('open_room_thumbnail_camera') } /> }
                            </RoomThumbnailView>
                            <Column grow gap={ 1 } overflow="hidden">
                                <Flex gap={ 1 }>
                                    <Column grow gap={ 1 }>
                                        <Text bold>{ roomInfoData.enteredGuestRoom.roomName }</Text>
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
                                    <Column gap={ 1 }>
                                        <Flex gap={ 1 }>
                                            <i onClick={ () => processAction('set_home_room') } className={ 'flex-shrink-0 icon icon-house-small cursor-pointer' + classNames({ ' gray': homeRoomId !== roomInfoData.enteredGuestRoom.roomId }) } />
                                            <FontAwesomeIcon icon="link" title={ LocalizeText('navigator.embed.caption') } className="cursor-pointer" onClick={ event => dispatchUiEvent(new NavigatorEvent(NavigatorEvent.TOGGLE_ROOM_LINK)) } />
                                        </Flex>
                                        { hasPermission('settings') &&
                                            <Flex gap={ 1 }>
                                                <FontAwesomeIcon icon="cogs" title={ LocalizeText('navigator.room.popup.info.room.settings') } className="cursor-pointer" onClick={ event => processAction('open_room_settings') } />
                                                <FontAwesomeIcon icon="tools" title={ LocalizeText('open.floor.plan.editor') } className="cursor-pointer" onClick={ event => processAction('open_floorplan_editor') } />
                                            </Flex> } 
                                    </Column>
                                </Flex>
                                <Text overflow="auto">{ roomInfoData.enteredGuestRoom.description }</Text>
                                { (roomInfoData.enteredGuestRoom.habboGroupId > 0) &&
                                    <Flex pointer alignItems="center" gap={ 1 } onClick={ () => processAction('open_group_info') }>
                                        <BadgeImageView className="flex-none" badgeCode={ roomInfoData.enteredGuestRoom.groupBadgeCode } isGroup={ true } />
                                        <Text underline>
                                            { LocalizeText('navigator.guildbase', ['groupName'], [roomInfoData.enteredGuestRoom.groupName]) }
                                        </Text>
                                    </Flex> }
                            </Column>
                        </Flex>
                    <Column gap={ 1 }>
                        { hasPermission('staff_pick') &&
                            <Button size="sm" onClick={ () => processAction('toggle_pick') }>
                                { LocalizeText(isRoomPicked ? 'navigator.staffpicks.unpick' : 'navigator.staffpicks.pick') }
                            </Button> }
                        <Button size="sm" variant="danger" disabled>
                            { LocalizeText('help.emergency.main.report.room') }
                        </Button>
                        { hasPermission('settings') &&
                            <Button size="sm" onClick={ () => processAction('toggle_mute') }>
                                { LocalizeText(isRoomMuted ? 'navigator.muteall_on' : 'navigator.muteall_off') }
                            </Button> }
                    </Column>
                </> }
                
            </NitroCardContentView>
        </NitroCardView>
    );
};
