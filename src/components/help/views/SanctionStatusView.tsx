import { SanctionStatusEvent, SanctionStatusMessageParser } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../api';
import { Base, Button, Column, Grid } from '../../../common';
import { CreateMessageHook } from '../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../layout';

export const SanctionSatusView:FC<{}> = props =>
{
    const [ sanctionInfo, setSanctionInfo ] = useState<SanctionStatusMessageParser>(null);
    
    const onSanctionStatusEvent = useCallback((event: SanctionStatusEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        setSanctionInfo(parser);
    }, []);
    
    CreateMessageHook(SanctionStatusEvent, onSanctionStatusEvent);

    const sanctionLocalization = useCallback((param: string, sanctionName: string, length?: number) =>
    {
        let localizationName = `help.sanction.${param}`;

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
                    return LocalizeText(localizationName, ['days'], [(length / 24).toString()]);
                }
        }

        return LocalizeText(localizationName, ['hours'], [length.toString()]);
    }, []);
    
    if(!sanctionInfo) return null;
    
    return (
        <NitroCardView className="nitro-help">
            <NitroCardHeaderView headerText={LocalizeText('help.sanction.info.title')} onCloseClick={() => setSanctionInfo(null)} />
            <NitroCardContentView className="text-black">
                <Grid>
                    <Column center size={ 5 } overflow="hidden">
                        <Base className="index-image" />
                    </Column>
                    <Column justifyContent="between" size={ 7 } overflow="hidden">
                        { (sanctionInfo.sanctionReason === 'cfh.reason.EMPTY') 
                            ? <div className="col-12 fw-bold">{LocalizeText('help.sanction.current.none')}</div>
                            : <>
                                {((sanctionInfo.probationHoursLeft > 0) || (sanctionInfo.isSanctionActive)) &&
                                    <div className="col-12 fw-bold">{LocalizeText('help.sanction.probation.reminder')}</div>
                                }
                                <div className={`col-12 fw-bold ${sanctionInfo.isSanctionNew ? 'text-danger' : ''}`}>
                                    {LocalizeText('help.sanction.last.sanction')} {sanctionLocalization('current', sanctionInfo.sanctionName, sanctionInfo.sanctionLengthHours)}
                                </div>
                                <div className="col-12">{LocalizeText('generic.start.time')} {sanctionInfo.sanctionCreationTime}</div>
                                <div className="col-12">{LocalizeText('generic.reason')} {sanctionInfo.sanctionReason}</div>
                                <div className="col-12">{LocalizeText('help.sanction.probation.days.left')} {Math.trunc((sanctionInfo.probationHoursLeft / 24)) + 1}</div>
                            </>
                        }
                        { ((sanctionInfo.hasCustomMute) && (!(sanctionInfo.isSanctionActive))) &&
                        <div className="col-12 fw-bold">{LocalizeText('help.sanction.custom.mute')}</div>
                        }
                        { (sanctionInfo.tradeLockExpiryTime && sanctionInfo.tradeLockExpiryTime.length > 0) &&
                            <div className="col-12 fw-bold">{LocalizeText('trade.locked.until')} {sanctionInfo.tradeLockExpiryTime}</div>
                        }

                        <div className="col-12">{sanctionLocalization('next', sanctionInfo.nextSanctionName, sanctionInfo.nextSanctionLengthHours)}</div>
                        <Button variant="success" onClick={ event => setSanctionInfo(null) }>{LocalizeText('habbo.way.ok.button')}</Button>
                    </Column>
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    )
}
