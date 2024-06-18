import { FC } from 'react';
import { LocalizeText } from '../../../api';
import { Button, Column, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../common';
import { useHelp } from '../../../hooks';

export const SanctionSatusView: FC<{}> = props =>
{
    const { sanctionInfo = null, setSanctionInfo = null } = useHelp();

    const sanctionLocalization = (param: string, sanctionName: string, length?: number) =>
    {
        let localizationName = `help.sanction.${ param }`;

        switch(sanctionName)
        {
            case 'ALERT':
                localizationName = (localizationName + '.alert');
                break;
            case 'MUTE':
                localizationName = (localizationName + '.mute');
                break;
            case 'BAN_PERMANENT':
                localizationName = (localizationName + '.permban');
                break;
            default:
                localizationName = (localizationName + '.ban');
                if(length > 24)
                {
                    localizationName = (localizationName + '.days');
                    return LocalizeText(localizationName, [ 'days' ], [ (length / 24).toString() ]);
                }
        }

        return LocalizeText(localizationName, [ 'hours' ], [ length.toString() ]);
    };

    if(!sanctionInfo) return null;

    return (
        <NitroCardView className="nitro-help" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('help.sanction.info.title') } onCloseClick={ () => setSanctionInfo(null) } />
            <NitroCardContentView className="text-black">
                <Grid>
                    <Column center overflow="hidden" size={ 5 }>
                        <div className="index-image" />
                    </Column>
                    <Column justifyContent="between" overflow="hidden" size={ 7 }>
                        { (sanctionInfo.sanctionReason === 'cfh.reason.EMPTY')
                            ? <div className="col-span-12 font-bold	">{ LocalizeText('help.sanction.current.none') }</div>
                            : <>
                                { ((sanctionInfo.probationHoursLeft > 0) || (sanctionInfo.isSanctionActive)) &&
                                    <div className="col-span-12 font-bold	">{ LocalizeText('help.sanction.probation.reminder') }</div>
                                }
                                <div className={ `col-span-12 font-bold	 ${ sanctionInfo.isSanctionNew ? 'text-danger' : '' }` }>
                                    { LocalizeText('help.sanction.last.sanction') } { sanctionLocalization('current', sanctionInfo.sanctionName, sanctionInfo.sanctionLengthHours) }
                                </div>
                                <div className="col-span-12">{ LocalizeText('generic.start.time') } { sanctionInfo.sanctionCreationTime }</div>
                                <div className="col-span-12">{ LocalizeText('generic.reason') } { sanctionInfo.sanctionReason }</div>
                                <div className="col-span-12">{ LocalizeText('help.sanction.probation.days.left') } { Math.trunc((sanctionInfo.probationHoursLeft / 24)) + 1 }</div>
                            </>
                        }
                        { ((sanctionInfo.hasCustomMute) && (!(sanctionInfo.isSanctionActive))) &&
                            <div className="col-span-12 font-bold	">{ LocalizeText('help.sanction.custom.mute') }</div>
                        }
                        { (sanctionInfo.tradeLockExpiryTime && sanctionInfo.tradeLockExpiryTime.length > 0) &&
                            <div className="col-span-12 font-bold	">{ LocalizeText('trade.locked.until') } { sanctionInfo.tradeLockExpiryTime }</div>
                        }
                        <div className="col-span-12">{ sanctionLocalization('next', sanctionInfo.nextSanctionName, sanctionInfo.nextSanctionLengthHours) }</div>
                        <Button variant="success" onClick={ event => setSanctionInfo(null) }>{ LocalizeText('habbo.way.ok.button') }</Button>
                    </Column>
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    );
};
