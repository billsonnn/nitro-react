import { CanCreateRoomEventEvent, CantConnectMessageParser, DoorbellMessageEvent, FlatAccessDeniedMessageEvent, FlatCreatedEvent, FollowFriendMessageComposer, GenericErrorEvent, GetGuestRoomMessageComposer, GetGuestRoomResultEvent, GetUserEventCatsMessageComposer, GetUserFlatCatsMessageComposer, HabboWebTools, LegacyExternalInterface, NavigatorCategoryDataParser, NavigatorEventCategoryDataParser, NavigatorHomeRoomEvent, NavigatorMetadataEvent, NavigatorOpenRoomCreatorEvent, NavigatorSearchEvent, NavigatorSearchResultSet, NavigatorTopLevelContext, RoomDataParser, RoomDoorbellAcceptedEvent, RoomEnterErrorEvent, RoomEntryInfoMessageEvent, RoomForwardEvent, RoomScoreEvent, RoomSettingsUpdatedEvent, SecurityLevel, UserEventCatsEvent, UserFlatCatsEvent, UserInfoEvent, UserPermissionsEvent } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { useBetween } from 'use-between';
import { CreateLinkEvent, CreateRoomSession, DoorStateType, GetConfiguration, GetSessionDataManager, INavigatorData, LocalizeText, NotificationAlertType, SendMessageComposer, TryVisitRoom, VisitDesktop } from '../../api';
import { useMessageEvent } from '../events';
import { useNotification } from '../notification';

