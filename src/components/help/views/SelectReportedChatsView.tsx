import { RoomObjectType } from '@nitrots/nitro-renderer';
import { FC, useMemo, useState } from 'react';
import { ChatEntryType, IChatEntry, LocalizeText } from '../../../api';
import { AutoGrid, Button, Column, Flex, LayoutGridItem, Text } from '../../../common';
import { useChatHistory } from '../../../hooks';
import { useHelpContext } from '../HelpContext';

export const SelectReportedChatsView: FC<{}> = props =>
{
    const [ selectedChats, setSelectedChats ] = useState<Map<number, IChatEntry>>(new Map());
    const { chatHistory = [] } = useChatHistory();
    const { helpReportState = null, setHelpReportState = null } = useHelpContext();
    const { reportedUserId = -1 } = helpReportState;

    const userChats = useMemo(() =>
    {
        return chatHistory.filter(chat => (chat.type === ChatEntryType.TYPE_CHAT) && (chat.entityId === reportedUserId) && (chat.entityType === RoomObjectType.USER));
    }, [ chatHistory, reportedUserId ]);

    const selectChat = (chatEntry: IChatEntry) =>
    {
        const chats = new Map(selectedChats);

        if(chats.has(chatEntry.id)) chats.delete(chatEntry.id);
        else chats.set(chatEntry.id, chatEntry);

        setSelectedChats(chats);
    }

    const submitChats = () =>
    {
        if(!selectedChats || (selectedChats.size <= 0)) return;

        setHelpReportState(prevValue =>
        {
            const reportedChats = Array.from(selectedChats.values());
            const currentStep = 3;

            return { ...prevValue, reportedChats, currentStep };
        });
    }

    const back = () =>
    {
        setHelpReportState(prevValue =>
        {
            const currentStep = (prevValue.currentStep - 1);

            return { ...prevValue, currentStep };
        });
    }

    return (
        <>
            <Column gap={ 1 }>
                <Text fontSize={ 4 }>{ LocalizeText('help.emergency.chat_report.subtitle') }</Text>
                <Text>{ LocalizeText('help.emergency.chat_report.description') }</Text>
            </Column>
            <Column gap={ 1 } overflow="hidden">
                { !!!userChats.length &&
                    <Text>{ LocalizeText('help.cfh.error.no_user_data') }</Text> }
                { (userChats.length > 0) &&
                    <AutoGrid gap={ 1 } columnCount={ 1 } columnMinHeight={ 25 } overflow="auto">
                        { userChats.map((chat, index) =>
                        {
                            return (
                                <LayoutGridItem key={ chat.id } onClick={ event => selectChat(chat) } itemActive={ selectedChats.has(chat.id) }>
                                    <Text>{ chat.message }</Text>
                                </LayoutGridItem>
                            );
                        }) }
                    </AutoGrid> }
            </Column>
            <Flex gap={ 2 } justifyContent="between">
                <Button variant="secondary" onClick={ back }>
                    { LocalizeText('generic.back') }
                </Button>
                <Button disabled={ (selectedChats.size <= 0) } onClick={ submitChats }>
                    { LocalizeText('help.emergency.main.submit.button') }
                </Button>
            </Flex>
        </>
    );
}
