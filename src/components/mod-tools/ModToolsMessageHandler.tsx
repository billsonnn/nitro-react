import { CfhSanctionMessageEvent, CfhTopicsInitEvent, IssueDeletedMessageEvent, IssueInfoMessageEvent, IssuePickFailedMessageEvent, ModeratorActionResultMessageEvent, ModeratorInitMessageEvent, ModeratorToolPreferencesEvent, RoomEngineEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { MODTOOLS_NEW_TICKET, PlaySound } from '../../api/utils/PlaySound';
import { ModToolsEvent } from '../../events/mod-tools/ModToolsEvent';
import { ModToolsOpenRoomChatlogEvent } from '../../events/mod-tools/ModToolsOpenRoomChatlogEvent';
import { ModToolsOpenRoomInfoEvent } from '../../events/mod-tools/ModToolsOpenRoomInfoEvent';
import { ModToolsOpenUserChatlogEvent } from '../../events/mod-tools/ModToolsOpenUserChatlogEvent';
import { ModToolsOpenUserInfoEvent } from '../../events/mod-tools/ModToolsOpenUserInfoEvent';
import { CreateMessageHook, useRoomEngineEvent, useUiEvent } from '../../hooks';
import { NotificationAlertType } from '../../views/notification-center/common/NotificationAlertType';
import { NotificationUtilities } from '../../views/notification-center/common/NotificationUtilities';
import { SetCfhCategories } from './common/GetCFHCategories';
import { useModToolsContext } from './ModToolsContext';
import { ModToolsActions } from './reducers/ModToolsReducer';

export const ModToolsMessageHandler: FC<{}> = props =>
{
    const { modToolsState = null, dispatchModToolsState = null } = useModToolsContext();
    const { openRooms = null, openRoomChatlogs = null, openUserChatlogs = null, openUserInfo = null, tickets= null } = modToolsState;
    
    const onModeratorInitMessageEvent = useCallback((event: ModeratorInitMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const data = parser.data;

        dispatchModToolsState({
            type: ModToolsActions.SET_INIT_DATA,
            payload: {
                settings: data
            }
        });

        dispatchModToolsState({
            type: ModToolsActions.SET_TICKETS,
            payload: {
                tickets: data.issues
            }
        });
          
    }, [dispatchModToolsState]);

    const onIssueInfoMessageEvent = useCallback((event: IssueInfoMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const newTickets = tickets ? Array.from(tickets) : [];
        const existingIndex = newTickets.findIndex( entry => entry.issueId === parser.issueData.issueId)

        if(existingIndex > -1)
        {
            newTickets[existingIndex] = parser.issueData;
        }
        else 
        {
            newTickets.push(parser.issueData);
            PlaySound(MODTOOLS_NEW_TICKET);
        }

        dispatchModToolsState({
            type: ModToolsActions.SET_TICKETS,
            payload: {
                tickets: newTickets
            }
        });

    }, [dispatchModToolsState, tickets]);

    const onModeratorToolPreferencesEvent = useCallback((event: ModeratorToolPreferencesEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

    }, []);

    const onIssuePickFailedMessageEvent = useCallback((event: IssuePickFailedMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        NotificationUtilities.simpleAlert('Failed to pick issue', NotificationAlertType.DEFAULT, null, null, 'Error')
    }, []);

    const onIssueDeletedMessageEvent = useCallback((event: IssueDeletedMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const newTickets = tickets ? Array.from(tickets) : [];
        const existingIndex = newTickets.findIndex( entry => entry.issueId === parser.issueId);

        if(existingIndex === -1) return;

        newTickets.splice(existingIndex, 1);

        dispatchModToolsState({
            type: ModToolsActions.SET_TICKETS,
            payload: {
                tickets: newTickets
            }
        });
    }, [dispatchModToolsState, tickets]);

    const onModeratorActionResultMessageEvent = useCallback((event: ModeratorActionResultMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        if(parser.success)
        {
            NotificationUtilities.simpleAlert('Moderation action was successfull', NotificationAlertType.MODERATION, null, null, 'Success');
        }
        else 
        {
            NotificationUtilities.simpleAlert('There was a problem applying tht moderation action', NotificationAlertType.MODERATION, null, null, 'Error');
        }
    }, []);

    const onCfhTopicsInitEvent = useCallback((event: CfhTopicsInitEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const categories = parser.callForHelpCategories;

        dispatchModToolsState({
            type: ModToolsActions.SET_CFH_CATEGORIES,
            payload: {
                cfhCategories: categories
            }
        });

        SetCfhCategories(categories);
        
    }, [dispatchModToolsState]);

    const onCfhSanctionMessageEvent = useCallback((event: CfhSanctionMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;
        
        // todo: update sanction data
    }, []);

    CreateMessageHook(ModeratorInitMessageEvent, onModeratorInitMessageEvent);
    CreateMessageHook(IssueInfoMessageEvent, onIssueInfoMessageEvent);
    CreateMessageHook(ModeratorToolPreferencesEvent, onModeratorToolPreferencesEvent);
    CreateMessageHook(IssuePickFailedMessageEvent, onIssuePickFailedMessageEvent);
    CreateMessageHook(IssueDeletedMessageEvent, onIssueDeletedMessageEvent);
    CreateMessageHook(ModeratorActionResultMessageEvent, onModeratorActionResultMessageEvent);
    CreateMessageHook(CfhTopicsInitEvent, onCfhTopicsInitEvent);
    CreateMessageHook(CfhSanctionMessageEvent, onCfhSanctionMessageEvent);

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineEvent.INITIALIZED:
                dispatchModToolsState({
                    type: ModToolsActions.SET_CURRENT_ROOM_ID,
                    payload: {
                        currentRoomId: event.roomId
                    }
                });
                return;
            case RoomEngineEvent.DISPOSED:
                dispatchModToolsState({
                    type: ModToolsActions.SET_CURRENT_ROOM_ID,
                    payload: {
                        currentRoomId: null
                    }
                });
                return;
        }
    }, [ dispatchModToolsState ]);

    useRoomEngineEvent(RoomEngineEvent.INITIALIZED, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineEvent.DISPOSED, onRoomEngineEvent);

    const onModToolsEvent = useCallback((event: ModToolsEvent) =>
    {
        switch(event.type)
        {
            case ModToolsEvent.OPEN_ROOM_INFO: {
                const castedEvent = (event as ModToolsOpenRoomInfoEvent);
                
                if(openRooms && openRooms.includes(castedEvent.roomId)) return;
                
                const rooms = openRooms || [];
                
                dispatchModToolsState({
                    type: ModToolsActions.SET_OPEN_ROOMS,
                    payload: {
                        openRooms: [...rooms, castedEvent.roomId]
                    }
                });
                return;
            }
            case ModToolsEvent.OPEN_ROOM_CHATLOG: {
                const castedEvent = (event as ModToolsOpenRoomChatlogEvent); 

                if(openRoomChatlogs && openRoomChatlogs.includes(castedEvent.roomId)) return;

                const chatlogs = openRoomChatlogs || [];

                dispatchModToolsState({
                    type: ModToolsActions.SET_OPEN_ROOM_CHATLOGS,
                    payload: {
                        openRoomChatlogs: [...chatlogs, castedEvent.roomId]
                    }
                });
                return;
            }
            case ModToolsEvent.OPEN_USER_INFO: {
                const castedEvent = (event as ModToolsOpenUserInfoEvent);

                if(openUserInfo && openUserInfo.includes(castedEvent.userId)) return;

                const userInfo = openUserInfo || [];

                dispatchModToolsState({
                    type: ModToolsActions.SET_OPEN_USERINFO,
                    payload: {
                        openUserInfo: [...userInfo, castedEvent.userId]
                    }
                });
                return;
            }
            case ModToolsEvent.OPEN_USER_CHATLOG: {
                const castedEvent = (event as ModToolsOpenUserChatlogEvent);

                if(openUserChatlogs && openUserChatlogs.includes(castedEvent.userId)) return;

                const userChatlog = openUserChatlogs || [];

                dispatchModToolsState({
                    type: ModToolsActions.SET_OPEN_USER_CHATLOGS,
                    payload: {
                        openUserChatlogs: [...userChatlog, castedEvent.userId]
                    }
                });
                return;
            }
        }
    }, [openRooms, dispatchModToolsState, openRoomChatlogs, openUserInfo, openUserChatlogs]);
    
    useUiEvent(ModToolsEvent.OPEN_ROOM_INFO, onModToolsEvent);
    useUiEvent(ModToolsEvent.OPEN_ROOM_CHATLOG, onModToolsEvent);
    useUiEvent(ModToolsEvent.OPEN_USER_INFO, onModToolsEvent);
    useUiEvent(ModToolsEvent.OPEN_USER_CHATLOG, onModToolsEvent);

    return null;
}
