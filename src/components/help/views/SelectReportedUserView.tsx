import { RoomObjectType } from '@nitrots/nitro-renderer';
import { FC, useMemo, useState } from 'react';
import { ChatEntryType, GetSessionDataManager, IReportedUser, LocalizeText, ReportState } from '../../../api';
import { AutoGrid, Button, Column, Flex, LayoutGridItem, Text } from '../../../common';
import { useChatHistory, useHelp } from '../../../hooks';

export const SelectReportedUserView: FC<{}> = props =>
{
    const [ selectedUserId, setSelectedUserId ] = useState(-1);
    const { chatHistory = [] } = useChatHistory();
    const { activeReport = null, setActiveReport = null } = useHelp();

    const availableUsers = useMemo(() =>
    {
        const users: Map<number, IReportedUser> = new Map();

        chatHistory.forEach(chat =>
        {
            if((chat.type === ChatEntryType.TYPE_CHAT) && (chat.entityType === RoomObjectType.USER) && (chat.entityId !== GetSessionDataManager().userId) && !users.has(chat.entityId)) users.set(chat.entityId, { id: chat.entityId, username: chat.name });
        });

        return Array.from(users.values());
    }, [ chatHistory ]);

    const submitUser = () =>
    {
        if(selectedUserId <= 0) return;

        setActiveReport(prevValue =>
        {
            return { ...prevValue, reportedUserId: selectedUserId, currentStep: ReportState.SELECT_CHATS };
        });
    }

    const selectUser = (userId: number) =>
    {
        setSelectedUserId(prevValue =>
        {
            if(userId === prevValue) return -1;

            return userId;
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
                <Text fontSize={ 4 }>{ LocalizeText('help.emergency.main.step.two.title') }</Text>
                { (availableUsers.length > 0) &&
                    <Text>{ LocalizeText('report.user.pick.user') }</Text> }
            </Column>
            <Column gap={ 1 } overflow="hidden">
                { !!!availableUsers.length &&
                    <Text>{ LocalizeText('report.user.error.nolist') }</Text> }
                { (availableUsers.length > 0) &&
                    <AutoGrid columnCount={ 1 } columnMinHeight={ 25 } gap={ 1 }>
                        { availableUsers.map((user, index) =>
                        {
                            return (
                                <LayoutGridItem key={ user.id } onClick={ event => selectUser(user.id) } itemActive={ (selectedUserId === user.id) }>
                                    <span dangerouslySetInnerHTML={ { __html: (user.username) } } />
                                </LayoutGridItem>
                            );
                        }) }
                    </AutoGrid> }
            </Column>
            <Flex gap={ 2 } justifyContent="between">
                <Button variant="secondary" onClick={ back }>
                    { LocalizeText('generic.back') }
                </Button>
                <Button disabled={ (selectedUserId <= 0) } onClick={ submitUser }>
                    { LocalizeText('help.emergency.main.submit.button') }
                </Button>
            </Flex>
        </>
    );
}
