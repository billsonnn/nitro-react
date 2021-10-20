import { FriendlyTime, ModeratorUserInfoData, ModtoolRequestUserInfoComposer, ModtoolUserInfoEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { ModToolsOpenUserChatlogEvent } from '../../../../../events/mod-tools/ModToolsOpenUserChatlogEvent';
import { CreateMessageHook, dispatchUiEvent, SendMessageHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { AvatarImageView } from '../../../../shared/avatar-image/AvatarImageView';
import { IUserInfo } from '../../../utils/IUserInfo';
import { ModToolsUserViewProps } from './ModToolsUserView.types';


export const ModToolsUserView: FC<ModToolsUserViewProps> = props =>
{
    const { onCloseClick = null, userId = null, simple = true } = props;
    const [userInfo, setUserInfo] = useState<ModeratorUserInfoData>(null);

    useEffect(() =>
    {
        SendMessageHook(new ModtoolRequestUserInfoComposer(userId));
    }, [userId]);


    const onModtoolUserInfoEvent = useCallback((event: ModtoolUserInfoEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.userId !== userId) return;

        setUserInfo(parser.data);
    }, [setUserInfo, userId]);

    CreateMessageHook(ModtoolUserInfoEvent, onModtoolUserInfoEvent);

    const OnlineIcon = useCallback(() => 
    {
        if(userInfo.online) return (<i className="icon icon-pf-online ml-1" />);
        else return (<i className="icon icon-pf-offline ml-1" />);
    }, [userInfo]);

    const userProperties = useCallback(() =>
    {
        let properties: IUserInfo[] = [];

        if(!userInfo) return properties;

        properties = [
            {
                nameKey: 'name',
                nameKeyFallback: 'Name',
                value: userInfo.userName
            },
            {
                nameKey: 'cfhs',
                nameKeyFallback: 'CFHs',
                value: userInfo.cfhCount.toString()
            },
            {
                nameKey: 'abusive_cfhs',
                nameKeyFallback: 'Abusive CFHs',
                value: userInfo.abusiveCfhCount.toString()
            },
            {
                nameKey: 'cautions',
                nameKeyFallback: 'Cautions',
                value: userInfo.cautionCount.toString()
            },
            {
                nameKey: 'bans',
                nameKeyFallback: 'Bans',
                value: userInfo.banCount.toString()
            },
            {
                nameKey: 'last_sanction',
                nameKeyFallback: 'Last sanction',
                value: userInfo.lastSanctionTime
            },
            {
                nameKey: 'trade_locks',
                nameKeyFallback: 'Trade locks',
                value: userInfo.tradingLockCount.toString()
            },
            {
                nameKey: 'lock_expires',
                nameKeyFallback: 'Lock expires',
                value: userInfo.tradingExpiryDate
            },
            {
                nameKey: 'last_login',
                nameKeyFallback: 'Last login',
                value: FriendlyTime.format(userInfo.minutesSinceLastLogin * 60, '.ago', 2)
            },
            {
                nameKey: 'purchase',
                nameKeyFallback: 'Purchases',
                value: userInfo.lastPurchaseDate
            },
            {
                nameKey: 'email',
                nameKeyFallback: 'Email',
                value: userInfo.primaryEmailAddress
            },
            {
                nameKey: 'acc_bans',
                nameKeyFallback: 'Banned Accs.',
                value: userInfo.identityRelatedBanCount.toString()
            },
            {
                nameKey: 'registered',
                nameKeyFallback: 'Registered',
                value: FriendlyTime.format(userInfo.registrationAgeInMinutes * 60, '.ago', 2)
            },
            {
                nameKey: 'rank',
                nameKeyFallback: 'Rank',
                value: userInfo.userClassification
            }
        ];

        return properties;

    }, [userInfo]);

    return (
        <NitroCardView className="nitro-mod-tools-user" simple={true}>
            <NitroCardHeaderView headerText={'User Info: ' + (userInfo ? userInfo.userName : '')} onCloseClick={() => onCloseClick()} />
            <NitroCardContentView className="text-black">
                {userInfo &&
                    <div className="row">
                        {!simple &&
                            <div className="col-sm-3 px-0 d-flex align-items-center">
                                <AvatarImageView figure={userInfo.figure} direction={2} />
                            </div>
                        }
                        <div className="col-7">
                            <table className="d-flex flex-column table table-striped table-sm table-text-small text-black">
                                <tbody>
                                    {userProperties().map(property =>
                                    {
                                        return (
                                            <tr key={property.nameKey}>
                                                <th scope="row">{property.nameKeyFallback}</th>
                                                <td className={'' + (property.nameKey === 'name' ? 'username' : '')}>
                                                    {property.value} {(property.nameKey === 'name') && <OnlineIcon/>}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-5">
                            <button className="btn btn-sm btn-primary" onClick={() => dispatchUiEvent(new ModToolsOpenUserChatlogEvent(userId))}>Room Chat</button>
                            <button className="btn btn-sm btn-primary mt-2">Send Message</button>
                            <button className="btn btn-sm btn-primary mt-2">Room Visits</button>
                            <button className="btn btn-sm btn-primary mt-2">Mod Action</button>
                        </div>
                    </div>
                }
            </NitroCardContentView>
        </NitroCardView>
    );
}
