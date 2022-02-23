import { BotSkillSaveComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { GetRoomObjectBounds, GetRoomSession, LocalizeText } from '../../../../../../api';
import { SendMessageHook } from '../../../../../../hooks';
import { DraggableWindow, DraggableWindowPosition } from '../../../../../../layout';
import { BotSkillsEnum } from '../../common/BotSkillsEnum';
import { AvatarInfoRentableBotChatViewProps } from './AvatarInfoRentableBotChatView.types';

export const AvatarInfoRentableBotChatView: FC<AvatarInfoRentableBotChatViewProps> = props =>
{
    const { chatEvent = null, close = null } = props;
    // eslint-disable-next-line no-template-curly-in-string
    const [ newText, setNewText ] = useState<string>(chatEvent.chat === '${bot.skill.chatter.configuration.text.placeholder}' ? '' : chatEvent.chat);
    const [ automaticChat, setAutomaticChat ] = useState<boolean>(chatEvent.automaticChat);
    const [ mixSentences, setMixSentences ] = useState<boolean>(chatEvent.mixSentences);
    const [ chatDelay, setChatDelay ] = useState<number>(chatEvent.chatDelay);

    const getObjectLocation = useMemo(() =>
    {
        return GetRoomObjectBounds(GetRoomSession().roomId, chatEvent.objectId, chatEvent.category, 1);
    }, [ chatEvent ]);

    const formatChatString = useCallback((value: string) =>
    {
        return value.replace(/;#;/g, ' ').replace(/\r\n|\r|\n/g, '\r');
    }, []);

    const save = useCallback(() =>
    {
        const chatConfiguration = formatChatString(newText) + ';#;' + automaticChat + ';#;' + chatDelay + ';#;' + mixSentences;
        SendMessageHook(new BotSkillSaveComposer(chatEvent.botId, BotSkillsEnum.SETUP_CHAT, chatConfiguration));
        close();
    }, [automaticChat, chatDelay, chatEvent.botId, close, formatChatString, mixSentences, newText]);

    return (
        <DraggableWindow position={ DraggableWindowPosition.NOTHING } handleSelector=".drag-handler" style={ { top: getObjectLocation.y, left: getObjectLocation.x } }>
            <div className="nitro-context-menu">
                <div className="drag-handler">
                <div className="px-2">
                    <div className="d-flex flex-column menu-item">
                        <p className="mb-1">{ LocalizeText('bot.skill.chatter.configuration.chat.text') }</p>
                        <textarea className="form-control form-control-sm mb-2" placeholder={LocalizeText('bot.skill.chatter.configuration.text.placeholder')} value={newText} rows={7} onChange={e => setNewText(e.target.value)}/>
                    </div>
                    <div className="d-flex flex-row menu-item">
                        <p className="mb-1 me-2">{ LocalizeText('bot.skill.chatter.configuration.automatic.chat') }</p>
                        <input type="checkbox" className="form-check-input" checked={automaticChat} onChange={e => setAutomaticChat(e.target.checked)} />
                    </div>
                    <div className="d-flex flex-row menu-item">
                        <p className="mb-1 me-2">{ LocalizeText('bot.skill.chatter.configuration.markov')}</p>
                        <input type="checkbox" className="form-check-input" checked={mixSentences} onChange={ e => setMixSentences(e.target.checked)} />
                    </div>
                    <div className="d-flex flex-row menu-item">
                        <p className="mb-1 me-2">{ LocalizeText('bot.skill.chatter.configuration.chat.delay') }</p>
                        <input type="number" className="form-control form-control-sm mb-2" value={chatDelay} onChange={e => setChatDelay(e.target.valueAsNumber)}/>
                    </div>
                    <div className="d-flex flex-row justify-content-between mt-1">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={close}>{ LocalizeText('cancel')}</button>
                        <button type="button" className="btn btn-success btn-sm" onClick={save}>{ LocalizeText('save') }</button>
                    </div>
                </div>
                </div>
            </div>
        </DraggableWindow>
    );
}
