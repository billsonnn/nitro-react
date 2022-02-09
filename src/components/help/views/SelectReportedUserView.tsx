import { RoomObjectType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../api';
import { Base } from '../../../common/Base';
import { Button } from '../../../common/Button';
import { Column } from '../../../common/Column';
import { Flex } from '../../../common/Flex';
import { Grid } from '../../../common/Grid';
import { LayoutGridItem } from '../../../common/layout/LayoutGridItem';
import { Text } from '../../../common/Text';
import { GetChatHistory } from '../../../views/chat-history/common/GetChatHistory';
import { ChatEntryType } from '../../../views/chat-history/context/ChatHistoryContext.types';
import { IReportedUser } from '../common/IReportedUser';
import { useHelpContext } from '../HelpContext';

export const SelectReportedUserView: FC<{}> = props =>
{
    const [ selectedUserId, setSelectedUserId ] = useState(-1);
    const { helpReportState = null, setHelpReportState = null } = useHelpContext();

    const availableUsers = useMemo(() =>
    {
        const users: Map<number, IReportedUser> = new Map();

        GetChatHistory().chats
            .forEach(chat =>
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

    const submitUser = useCallback(() =>
    {
        if(selectedUserId <= 0) return;

        const reportState = Object.assign({}, helpReportState);
        reportState.reportedUserId = selectedUserId;
        reportState.currentStep = 2;
        setHelpReportState(reportState);
    }, [helpReportState, selectedUserId, setHelpReportState]);

    const selectUser = useCallback((userId: number) =>
    {
        if(selectedUserId === userId) setSelectedUserId(-1);
        else setSelectedUserId(userId);
    }, [selectedUserId]);

    const back = useCallback(() =>
    {
        const reportState = Object.assign({}, helpReportState);
        reportState.currentStep = --reportState.currentStep;
        setHelpReportState(reportState);
    }, [helpReportState, setHelpReportState]);

    return (
        <Grid>
            <Column center size={ 5 } overflow="hidden">
                <Base className="index-image" />
            </Column>
            <Column justifyContent="center" size={ 7 } overflow="hidden">
                <Column gap={ 1 }>
                    <Text fontSize={ 3 }>{ LocalizeText('help.emergency.main.step.two.title') }</Text>
                    { (availableUsers.length > 0) &&
                        <Text>{ LocalizeText('report.user.pick.user') }</Text> }
                </Column>
                <Column gap={ 1 }>
                    { !!!availableUsers.length &&
                        <Text>{ LocalizeText('report.user.error.nolist') }</Text> }
                    { (availableUsers.length > 0) &&
                        <Grid grow columnCount={ 1 } gap={ 1 } overflow="auto">
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
            </Column>
        </Grid>
    )
}
