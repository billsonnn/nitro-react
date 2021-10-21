import { IssueInfoMessageEvent, ModeratorInitMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateMessageHook } from '../../hooks';
import { useModToolsContext } from './context/ModToolsContext';
import { ModToolsActions } from './reducers/ModToolsReducer';

export const ModToolsMessageHandler: FC<{}> = props =>
{
    const { modToolsState = null, dispatchModToolsState = null } = useModToolsContext();
    const { tickets= null } = modToolsState;
    
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
        
        console.log(parser);   
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
        }

        dispatchModToolsState({
            type: ModToolsActions.SET_TICKETS,
            payload: {
                tickets: newTickets
            }
        })
    }, [dispatchModToolsState, tickets]);

    CreateMessageHook(ModeratorInitMessageEvent, onModeratorInitMessageEvent);
    CreateMessageHook(IssueInfoMessageEvent, onIssueInfoMessageEvent);

    return null;
}