const useNavigatorState = () =>
{
    const [ categories, setCategories ] = useState<NavigatorCategoryDataParser[]>(null);
    const [ eventCategories, setEventCategories ] = useState<NavigatorEventCategoryDataParser[]>(null);
    const [ topLevelContext, setTopLevelContext ] = useState<NavigatorTopLevelContext>(null);
    const [ topLevelContexts, setTopLevelContexts ] = useState<NavigatorTopLevelContext[]>(null);
    const [ doorData, setDoorData ] = useState<{ roomInfo: RoomDataParser, state: number }>({ roomInfo: null, state: DoorStateType.NONE });
    const [ searchResult, setSearchResult ] = useState<NavigatorSearchResultSet>(null);
    const [ navigatorData, setNavigatorData ] = useState<INavigatorData>({
        settingsReceived: false,
        homeRoomId: 0,
        enteredGuestRoom: null,
        currentRoomOwner: false,
        currentRoomId: 0,
        currentRoomIsStaffPick: false,
        createdFlatId: 0,
        avatarId: 0,
        roomPicker: false,
        eventMod: false,
        currentRoomRating: 0,
        canRate: true
    });
    const { simpleAlert = null } = useNotification();

    useMessageEvent<RoomSettingsUpdatedEvent>(RoomSettingsUpdatedEvent, event =>
    {
        const parser = event.getParser();

        SendMessageComposer(new GetGuestRoomMessageComposer(parser.roomId, false, false));
    });

    useMessageEvent<CanCreateRoomEventEvent>(CanCreateRoomEventEvent, event =>
    {
        const parser = event.getParser();

        if(parser.canCreate)
        {
            // show room event cvreate

            return;
        }

        simpleAlert(LocalizeText(`navigator.cannotcreateevent.error.${ parser.errorCode }`), null, null, null, LocalizeText('navigator.cannotcreateevent.title'));
    });

    useMessageEvent<UserInfoEvent>(UserInfoEvent, event =>
    {
        SendMessageComposer(new GetUserFlatCatsMessageComposer());
        SendMessageComposer(new GetUserEventCatsMessageComposer());
    });

    useMessageEvent<UserPermissionsEvent>(UserPermissionsEvent, event =>
    {
        const parser = event.getParser();

        setNavigatorData(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.eventMod = (parser.securityLevel >= SecurityLevel.MODERATOR);
            newValue.roomPicker = (parser.securityLevel >= SecurityLevel.COMMUNITY);

            return newValue;
        });
    });

    useMessageEvent<RoomForwardEvent>(RoomForwardEvent, event =>
    {
        const parser = event.getParser();

        TryVisitRoom(parser.roomId);
    });

    useMessageEvent<RoomEntryInfoMessageEvent>(RoomEntryInfoMessageEvent, event =>
    {
        const parser = event.getParser();

        setNavigatorData(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.enteredGuestRoom = null;
            newValue.currentRoomOwner = parser.isOwner;
            newValue.currentRoomId = parser.roomId;

            return newValue;
        });

        // close room info
        // close room settings
        // close room filter

        SendMessageComposer(new GetGuestRoomMessageComposer(parser.roomId, true, false));

        if(LegacyExternalInterface.available) LegacyExternalInterface.call('legacyTrack', 'navigator', 'private', [ parser.roomId ]);
    });

    useMessageEvent<GetGuestRoomResultEvent>(GetGuestRoomResultEvent, event =>
    {
        const parser = event.getParser();

        if(parser.roomEnter)
        {
            setDoorData({ roomInfo: null, state: DoorStateType.NONE });

            setNavigatorData(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.enteredGuestRoom = parser.data;
                newValue.currentRoomIsStaffPick = parser.staffPick;

                const isCreated = (newValue.createdFlatId === parser.data.roomId);

                if(!isCreated && parser.data.displayRoomEntryAd)
                {
                    if(GetConfiguration<boolean>('roomenterad.habblet.enabled', false)) HabboWebTools.openRoomEnterAd();
                }

                newValue.createdFlatId = 0;

                if(newValue.enteredGuestRoom && (newValue.enteredGuestRoom.habboGroupId > 0))
                {
                    // close event info
                }

                return newValue;
            });
        }
        else if(parser.roomForward)
        {
            if((parser.data.ownerName !== GetSessionDataManager().userName) && !parser.isGroupMember)
            {
                switch(parser.data.doorMode)
                {
                    case RoomDataParser.DOORBELL_STATE:
                        setDoorData(prevValue =>
                        {
                            const newValue = { ...prevValue };

                            newValue.roomInfo = parser.data;
                            newValue.state = DoorStateType.START_DOORBELL;

                            return newValue;
                        });
                        return;
                    case RoomDataParser.PASSWORD_STATE:
                        setDoorData(prevValue =>
                        {
                            const newValue = { ...prevValue };

                            newValue.roomInfo = parser.data;
                            newValue.state = DoorStateType.START_PASSWORD;

                            return newValue;
                        });
                        return;
                }
            }

            if((parser.data.doorMode === RoomDataParser.NOOB_STATE) && !GetSessionDataManager().isAmbassador && !GetSessionDataManager().isRealNoob && !GetSessionDataManager().isModerator) return;

            CreateRoomSession(parser.data.roomId);
        }
        else
        {
            setNavigatorData(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.enteredGuestRoom = parser.data;
                newValue.currentRoomIsStaffPick = parser.staffPick;

                return newValue;
            });
        }
    });

    useMessageEvent<RoomScoreEvent>(RoomScoreEvent, event =>
    {
        const parser = event.getParser();

        setNavigatorData(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.currentRoomRating = parser.totalLikes;
            newValue.canRate = parser.canLike;

            return newValue;
        });
    });

    useMessageEvent<DoorbellMessageEvent>(DoorbellMessageEvent, event => 
    {
        const parser = event.getParser();

        if(!parser.userName || (parser.userName.length === 0))
        {
            setDoorData(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.state = DoorStateType.STATE_WAITING;

                return newValue;
            });
        }
    });

    useMessageEvent<RoomDoorbellAcceptedEvent>(RoomDoorbellAcceptedEvent, event =>
    {
        const parser = event.getParser();

        if(!parser.userName || (parser.userName.length === 0))
        {
            setDoorData(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.state = DoorStateType.STATE_ACCEPTED;

                return newValue;
            });
        }
    });

    useMessageEvent<FlatAccessDeniedMessageEvent>(FlatAccessDeniedMessageEvent, event =>
    {
        const parser = event.getParser();

        if(!parser.userName || (parser.userName.length === 0))
        {
            setDoorData(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.state = DoorStateType.STATE_NO_ANSWER;

                return newValue;
            });
        }
    });

    useMessageEvent<GenericErrorEvent>(GenericErrorEvent, event =>
    {
        const parser = event.getParser();

        switch(parser.errorCode)
        {
            case -100002:
                setDoorData(prevValue =>
                {
                    const newValue = { ...prevValue };

                    newValue.state = DoorStateType.STATE_WRONG_PASSWORD;

                    return newValue;
                });
                return;
            case 4009:
                simpleAlert(LocalizeText('navigator.alert.need.to.be.vip'), NotificationAlertType.DEFAULT, null, null, LocalizeText('generic.alert.title'));

                return;
            case 4010:
                simpleAlert(LocalizeText('navigator.alert.invalid_room_name'), NotificationAlertType.DEFAULT, null, null, LocalizeText('generic.alert.title'));

                return;
            case 4011:
                simpleAlert(LocalizeText('navigator.alert.cannot_perm_ban'), NotificationAlertType.DEFAULT, null, null, LocalizeText('generic.alert.title'));

                return;
            case 4013:
                simpleAlert(LocalizeText('navigator.alert.room_in_maintenance'), NotificationAlertType.DEFAULT, null, null, LocalizeText('generic.alert.title'));

                return;
        }
    });

    useMessageEvent<NavigatorMetadataEvent>(NavigatorMetadataEvent, event =>
    {
        const parser = event.getParser();

        setTopLevelContexts(parser.topLevelContexts);
        setTopLevelContext(parser.topLevelContexts.length ? parser.topLevelContexts[0] : null);
    });

    useMessageEvent<NavigatorSearchEvent>(NavigatorSearchEvent, event =>
    {
        const parser = event.getParser();

        setTopLevelContext(prevValue =>
        {
            let newValue = prevValue;

            if(!newValue) newValue = ((topLevelContexts && topLevelContexts.length && topLevelContexts[0]) || null);

            if(!newValue) return null;

            if((parser.result.code !== newValue.code) && topLevelContexts && topLevelContexts.length)
            {
                for(const context of topLevelContexts)
                {
                    if(context.code !== parser.result.code) continue;

                    newValue = context;
                }
            }

            for(const context of topLevelContexts)
            {
                if(context.code !== parser.result.code) continue;

                newValue = context;
            }

            return newValue;
        });

        setSearchResult(parser.result);
    });

    useMessageEvent<UserFlatCatsEvent>(UserFlatCatsEvent, event =>
    {
        const parser = event.getParser();

        setCategories(parser.categories);
    });

    useMessageEvent<UserEventCatsEvent>(UserEventCatsEvent, event =>
    {
        const parser = event.getParser();

        setEventCategories(parser.categories);
    });

    useMessageEvent<FlatCreatedEvent>(FlatCreatedEvent, event =>
    {
        const parser = event.getParser();

        CreateRoomSession(parser.roomId);
    });

    useMessageEvent<NavigatorHomeRoomEvent>(NavigatorHomeRoomEvent, event =>
    {
        const parser = event.getParser();

        let prevSettingsReceived = false;

        setNavigatorData(prevValue =>
        {
            prevSettingsReceived = prevValue.settingsReceived;

            const newValue = { ...prevValue };

            newValue.homeRoomId = parser.homeRoomId;
            newValue.settingsReceived = true;

            return newValue;
        });

        if(prevSettingsReceived)
        {
            // refresh room info window
            return;
        }

        let forwardType = -1;
        let forwardId = -1;

        if((GetConfiguration<string>('friend.id') !== undefined) && (parseInt(GetConfiguration<string>('friend.id')) > 0))
        {
            forwardType = 0;
            SendMessageComposer(new FollowFriendMessageComposer(parseInt(GetConfiguration<string>('friend.id'))));
        }

        if((GetConfiguration<number>('forward.type') !== undefined) && (GetConfiguration<number>('forward.id') !== undefined))
        {
            forwardType = parseInt(GetConfiguration<string>('forward.type'));
            forwardId = parseInt(GetConfiguration<string>('forward.id'))
        }

        if(forwardType === 2)
        {
            TryVisitRoom(forwardId);
        }

        else if((forwardType === -1) && (parser.roomIdToEnter > 0))
        {
            CreateLinkEvent('navigator/close');

            if(parser.roomIdToEnter !== parser.homeRoomId)
            {
                CreateRoomSession(parser.roomIdToEnter);
            }
            else
            {
                CreateRoomSession(parser.homeRoomId);
            }
        }
    });

    useMessageEvent<RoomEnterErrorEvent>(RoomEnterErrorEvent, event =>
    {
        const parser = event.getParser();

        switch(parser.reason)
        {
            case CantConnectMessageParser.REASON_FULL:
                simpleAlert(LocalizeText('navigator.guestroomfull.text'), NotificationAlertType.DEFAULT, null, null, LocalizeText('navigator.guestroomfull.title'));

                break;
            case CantConnectMessageParser.REASON_QUEUE_ERROR:
                simpleAlert(LocalizeText(`room.queue.error.${ parser.parameter }`), NotificationAlertType.DEFAULT, null, null, LocalizeText('room.queue.error.title'));

                break;
            case CantConnectMessageParser.REASON_BANNED:
                simpleAlert(LocalizeText('navigator.banned.text'), NotificationAlertType.DEFAULT, null, null, LocalizeText('navigator.banned.title'));

                break;
            default:
                simpleAlert(LocalizeText('room.queue.error.title'), NotificationAlertType.DEFAULT, null, null, LocalizeText('room.queue.error.title'));

                break;
        }

        VisitDesktop();
    });

    useMessageEvent<NavigatorOpenRoomCreatorEvent>(NavigatorOpenRoomCreatorEvent, event => CreateLinkEvent('navigator/show'));

    return { categories, doorData, setDoorData, topLevelContext, topLevelContexts, searchResult, navigatorData };
}

export const useNavigator = () => useBetween(useNavigatorState);
