import { GetSessionDataManager, RoomObjectType } from '@nitrots/nitro-renderer';
import { FC, useMemo, useState } from 'react';
import { ChatEntryType, IReportedUser, LocalizeText, ReportState } from '../../../api';
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
            if((chat.type === ChatEntryType.TYPE_CHAT) && (chat.entityType === RoomObjectType.USER) && (chat.webId !== GetSessionDataManager().userId) && !users.has(chat.webId)) users.set(chat.webId, { id: chat.webId, username: chat.name });
        });

        return Array.from(users.values());
    }, [ chatHistory ]);

    const submitUser = (userId: number) =>
    {
        if(userId <= 0) return;

        setActiveReport(prevValue =>
        {
            return { ...prevValue, reportedUserId: userId, currentStep: ReportState.SELECT_CHATS };
        });
    };

    const selectUser = (userId: number) =>
    {
        setSelectedUserId(prevValue =>
        {
            if(userId === prevValue) return -1;

            return userId;
        });
    };

    const back = () =>
    {
        setActiveReport(prevValue =>
        {
            return { ...prevValue, currentStep: (prevValue.currentStep - 1) };
        });
    };

    return (
        <>
            <div className="flex flex-col gap-1">
                <Text fontSize={ 4 }>{ LocalizeText('help.emergency.main.step.two.title') }</Text>
                { (availableUsers.length > 0) &&
                    <Text>{ LocalizeText('report.user.pick.user') }</Text> }
            </div>
            <Column gap={ 1 } overflow="hidden">
                { !!!availableUsers.length &&
                    <Text>{ LocalizeText('report.user.error.nolist') }</Text> }
                { (availableUsers.length > 0) &&
                    <AutoGrid columnCount={ 1 } columnMinHeight={ 25 } gap={ 1 }>
                        { availableUsers.map((user, index) =>
                        {
                            return (
                                <LayoutGridItem key={ user.id } itemActive={ (selectedUserId === user.id) } onClick={ event => selectUser(user.id) }>
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
                <Button disabled={ (selectedUserId <= 0) } onClick={ () => submitUser(selectedUserId) }>
                    { LocalizeText('help.emergency.main.submit.button') }
                </Button>
            </Flex>
        </>
    );
};
