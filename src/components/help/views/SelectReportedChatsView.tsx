import { RoomObjectType } from '@nitrots/nitro-renderer';
import { FC, useMemo, useState } from 'react';
import { ChatEntryType, IChatEntry, LocalizeText, ReportState, ReportType } from '../../../api';
import { AutoGrid, Button, Column, Flex, LayoutGridItem, Text } from '../../../common';
import { useChatHistory, useHelp } from '../../../hooks';

export const SelectReportedChatsView: FC<{}> = props =>
{
    const [ selectedChats, setSelectedChats ] = useState<IChatEntry[]>([]);
    const { activeReport = null, setActiveReport = null } = useHelp();
    const { chatHistory = [], messengerHistory = [] } = useChatHistory();

    const userChats = useMemo(() =>
    {
        switch(activeReport.reportType)
        {
            case ReportType.BULLY:
            case ReportType.EMERGENCY:
                return chatHistory.filter(chat => (chat.type === ChatEntryType.TYPE_CHAT) && (chat.entityId === activeReport.reportedUserId) && (chat.entityType === RoomObjectType.USER));
            case ReportType.IM:
                return messengerHistory.filter(chat => (chat.entityId === activeReport.reportedUserId) && (chat.type === ChatEntryType.TYPE_IM));
        }

        return [];
    }, [ activeReport, chatHistory, messengerHistory ]);

    const selectChat = (chatEntry: IChatEntry) =>
    {
        setSelectedChats(prevValue =>
        {
            const newValue = [ ...prevValue ];
            const index = newValue.indexOf(chatEntry);

            if(index >= 0) newValue.splice(index, 1);
            else newValue.push(chatEntry);

            return newValue;
        });
    }

    const submitChats = () =>
    {
        if(!selectedChats || (selectedChats.length <= 0)) return;

        setActiveReport(prevValue =>
        {
            return { ...prevValue, reportedChats: selectedChats, currentStep: ReportState.SELECT_TOPICS };
        });
    }

    const back = () =>
    {
        setActiveReport(prevValue =>
        {
            return { ...prevValue, currentStep: (prevValue.currentStep - 1) };
        });
    }

    return (
        <>
            <Column gap={ 1 }>
                <Text fontSize={ 4 }>{ LocalizeText('help.emergency.chat_report.subtitle') }</Text>
                <Text>{ LocalizeText('help.emergency.chat_report.description') }</Text>
            </Column>
            <Column gap={ 1 } overflow="hidden">
                { !userChats || !userChats.length &&
                    <Text>{ LocalizeText('help.cfh.error.no_user_data') }</Text> }
                { (userChats.length > 0) &&
                    <AutoGrid gap={ 1 } columnCount={ 1 } columnMinHeight={ 25 } overflow="auto">
                        { userChats.map((chat, index) =>
                        {
                            return (
                                <LayoutGridItem key={ chat.id } onClick={ event => selectChat(chat) } itemActive={ (selectedChats.indexOf(chat) >= 0) }>
                                    <Text>{ chat.message }</Text>
                                </LayoutGridItem>
                            );
                        }) }
                    </AutoGrid> }
            </Column>
            <Flex gap={ 2 } justifyContent="between">
                <Button variant="secondary" onClick={ back } disabled={ (activeReport.reportType === ReportType.IM) }>
                    { LocalizeText('generic.back') }
                </Button>
                <Button disabled={ (selectedChats.length <= 0) } onClick={ submitChats }>
                    { LocalizeText('help.emergency.main.submit.button') }
                </Button>
            </Flex>
        </>
    );
}
