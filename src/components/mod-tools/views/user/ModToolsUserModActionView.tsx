import { CallForHelpTopicData, DefaultSanctionMessageComposer, ModAlertMessageComposer, ModBanMessageComposer, ModKickMessageComposer, ModMessageMessageComposer, ModMuteMessageComposer, ModTradingLockMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Button, Column, Flex, Text } from '../../../../common';
import { SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { NotificationAlertType } from '../../../../views/notification-center/common/NotificationAlertType';
import { NotificationUtilities } from '../../../../views/notification-center/common/NotificationUtilities';
import { useModToolsContext } from '../../ModToolsContext';
import { ISelectedUser } from '../../utils/ISelectedUser';
import { ModActionDefinition } from '../../utils/ModActionDefinition';

interface ModToolsUserModActionViewProps
{
    user: ISelectedUser;
    onCloseClick: () => void;
}

const MOD_ACTION_DEFINITIONS = [
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
    const [ selectedTopic, setSelectedTopic ] = useState(-1);
    const [ selectedAction, setSelectedAction ] = useState(-1);
    const [ message, setMessage ] = useState<string>('');
    const { modToolsState = null } = useModToolsContext();
    const { cfhCategories = null, settings = null } = modToolsState;

    const topics = useMemo(() =>
    {
        const values: CallForHelpTopicData[] = [];

        if(cfhCategories && cfhCategories.length)
        {
            for(const category of cfhCategories)
            {
                for(const topic of category.topics) values.push(topic);
            }
        }

        return values;
    }, [ cfhCategories ]);

    const sendAlert = (message: string) =>
    {
        NotificationUtilities.simpleAlert(message, NotificationAlertType.DEFAULT, null, null, 'Error');
    }

    const sendDefaultSanction = () =>
    {
        SendMessageHook(new DefaultSanctionMessageComposer(user.userId, selectedTopic, message));

        onCloseClick();
    }

    const sendSanction = () =>
    {
        let errorMessage: string = null;

        const category = topics[selectedTopic];
        const sanction = MOD_ACTION_DEFINITIONS[selectedAction];

        if((selectedTopic === -1) || (selectedAction === -1)) errorMessage = 'You must select a CFH topic and Sanction';
        else if(!settings || !settings.cfhPermission) errorMessage = 'You do not have permission to do this';
        else if(!category) errorMessage = 'You must select a CFH topic';
        else if(!sanction) errorMessage = 'You must select a sanction';

        if(errorMessage)
        {
            sendAlert('You must select a sanction');
            
            return;
        }

        const messageOrDefault = (message.trim().length === 0) ? LocalizeText(`help.cfh.topic.${ category.id }`) : message;

        switch(sanction.actionType)
        {
            case ModActionDefinition.ALERT: {
                if(!settings.alertPermission)
                {
                    sendAlert('You have insufficient permissions');

                    return;
                }

                if(message.trim().length === 0)
                {
                    sendAlert('Please write a message to user');

                    return;
                }

                SendMessageHook(new ModAlertMessageComposer(user.userId, message, category.id));
                break;
            }
            case ModActionDefinition.MUTE: 
                SendMessageHook(new ModMuteMessageComposer(user.userId, messageOrDefault, category.id));
                break;
            case ModActionDefinition.BAN: {
                if(!settings.banPermission)
                {
                    sendAlert('You have insufficient permissions');

                    return;
                }

                SendMessageHook(new ModBanMessageComposer(user.userId, messageOrDefault, category.id, selectedAction, (sanction.actionId === 106)));
                break;
            }
            case ModActionDefinition.KICK: {
                if(!settings.kickPermission)
                {
                    sendAlert('You have insufficient permissions');
                    return;
                }

                SendMessageHook(new ModKickMessageComposer(user.userId, messageOrDefault, category.id));
                break;
            }
            case ModActionDefinition.TRADE_LOCK: {
                const numSeconds = (sanction.actionLengthHours * 60);

                SendMessageHook(new ModTradingLockMessageComposer(user.userId, messageOrDefault, numSeconds, category.id));
                break;
            }
            case ModActionDefinition.MESSAGE: {
                if(message.trim().length === 0)
                {
                    sendAlert('Please write a message to user');

                    return;
                }

                SendMessageHook(new ModMessageMessageComposer(user.userId, message,  category.id));
                break;
            }
        }

        onCloseClick();
    }

    if(!user) return null;

    return (
        <NitroCardView className="nitro-mod-tools-user-action" simple={true}>
            <NitroCardHeaderView headerText={'Mod Action: ' + (user ? user.username : '')} onCloseClick={ () => onCloseClick() } />
            <NitroCardContentView className="text-black">
                <select className="form-select form-select-sm" value={ selectedTopic } onChange={ event => setSelectedTopic(parseInt(event.target.value)) }>
                    <option value={ -1 } disabled>CFH Topic</option>
                    { topics.map((topic, index) => <option key={ index } value={ index }>{LocalizeText('help.cfh.topic.' + topic.id)}</option>) }
                </select>
                <select className="form-select form-select-sm" value={ selectedAction } onChange={ event => setSelectedAction(parseInt(event.target.value)) }>
                    <option value={ -1 } disabled>Sanction Type</option>
                    { MOD_ACTION_DEFINITIONS.map((action, index) => <option key={ index } value={ index }>{ action.name }</option>) }
                </select>
                <Column gap={ 1 }>
                    <Text small>Optional message type, overrides default</Text>
                    <textarea className="form-control" value={ message } onChange={ event => setMessage(event.target.value) }/>
                </Column>
                <Flex justifyContent="between" gap={ 1 }>
                    <Button variant="danger" onClick={ sendSanction }>Sanction</Button>
                    <Button variant="success" onClick={ sendDefaultSanction }>Default Sanction</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
