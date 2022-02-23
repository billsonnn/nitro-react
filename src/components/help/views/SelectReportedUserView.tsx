import { RoomObjectType } from '@nitrots/nitro-renderer';
import { FC, useMemo, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../api';
import { Button, Column, Flex, Grid, LayoutGridItem, Text } from '../../../common';
import { ChatEntryType } from '../../chat-history/common/ChatEntryType';
import { GetChatHistory } from '../../chat-history/common/GetChatHistory';
import { IReportedUser } from '../common/IReportedUser';
import { useHelpContext } from '../HelpContext';

export const SelectReportedUserView: FC<{}> = props =>
{
    const [ selectedUserId, setSelectedUserId ] = useState(-1);
    const { helpReportState = null, setHelpReportState = null } = useHelpContext();

    const availableUsers = useMemo(() =>
    {
        const users: Map<number, IReportedUser> = new Map();

        GetChatHistory().chats.forEach(chat =>
            {
                if((chat.type === ChatEntryType.TYPE_CHAT) && (chat.entityType === RoomObjectType.USER) && (chat.entityId !== GetSessionDataManager().userId))
                {
                    if(!users.has(chat.entityId))
                    {
                        users.set(chat.entityId, { id: chat.entityId, username: chat.name })
                    }
                }
            });

        return Array.from(users.values());
    }, []);

    const submitUser = () =>
    {
        if(selectedUserId <= 0) return;

        setHelpReportState(prevValue =>
            {
                const reportedUserId = selectedUserId;
                const currentStep = 2;

                return { ...prevValue, reportedUserId, currentStep };
            });
    }

    const selectUser = (userId: number) =>
    {
        if(selectedUserId === userId) setSelectedUserId(-1);
        else setSelectedUserId(userId);
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
                <Text fontSize={ 3 }>{ LocalizeText('help.emergency.main.step.two.title') }</Text>
                { (availableUsers.length > 0) &&
                    <Text>{ LocalizeText('report.user.pick.user') }</Text> }
            </Column>
            <Column gap={ 1 }>
                { !!!availableUsers.length &&
                    <Text>{ LocalizeText('report.user.error.nolist') }</Text> }
                { (availableUsers.length > 0) &&
                    <Grid gap={ 1 } columnCount={ 1 } overflow="auto">
                        { availableUsers.map((user, index) =>
                            {
                                return (
                                    <LayoutGridItem key={ user.id } onClick={ event => selectUser(user.id) } itemActive={ (selectedUserId === user.id) }>
                                        <span dangerouslySetInnerHTML={{ __html: (user.username) }} />
                                    </LayoutGridItem>
                                );
                            }) }
                    </Grid> }
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
