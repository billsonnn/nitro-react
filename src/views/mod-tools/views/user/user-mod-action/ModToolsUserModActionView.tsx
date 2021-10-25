import { CallForHelpTopicData, DefaultSanctionMessageComposer, ModAlertMessageComposer, ModBanMessageComposer, ModKickMessageComposer, ModMessageMessageComposer, ModMuteMessageComposer, ModTradingLockMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../../api';
import { NotificationAlertEvent } from '../../../../../events';
import { dispatchUiEvent, SendMessageHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { useModToolsContext } from '../../../context/ModToolsContext';
import { ModActionDefinition } from '../../../utils/ModActionDefinition';
import { ModToolsUserModActionViewProps } from './ModToolsUserModActionView.types';

const actions = [
    new ModActionDefinition(1, 'Alert', ModActionDefinition.ALERT, 1, 0),
    new ModActionDefinition(2, 'Mute 1h', ModActionDefinition.MUTE, 2, 0),
    new ModActionDefinition(4, 'Ban 7 days', ModActionDefinition.BAN, 4, 0),
    new ModActionDefinition(3, 'Ban 18h', ModActionDefinition.BAN, 3, 0),
    new ModActionDefinition(5, 'Ban 30 days (step 1)', ModActionDefinition.BAN, 5, 0),
    new ModActionDefinition(7, 'Ban 30 days (step 2)', ModActionDefinition.BAN, 7, 0),
    new ModActionDefinition(6, 'Ban 100 years', ModActionDefinition.BAN, 6, 0),
    new ModActionDefinition(106, 'Ban avatar-only 100 years', ModActionDefinition.BAN, 6, 0),
    new ModActionDefinition(101, 'Kick', ModActionDefinition.KICK, 0, 0),
    new ModActionDefinition(102, 'Lock trade 1 week', ModActionDefinition.TRADE_LOCK, 0, 168),
    new ModActionDefinition(104, 'Lock trade permanent', ModActionDefinition.TRADE_LOCK, 0, 876000),
    new ModActionDefinition(105, 'Message', ModActionDefinition.MESSAGE, 0, 0),
];

export const ModToolsUserModActionView: FC<ModToolsUserModActionViewProps> = props =>
{
    const { user = null, onCloseClick = null } = props;
    const { modToolsState = null, dispatchModToolsState = null } = useModToolsContext();
    const { cfhCategories = null, settings = null } = modToolsState;
    const [ selectedTopic, setSelectedTopic ] = useState(-1);
    const [ selectedAction, setSelectedAction ] = useState(-1);
    const [ message, setMessage ] = useState<string>('');

    const topics = useMemo(() =>
    {
        const values: CallForHelpTopicData[] = [];

        if(!cfhCategories) return values;

        for(let category of cfhCategories)
        {
            for(let topic of category.topics)
            {
                values.push(topic)
            }
        }

        return values;
    }, [cfhCategories]);

    const sendDefaultSanction = useCallback(() =>
    {
        SendMessageHook(new DefaultSanctionMessageComposer(user.userId, selectedTopic, message));
        onCloseClick();
    }, [message, onCloseClick, selectedTopic, user.userId]);

    const sendSanction = useCallback(() =>
    {
        if( (selectedTopic === -1) || (selectedAction === -1) )
        {
            dispatchUiEvent(new NotificationAlertEvent(['You must select a CFH topic and Sanction'], null, null, null, 'Error', null));
            return;
        }

        if(!settings || !settings.cfhPermission) 
        {
            dispatchUiEvent(new NotificationAlertEvent(['You do not have permission to do this'], null, null, null, 'Error', null));
            return;
        }

        const category = topics[selectedTopic];
        const sanction = actions[selectedAction];

        if(!category)
        {
            dispatchUiEvent(new NotificationAlertEvent(['You must select a CFH topic'], null, null, null, 'Error', null));
            return;
        }

        if(!sanction)
        {
            dispatchUiEvent(new NotificationAlertEvent(['You must select a sanction'], null, null, null, 'Error', null));
            return;
        }

        const messageOrDefault = message.trim().length === 0 ? LocalizeText('help.cfh.topic.' + category.id) : message;

        switch(sanction.actionType)
        {
            case ModActionDefinition.ALERT:
            
                    if(!settings.alertPermission)
                    {
                        dispatchUiEvent(new NotificationAlertEvent(['You have insufficient permissions.'], null, null, null, 'Error', null));
                        return;
                    }

                    if(message.trim().length === 0)
                    {
                        dispatchUiEvent(new NotificationAlertEvent(['Please write a message to user.'], null, null, null, 'Error', null));
                        return;
                    }

                    SendMessageHook(new ModAlertMessageComposer(user.userId, message, category.id));
            
                break;
            case ModActionDefinition.MUTE: 
                SendMessageHook(new ModMuteMessageComposer(user.userId, messageOrDefault, category.id));
            
                break;
            case ModActionDefinition.BAN:
                
                    if(!settings.banPermission)
                    {
                        dispatchUiEvent(new NotificationAlertEvent(['You have insufficient permissions.'], null, null, null, 'Error', null));
                        return;
                    }

                    SendMessageHook(new ModBanMessageComposer(user.userId, messageOrDefault, category.id, selectedAction, (sanction.actionId === 106)));
                
                break;

            case ModActionDefinition.KICK:
                
                    if(!settings.kickPermission)
                    {
                        dispatchUiEvent(new NotificationAlertEvent(['You have insufficient permissions.'], null, null, null, 'Error', null));
                        return;
                    }

                    SendMessageHook(new ModKickMessageComposer(user.userId, messageOrDefault, category.id));
                
                break;

            case ModActionDefinition.TRADE_LOCK:
                {
                    const numSeconds = sanction.actionLengthHours * 60;
                    SendMessageHook(new ModTradingLockMessageComposer(user.userId, messageOrDefault, numSeconds, category.id));
                }
                break;

            case ModActionDefinition.MESSAGE:
                
                    if(message.trim().length === 0)
                    {
                        dispatchUiEvent(new NotificationAlertEvent(['Please write a message to user.'], null, null, null, 'Error', null));
                        return;
                    }

                    SendMessageHook(new ModMessageMessageComposer(user.userId, message,  category.id));
                
                break;
        }

        onCloseClick();
    }, [message, onCloseClick, selectedAction, selectedTopic, settings, topics, user.userId]);

    return (
        <NitroCardView className="nitro-mod-tools-user-action" simple={true}>
            <NitroCardHeaderView headerText={'Mod Action: ' + (user ? user.username : '')} onCloseClick={ () => onCloseClick() } />
            <NitroCardContentView className="text-black">
                { user && 
                    <>
                        <div className="form-group mb-2">
                            <select className="form-control form-control-sm" value={selectedTopic} onChange={event => setSelectedTopic(parseInt(event.target.value))}>
                                <option value={-1}>CFH Topic:</option>
                                { topics.map( (topic,index) =>
                                {
                                    return (<option key={index} value={index}>{LocalizeText('help.cfh.topic.' + topic.id)}</option>)
                                })}
                            </select>
                        </div>

                        <div className="form-group mb-2">
                            <select className="form-control form-control-sm" value={selectedAction} onChange={event => setSelectedAction(parseInt(event.target.value))}>
                                <option value={-1}>Sanction type:</option>
                                { actions.map( (action, index) =>
                                {
                                    return (<option key={index} value={index}>{ action.name }</option>)
                                })}
                            </select>
                        </div>

                        <div className="form-group mb-2">
                            <label>Optional message type, overrides default</label>
                            <textarea className="form-control" value={message} onChange={event => setMessage(event.target.value)}/>
                        </div>

                        <div className="form-group mb-2">
                            <div className="d-flex justify-content-between">
                                <button type="button" className="btn btn-danger w-100 me-2" onClick={ () => sendSanction()}>Sanction</button>
                                <button className="btn btn-success w-100" onClick={ () => sendDefaultSanction()}>Default Sanction</button>
                            </div>
                        </div>
                    </>
                }
            </NitroCardContentView>
        </NitroCardView>
    );
}
