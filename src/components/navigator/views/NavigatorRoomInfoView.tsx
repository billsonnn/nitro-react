import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RoomMuteComposer, RoomSettingsComposer, RoomStaffPickComposer, SecurityLevel, UserHomeRoomComposer } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { CreateLinkEvent, GetGroupInformation, GetSessionDataManager, LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Column, Flex, LayoutBadgeImageView, LayoutRoomThumbnailView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text, UserProfileIconView } from '../../../common';
import { FloorplanEditorEvent, RoomWidgetThumbnailEvent } from '../../../events';
import { BatchUpdates, DispatchUiEvent } from '../../../hooks';
import { useNavigatorContext } from '../NavigatorContext';

export class NavigatorRoomInfoViewProps
{
    onCloseClick: () => void;
}

export const NavigatorRoomInfoView: FC<NavigatorRoomInfoViewProps> = props =>
{
    const { onCloseClick = null } = props;
    const [ isRoomPicked, setIsRoomPicked ] = useState(false);
    const [ isRoomMuted, setIsRoomMuted ] = useState(false);
    const { navigatorData = null } = useNavigatorContext();


    const hasPermission = (permission: string) =>
    {
        switch(permission)
        {
            case 'settings':
                return (GetSessionDataManager().userId === navigatorData.enteredGuestRoom.ownerId || GetSessionDataManager().isModerator);
            case 'staff_pick':
                return GetSessionDataManager().securityLevel >= SecurityLevel.COMMUNITY;
            default: return false;
        }
    }
    
    const processAction = (action: string, value?: string) =>
    {
        if(!navigatorData || !navigatorData.enteredGuestRoom) return;

        switch(action)
        {
            case 'set_home_room':
                let newRoomId = -1;

                if(navigatorData.homeRoomId !== navigatorData.enteredGuestRoom.roomId)
                {
                    newRoomId = navigatorData.enteredGuestRoom.roomId;
                }

                if(newRoomId > 0) SendMessageComposer(new UserHomeRoomComposer(newRoomId));
                return;
            case 'navigator_search_tag':
                return;
            case 'open_room_thumbnail_camera':
                DispatchUiEvent(new RoomWidgetThumbnailEvent(RoomWidgetThumbnailEvent.TOGGLE_THUMBNAIL));
                return;
            case 'open_group_info':
                GetGroupInformation(navigatorData.enteredGuestRoom.habboGroupId);
                return;
            case 'toggle_room_link':
                CreateLinkEvent('navigator/toggle-room-link');
                return;
            case 'open_room_settings':
                SendMessageComposer(new RoomSettingsComposer(navigatorData.enteredGuestRoom.roomId));
                return;
            case 'toggle_pick':
                setIsRoomPicked(value => !value);
                SendMessageComposer(new RoomStaffPickComposer(navigatorData.enteredGuestRoom.roomId));
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
        if(!navigatorData) return;

        BatchUpdates(() =>
        {
            setIsRoomPicked(navigatorData.currentRoomIsStaffPick);
            if(navigatorData.enteredGuestRoom) setIsRoomMuted(navigatorData.enteredGuestRoom.allInRoomMuted);
        });
    }, [ navigatorData ]);

    if(!navigatorData.enteredGuestRoom) return null;
    
    return (
        <NitroCardView className="nitro-room-info" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.roomsettings.roominfo') } onCloseClick={ () => processAction('close') } />
            <NitroCardContentView className="text-black">
                { navigatorData.enteredGuestRoom &&
                    <>
                        <Flex gap={ 2 } overflow="hidden">
                            <LayoutRoomThumbnailView roomId={ navigatorData.enteredGuestRoom.roomId } customUrl={ navigatorData.enteredGuestRoom.officialRoomPicRef }>
                                { hasPermission('settings') && <i className="icon icon-camera-small position-absolute b-0 r-0 m-1 cursor-pointer top-0" onClick={ () => processAction('open_room_thumbnail_camera') } /> }
                            </LayoutRoomThumbnailView>
                            <Column grow gap={ 1 } overflow="hidden">
                                <Flex gap={ 1 }>
                                    <Column grow gap={ 1 }>
                                        <Flex gap={ 1 }>
                                            <i onClick={ () => processAction('set_home_room') } className={ 'flex-shrink-0 icon icon-house-small cursor-pointer' + classNames({ ' gray': navigatorData.homeRoomId !== navigatorData.enteredGuestRoom.roomId }) } />
                                            <Text bold>{ navigatorData.enteredGuestRoom.roomName }</Text>
                                        </Flex>
                                        { navigatorData.enteredGuestRoom.showOwner &&
                                            <Flex alignItems="center" gap={ 1 }>
                                                <Text variant="muted">{ LocalizeText('navigator.roomownercaption') }</Text>
                                                <Flex alignItems="center" gap={ 1 }>
                                                    <UserProfileIconView userId={ navigatorData.enteredGuestRoom.ownerId } />
                                                    <Text>{ navigatorData.enteredGuestRoom.ownerName }</Text>
                                                </Flex>
                                            </Flex> }
                                        <Flex alignItems="center" gap={ 1 }>
                                            <Text variant="muted">{ LocalizeText('navigator.roomrating') }</Text>
                                            <Text>{ navigatorData.currentRoomRating }</Text>
                                        </Flex>
                                        { (navigatorData.enteredGuestRoom.tags.length > 0) &&
                                            <Flex alignItems="center" gap={ 1 }>
                                                { navigatorData.enteredGuestRoom.tags.map(tag =>
                                                    {
                                                        return <Text key={ tag } pointer className="bg-muted rounded p-1" onClick={ event => processAction('navigator_search_tag', tag) }>#{ tag }</Text>
                                                    }) }
                                            </Flex> }
                                    </Column>
                                    <Column alignItems="center" gap={ 1 }>
                                        { hasPermission('settings') &&
                                            <i className="icon icon-cog cursor-pointer" title={ LocalizeText('navigator.room.popup.info.room.settings') } onClick={ event => processAction('open_room_settings') } /> }
                                        <FontAwesomeIcon icon="link" title={ LocalizeText('navigator.embed.caption') } className="cursor-pointer" onClick={ event => CreateLinkEvent('navigator/toggle-room-link') } />
                                    </Column>
                                </Flex>
                                <Text overflow="auto" style={ { maxHeight: 50 } }>{ navigatorData.enteredGuestRoom.description }</Text>
                                { (navigatorData.enteredGuestRoom.habboGroupId > 0) &&
                                    <Flex pointer alignItems="center" gap={ 1 } onClick={ () => processAction('open_group_info') }>
                                        <LayoutBadgeImageView className="flex-none" badgeCode={ navigatorData.enteredGuestRoom.groupBadgeCode } isGroup={ true } />
                                        <Text underline>
                                            { LocalizeText('navigator.guildbase', ['groupName'], [navigatorData.enteredGuestRoom.groupName]) }
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
