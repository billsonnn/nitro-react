import { RoomObjectType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { LocalizeText } from '../../../api';
import { NitroCardGridItemView, NitroCardGridView } from '../../../layout';
import { GetChatHistory } from '../../chat-history/common/GetChatHistory';
import { ChatEntryType, IChatEntry } from '../../chat-history/context/ChatHistoryContext.types';
import { useHelpContext } from '../context/HelpContext';

export const SelectReportedChatsView: FC<{}> = props =>
{
    const { helpReportState = null, setHelpReportState = null } = useHelpContext();
    const [ selectedChats, setSelectedChats ] = useState<Map<number, IChatEntry>>(new Map());

    const userChats = useMemo(() =>
    {
        return GetChatHistory().chats.filter(chat => (chat.type === ChatEntryType.TYPE_CHAT) && (chat.entityId === helpReportState.reportedUserId) && (chat.entityType === RoomObjectType.USER))
    }, [helpReportState.reportedUserId]);

    const selectChat = useCallback((chatEntry: IChatEntry) =>
    {
        const chats = new Map(selectedChats);

        if(chats.has(chatEntry.id))
        {
            chats.delete(chatEntry.id);
        }

        else
        {
            chats.set(chatEntry.id, chatEntry);
        }

        setSelectedChats(chats);

    }, [selectedChats]);

    const submitChats = useCallback(() =>
    {
        if(!selectedChats || selectedChats.size <= 0) return;

        const reportState = Object.assign({}, helpReportState);

        reportState.reportedChats = Array.from(selectedChats.values());
        reportState.currentStep = 3;
        setHelpReportState(reportState);

    }, [helpReportState, selectedChats, setHelpReportState]);

    const back = useCallback(() =>
    {
        const reportState = Object.assign({}, helpReportState);
        reportState.currentStep = --reportState.currentStep;
        setHelpReportState(reportState);
    }, [helpReportState, setHelpReportState]);
    
    return (
        <>
            <div className="d-grid col-12 mx-auto justify-content-center">
                <div className="col-12"><h3 className="fw-bold">{LocalizeText('help.emergency.chat_report.subtitle')}</h3></div>
                { userChats.length > 0 &&
                    <div className="text-wrap">{LocalizeText('help.emergency.chat_report.description')}</div>
                }
            </div>
            {
                (userChats.length === 0) && <div>{LocalizeText('help.cfh.error.no_user_data')}</div>
            }
            { userChats.length > 0 &&
                <>
                    <NitroCardGridView columns={1}>
                        {userChats.map((chat, index) =>
                        {
                            return (
                                <NitroCardGridItemView key={chat.id} onClick={() => selectChat(chat)} itemActive={selectedChats.has(chat.id)}>
                                    <span>{chat.message}</span>
                                </NitroCardGridItemView>
                            )
                        })}
                    </NitroCardGridView>

                    <div className="d-flex gap-2 justify-content-between mt-auto">
                        <button className="btn btn-secondary mt-2" type="button" onClick={back}>{LocalizeText('generic.back')}</button>
                        <button className="btn btn-primary mt-2" type="button" disabled={selectedChats.size <= 0} onClick={submitChats}>{LocalizeText('help.emergency.main.submit.button')}</button>
                    </div>
                </>
            }
        </>
    );
}
