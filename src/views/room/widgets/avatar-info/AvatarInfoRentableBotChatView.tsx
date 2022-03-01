import { BotSkillSaveComposer } from '@nitrots/nitro-renderer';
import { FC, useMemo, useState } from 'react';
import { GetRoomObjectBounds, GetRoomSession, LocalizeText, RoomWidgetUpdateRentableBotChatEvent } from '../../../../api';
import { Base, Button, Column, Flex, Text } from '../../../../common';
import { SendMessageHook } from '../../../../hooks';
import { DraggableWindow, DraggableWindowPosition } from '../../../../layout';
import { ContextMenuHeaderView } from '../context-menu/ContextMenuHeaderView';
import { BotSkillsEnum } from './common/BotSkillsEnum';

interface AvatarInfoRentableBotChatViewProps
{
    chatEvent: RoomWidgetUpdateRentableBotChatEvent;
    close(): void;
}

export const AvatarInfoRentableBotChatView: FC<AvatarInfoRentableBotChatViewProps> = props =>
{
    const { chatEvent = null, close = null } = props;
    // eslint-disable-next-line no-template-curly-in-string
    const [ newText, setNewText ] = useState<string>(chatEvent.chat === '${bot.skill.chatter.configuration.text.placeholder}' ? '' : chatEvent.chat);
    const [ automaticChat, setAutomaticChat ] = useState<boolean>(chatEvent.automaticChat);
    const [ mixSentences, setMixSentences ] = useState<boolean>(chatEvent.mixSentences);
    const [ chatDelay, setChatDelay ] = useState<number>(chatEvent.chatDelay);

    const getObjectLocation = useMemo(() => GetRoomObjectBounds(GetRoomSession().roomId, chatEvent.objectId, chatEvent.category, 1), [ chatEvent ]);

    const formatChatString = (value: string) => value.replace(/;#;/g, ' ').replace(/\r\n|\r|\n/g, '\r');

    const save = () =>
    {
        const chatConfiguration = formatChatString(newText) + ';#;' + automaticChat + ';#;' + chatDelay + ';#;' + mixSentences;

        SendMessageHook(new BotSkillSaveComposer(chatEvent.botId, BotSkillsEnum.SETUP_CHAT, chatConfiguration));

        close();
    }
    
    return (
        <DraggableWindow position={ DraggableWindowPosition.NOTHING } handleSelector=".drag-handler" style={ { top: getObjectLocation.y, left: getObjectLocation.x } }>
            <Base className="nitro-context-menu bot-chat">
                <ContextMenuHeaderView className="drag-handler">
                    { LocalizeText('bot.skill.chatter.configuration.title') }
                </ContextMenuHeaderView>
                <Column className="p-1">
                    <Column gap={ 1 }>
                        <Text variant="white">{ LocalizeText('bot.skill.chatter.configuration.chat.text') }</Text>
                        <textarea className="form-control form-control-sm" placeholder={LocalizeText('bot.skill.chatter.configuration.text.placeholder')} value={newText} rows={7} onChange={e => setNewText(e.target.value)} />
                    </Column>
                    <Column gap={ 1 }>
                        <Flex gap={ 1 } alignItems="center" justifyContent="between">
                            <Text fullWidth variant="white">{ LocalizeText('bot.skill.chatter.configuration.automatic.chat') }</Text>
                            <input type="checkbox" className="form-check-input" checked={ automaticChat } onChange={ event => setAutomaticChat(event.target.checked) } />
                        </Flex>
                        <Flex gap={ 1 } alignItems="center" justifyContent="between">
                            <Text fullWidth variant="white">{ LocalizeText('bot.skill.chatter.configuration.markov') }</Text>
                            <input type="checkbox" className="form-check-input" checked={ mixSentences } onChange={ event => setMixSentences(event.target.checked) } />
                        </Flex>
                        <Flex gap={ 1 } alignItems="center" justifyContent="between">
                            <Text fullWidth variant="white">{ LocalizeText('bot.skill.chatter.configuration.chat.delay') }</Text>
                            <input type="number" className="form-control form-control-sm" value={ chatDelay } onChange={ event => setChatDelay(event.target.valueAsNumber) }/>
                        </Flex>
                    </Column>
                    <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                        <Button fullWidth variant="primary" onClick={ close }>{ LocalizeText('cancel') }</Button>
                        <Button fullWidth variant="success" onClick={ save }>{ LocalizeText('save') }</Button>
                    </Flex>
                </Column>
            </Base>
        </DraggableWindow>
    );
}
