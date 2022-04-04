import { CanCreateRoomEventEvent, CantConnectMessageParser, FollowFriendMessageComposer, GenericErrorEvent, GetGuestRoomResultEvent, HabboWebTools, LegacyExternalInterface, NavigatorCategoriesComposer, NavigatorCategoriesEvent, NavigatorHomeRoomEvent, NavigatorMetadataEvent, NavigatorOpenRoomCreatorEvent, NavigatorSearchEvent, NavigatorSettingsComposer, RoomCreatedEvent, RoomDataParser, RoomDoorbellAcceptedEvent, RoomDoorbellEvent, RoomDoorbellRejectedEvent, RoomEnterErrorEvent, RoomEntryInfoMessageEvent, RoomForwardEvent, RoomInfoComposer, RoomScoreEvent, RoomSettingsUpdatedEvent, SecurityLevel, UserInfoEvent, UserPermissionsEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateLinkEvent, CreateRoomSession, DoorStateType, GetConfiguration, GetSessionDataManager, LocalizeText, NotificationAlertType, NotificationUtilities, SendMessageComposer, TryVisitRoom, VisitDesktop } from '../../api';
import { UseMessageEventHook } from '../../hooks';
import { useNavigatorContext } from './NavigatorContext';

export const NavigatorMessageHandler: FC<{}> = props =>
{
    const { setCategories = null, setTopLevelContext = null, topLevelContexts = null, setTopLevelContexts = null, setNavigatorData = null, setDoorData = null, setSearchResult = null } = useNavigatorContext();

    const onRoomSettingsUpdatedEvent = useCallback((event: RoomSettingsUpdatedEvent) =>
    {
        const parser = event.getParser();

        SendMessageComposer(new RoomInfoComposer(parser.roomId, false, false));
    }, []);

    UseMessageEventHook(RoomSettingsUpdatedEvent, onRoomSettingsUpdatedEvent);

    const onCanCreateRoomEventEvent = useCallback((event: CanCreateRoomEventEvent) =>
    {
        const parser = event.getParser();

        if(parser.canCreate)
        {
            // show room event cvreate

            return;
        }

        NotificationUtilities.simpleAlert(LocalizeText(`navigator.cannotcreateevent.error.${ parser.errorCode }`), null, null, null, LocalizeText('navigator.cannotcreateevent.title'));
    }, []);
    
    UseMessageEventHook(CanCreateRoomEventEvent, onCanCreateRoomEventEvent);

    const onUserInfoEvent = useCallback((event: UserInfoEvent) =>
    {
        SendMessageComposer(new NavigatorCategoriesComposer());
        SendMessageComposer(new NavigatorSettingsComposer());
    }, []);

    const onUserPermissionsEvent = useCallback((event: UserPermissionsEvent) =>
    {
        const parser = event.getParser();

        setNavigatorData(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.eventMod = (parser.securityLevel >= SecurityLevel.MODERATOR);
            newValue.roomPicker = (parser.securityLevel >= SecurityLevel.COMMUNITY);

            return newValue;
        });
    }, [ setNavigatorData ]);

    const onRoomForwardEvent = useCallback((event: RoomForwardEvent) =>
    {
        const parser = event.getParser();

        TryVisitRoom(parser.roomId);
    }, []);

    const onRoomEntryInfoMessageEvent = useCallback((event: RoomEntryInfoMessageEvent) =>
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

        SendMessageComposer(new RoomInfoComposer(parser.roomId, true, false));

        if(LegacyExternalInterface.available) LegacyExternalInterface.call('legacyTrack', 'navigator', 'private', [ parser.roomId ]);
    }, [ setNavigatorData ]);

    const onGetGuestRoomResultEvent = useCallback((event: GetGuestRoomResultEvent) =>
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
    }, [ setNavigatorData, setDoorData ]);

    const onRoomScoreEvent = useCallback((event: RoomScoreEvent) =>
    {
        const parser = event.getParser();

        setNavigatorData(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.currentRoomRating = parser.totalLikes;
            newValue.canRate = parser.canLike;

            return newValue;
        });
    }, [ setNavigatorData ]);

    const onRoomDoorbellEvent = useCallback((event: RoomDoorbellEvent) =>
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
    }, [ setDoorData ]);

    const onRoomDoorbellAcceptedEvent = useCallback((event: RoomDoorbellAcceptedEvent) =>
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
    }, [ setDoorData ]);

    const onRoomDoorbellRejectedEvent = useCallback((event: RoomDoorbellRejectedEvent) =>
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
    }, [ setDoorData ]);

    const onGenericErrorEvent = useCallback((event: GenericErrorEvent) =>
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
                NotificationUtilities.simpleAlert(LocalizeText('navigator.alert.need.to.be.vip'), NotificationAlertType.DEFAULT, null, null, LocalizeText('generic.alert.title'));

                return;
            case 4010:
                NotificationUtilities.simpleAlert(LocalizeText('navigator.alert.invalid_room_name'), NotificationAlertType.DEFAULT, null, null, LocalizeText('generic.alert.title'));

                return;
            case 4011:
                NotificationUtilities.simpleAlert(LocalizeText('navigator.alert.cannot_perm_ban'), NotificationAlertType.DEFAULT, null, null, LocalizeText('generic.alert.title'));

                return;
            case 4013:
                NotificationUtilities.simpleAlert(LocalizeText('navigator.alert.room_in_maintenance'), NotificationAlertType.DEFAULT, null, null, LocalizeText('generic.alert.title'));

                return;
        }
    }, [ setDoorData ]);

    const onNavigatorMetadataEvent = useCallback((event: NavigatorMetadataEvent) =>
    {
        const parser = event.getParser();

        setTopLevelContexts(parser.topLevelContexts);
        setTopLevelContext(parser.topLevelContexts.length ? parser.topLevelContexts[0] : null);
    }, [ setTopLevelContexts, setTopLevelContext ]);

    const onNavigatorSearchEvent = useCallback((event: NavigatorSearchEvent) =>
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
    }, [ topLevelContexts, setTopLevelContext, setSearchResult ]);

    const onNavigatorCategoriesEvent = useCallback((event: NavigatorCategoriesEvent) =>
    {
        const parser = event.getParser();

        setCategories(parser.categories);
    }, [ setCategories ]);

    const onRoomCreatedEvent = useCallback((event: RoomCreatedEvent) =>
    {
        const parser = event.getParser();

        CreateRoomSession(parser.roomId);
    }, []);

    const onNavigatorHomeRoomEvent = useCallback((event: NavigatorHomeRoomEvent) =>
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
    }, [ setNavigatorData ]);

    const onRoomEnterErrorEvent = useCallback((event: RoomEnterErrorEvent) =>
    {
        const parser = event.getParser();

        switch(parser.reason)
        {
            case CantConnectMessageParser.REASON_FULL:
                NotificationUtilities.simpleAlert(LocalizeText('navigator.guestroomfull.text'), NotificationAlertType.DEFAULT, null, null, LocalizeText('navigator.guestroomfull.title'));

                break;
            case CantConnectMessageParser.REASON_QUEUE_ERROR:
                NotificationUtilities.simpleAlert(LocalizeText(`room.queue.error.${ parser.parameter }`), NotificationAlertType.DEFAULT, null, null, LocalizeText('room.queue.error.title'));

                break;
            case CantConnectMessageParser.REASON_BANNED:
                NotificationUtilities.simpleAlert(LocalizeText('navigator.banned.text'), NotificationAlertType.DEFAULT, null, null, LocalizeText('navigator.banned.title'));

                break;
            default:
                NotificationUtilities.simpleAlert(LocalizeText('room.queue.error.title'), NotificationAlertType.DEFAULT, null, null, LocalizeText('room.queue.error.title'));

                break;
        }

        VisitDesktop();
    }, []);

    const onRoomCreatorEvent = useCallback((event: NavigatorOpenRoomCreatorEvent) =>
    {
        CreateLinkEvent('navigator/show');
    }, []);

    UseMessageEventHook(UserInfoEvent, onUserInfoEvent);
    UseMessageEventHook(UserPermissionsEvent, onUserPermissionsEvent);
    UseMessageEventHook(RoomForwardEvent, onRoomForwardEvent);
    UseMessageEventHook(RoomEntryInfoMessageEvent, onRoomEntryInfoMessageEvent);
    UseMessageEventHook(GetGuestRoomResultEvent, onGetGuestRoomResultEvent);
    UseMessageEventHook(RoomScoreEvent, onRoomScoreEvent);
    UseMessageEventHook(RoomDoorbellEvent, onRoomDoorbellEvent);
    UseMessageEventHook(RoomDoorbellAcceptedEvent, onRoomDoorbellAcceptedEvent);
    UseMessageEventHook(RoomDoorbellRejectedEvent, onRoomDoorbellRejectedEvent);
    UseMessageEventHook(GenericErrorEvent, onGenericErrorEvent);
    UseMessageEventHook(NavigatorMetadataEvent, onNavigatorMetadataEvent);
    UseMessageEventHook(NavigatorSearchEvent, onNavigatorSearchEvent);
    UseMessageEventHook(NavigatorCategoriesEvent, onNavigatorCategoriesEvent);
    UseMessageEventHook(RoomCreatedEvent, onRoomCreatedEvent);
    UseMessageEventHook(NavigatorHomeRoomEvent, onNavigatorHomeRoomEvent);
    UseMessageEventHook(RoomEnterErrorEvent, onRoomEnterErrorEvent);
    UseMessageEventHook(NavigatorOpenRoomCreatorEvent, onRoomCreatorEvent);

    return null;
}
