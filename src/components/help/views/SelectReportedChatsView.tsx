import { RoomObjectType } from '@nitrots/nitro-renderer';
import { FC, useMemo, useState } from 'react';
import { LocalizeText } from '../../../api';
import { Button, Column, Flex, Grid, LayoutGridItem, Text } from '../../../common';
import { ChatEntryType } from '../../chat-history/common/ChatEntryType';
import { GetChatHistory } from '../../chat-history/common/GetChatHistory';
import { IChatEntry } from '../../chat-history/common/IChatEntry';
import { useHelpContext } from '../HelpContext';

export const SelectReportedChatsView: FC<{}> = props =>
{
    const [ selectedChats, setSelectedChats ] = useState<Map<number, IChatEntry>>(new Map());
    const { helpReportState = null, setHelpReportState = null } = useHelpContext();
    const { reportedUserId = -1 } = helpReportState;

    const userChats = useMemo(() =>
    {
        return GetChatHistory().chats.filter(chat => (chat.type === ChatEntryType.TYPE_CHAT) && (chat.entityId === reportedUserId) && (chat.entityType === RoomObjectType.USER));
    }, [ reportedUserId ]);

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
                <Text fontSize={ 3 }>{ LocalizeText('help.emergency.chat_report.subtitle') }</Text>
                <Text>{ LocalizeText('help.emergency.chat_report.description') }</Text>
            </Column>
            <Column gap={ 1 }>
                { !!!userChats.length &&
                    <Text>{ LocalizeText('help.cfh.error.no_user_data') }</Text> }
                { (userChats.length > 0) &&
                    <Grid gap={ 1 } columnCount={ 1 } overflow="auto">
                        { userChats.map((chat, index) =>
                            {
                                return (
                                    <LayoutGridItem key={ chat.id } onClick={ event => selectChat(chat) } itemActive={ selectedChats.has(chat.id) }>
                                        <Text>{ chat.message }</Text>
                                    </LayoutGridItem>
                                );
                            }) }
                    </Grid> }
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
