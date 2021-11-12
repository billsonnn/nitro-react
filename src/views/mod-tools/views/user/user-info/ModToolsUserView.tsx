import { FriendlyTime, GetModeratorUserInfoMessageComposer, ModeratorUserInfoData, ModeratorUserInfoEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../../api';
import { ModToolsOpenUserChatlogEvent } from '../../../../../events/mod-tools/ModToolsOpenUserChatlogEvent';
import { CreateMessageHook, dispatchUiEvent, SendMessageHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroLayoutButton, NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../../layout';
import { ModToolsUserModActionView } from '../user-mod-action/ModToolsUserModActionView';
import { ModToolsUserRoomVisitsView } from '../user-room-visits/ModToolsUserRoomVisitsView';
import { ModToolsSendUserMessageView } from '../user-sendmessage/ModToolsSendUserMessageView';
import { ModToolsUserViewProps } from './ModToolsUserView.types';

export const ModToolsUserView: FC<ModToolsUserViewProps> = props =>
{
    const { onCloseClick = null, userId = null } = props;
    const [ userInfo, setUserInfo ] = useState<ModeratorUserInfoData>(null);
    const [ sendMessageVisible, setSendMessageVisible ] = useState(false);
    const [ modActionVisible, setModActionVisible ] = useState(false);
    const [ roomVisitsVisible, setRoomVisitsVisible ] = useState(false);

    useEffect(() =>
    {
        SendMessageHook(new GetModeratorUserInfoMessageComposer(userId));
    }, [ userId ]);

    const onModtoolUserInfoEvent = useCallback((event: ModeratorUserInfoEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.userId !== userId) return;

        setUserInfo(parser.data);
    }, [setUserInfo, userId]);

    CreateMessageHook(ModeratorUserInfoEvent, onModtoolUserInfoEvent);

    const userProperties = useMemo(() =>
    {
        if(!userInfo) return null;

        return [
            {
                localeKey: 'modtools.userinfo.userName',
                value: userInfo.userName,
                showOnline: true
            },
            {
                localeKey: 'modtools.userinfo.cfhCount',
                value: userInfo.cfhCount.toString()
            },
            {
                localeKey: 'modtools.userinfo.abusiveCfhCount',
                value: userInfo.abusiveCfhCount.toString()
            },
            {
                localeKey: 'modtools.userinfo.cautionCount',
                value: userInfo.cautionCount.toString()
            },
            {
                localeKey: 'modtools.userinfo.banCount',
                value: userInfo.banCount.toString()
            },
            {
                localeKey: 'modtools.userinfo.lastSanctionTime',
                value: userInfo.lastSanctionTime
            },
            {
                localeKey: 'modtools.userinfo.tradingLockCount',
                value: userInfo.tradingLockCount.toString()
            },
            {
                localeKey: 'modtools.userinfo.tradingExpiryDate',
                value: userInfo.tradingExpiryDate
            },
            {
                localeKey: 'modtools.userinfo.minutesSinceLastLogin',
                value: FriendlyTime.format(userInfo.minutesSinceLastLogin * 60, '.ago', 2)
            },
            {
                localeKey: 'modtools.userinfo.lastPurchaseDate',
                value: userInfo.lastPurchaseDate
            },
            {
                localeKey: 'modtools.userinfo.primaryEmailAddress',
                value: userInfo.primaryEmailAddress
            },
            {
                localeKey: 'modtools.userinfo.identityRelatedBanCount',
                value: userInfo.identityRelatedBanCount.toString()
            },
            {
                localeKey: 'modtools.userinfo.registrationAgeInMinutes',
                value: FriendlyTime.format(userInfo.registrationAgeInMinutes * 60, '.ago', 2)
            },
            {
                localeKey: 'modtools.userinfo.userClassification',
                value: userInfo.userClassification
            }
        ];
    }, [ userInfo ]);

    if(!userInfo) return null;

    return (
        <>
            <NitroCardView className="nitro-mod-tools-user" simple={true}>
                <NitroCardHeaderView headerText={ LocalizeText('modtools.userinfo.title', [ 'username' ], [ userInfo.userName ]) } onCloseClick={ () => onCloseClick() } />
                <NitroCardContentView className="text-black">
                    <NitroLayoutGrid>
                        <NitroLayoutGridColumn size={ 8 }>
                            <table className="table table-striped table-sm table-text-small text-black m-0">
                                <tbody>
                                    { userProperties.map( (property, index) =>
                                        {

                                            return (
                                                <tr key={index}>
                                                    <th scope="row">{ LocalizeText(property.localeKey) }</th>
                                                    <td>
                                                        { property.value }
                                                        { property.showOnline && <i className={ `icon icon-pf-${ userInfo.online ? 'online' : 'offline' } ms-2` } /> }
                                                        </td>
                                                </tr>
                                            );
                                        }) }
                                </tbody>
                            </table>
                        </NitroLayoutGridColumn>
                        <NitroLayoutGridColumn size={ 4 }>
                            <NitroLayoutButton variant="primary" size="sm" onClick={ event => dispatchUiEvent(new ModToolsOpenUserChatlogEvent(userId)) }>
                                Room Chat
                            </NitroLayoutButton>
                            <NitroLayoutButton variant="primary" size="sm" onClick={ event => setSendMessageVisible(!sendMessageVisible) }>
                                Send Message
                            </NitroLayoutButton>
                            <NitroLayoutButton variant="primary" size="sm" onClick={ event => setRoomVisitsVisible(!roomVisitsVisible) }>
                                Room Visits
                            </NitroLayoutButton>
                            <NitroLayoutButton variant="primary" size="sm" onClick={ event => setModActionVisible(!modActionVisible) }>
                                Mod Action
                            </NitroLayoutButton>
                        </NitroLayoutGridColumn>
                    </NitroLayoutGrid>
                </NitroCardContentView>
            </NitroCardView>
            { sendMessageVisible &&
                <ModToolsSendUserMessageView user={ { userId: userId, username: userInfo.userName } } onCloseClick={ () => setSendMessageVisible(false) } /> }
            { modActionVisible &&
                <ModToolsUserModActionView user={ { userId: userId, username: userInfo.userName } } onCloseClick={ () => setModActionVisible(false) } /> }
            { roomVisitsVisible &&
                <ModToolsUserRoomVisitsView userId={ userId } onCloseClick={ () => setRoomVisitsVisible(false) } /> }
        </>
    );
}
