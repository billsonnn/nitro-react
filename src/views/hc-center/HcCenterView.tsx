import { ClubGiftInfoEvent, FriendlyTime, GetClubGiftInfo, RequestBadgesComposer, ScrKickbackData, ScrSendKickbackInfoMessageEvent, UserInfoEvent, UserSubscriptionEvent } from '@nitrots/nitro-renderer';
import { BadgesEvent, FigureUpdateEvent } from '@nitrots/nitro-renderer/src';
import { ScrGetKickbackInfoMessageComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/user/ScrGetKickbackInfoMessageComposer';
import { FC, useCallback, useEffect, useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { CreateLinkEvent, GetConfiguration, LocalizeText } from '../../api';
import { HcCenterEvent } from '../../events/hc-center/HcCenterEvent';
import { CreateMessageHook, SendMessageHook, useUiEvent } from '../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { AvatarImageView } from '../shared/avatar-image/AvatarImageView';
import { BadgeImageView } from '../shared/badge-image/BadgeImageView';
import { BadgeResolver } from './util/BadgeResolver';
import { ClubStatus } from './util/ClubStatus';


export const HcCenterView: FC<{}> = props =>
{
    const [isVisible, setIsVisible] = useState(false);
    const [userFigure, setUserFigure] = useState<string>(null);
    const [kickbackData, setKickbackData] = useState<ScrKickbackData>(null);
    const [clubDays, setClubDays] = useState(0);
    const [pastClubDays, setPastClubDays] = useState(0);
    const [clubPeriods, setPastClubPeriods] = useState(0);
    const [minsTillExpire, setMinsTillExpire] = useState(0);
    const [clubStatus, setClubStatus] = useState(ClubStatus.NONE);
    const [unclaimedGifts, setUnclaimedGifts] = useState(0);

    const [badgeCode, setBadgeCode] = useState(BadgeResolver.default_badge);

    const onUserInfoEvent = useCallback((event: UserInfoEvent) =>
    {
        const parser = event.getParser();
        setUserFigure(parser.userInfo.figure);
    }, []);

    const onUserFigureEvent = useCallback((event: FigureUpdateEvent) =>
    {
        const parser = event.getParser();
        setUserFigure(parser.figure);
    }, []);

    CreateMessageHook(UserInfoEvent, onUserInfoEvent);
    CreateMessageHook(FigureUpdateEvent, onUserFigureEvent);

    const onHcCenterEvent = useCallback((event: HcCenterEvent) =>
    {
        switch(event.type)
        {
            case HcCenterEvent.TOGGLE_HC_CENTER:
                setIsVisible(!isVisible);
                break;
        }
    }, [isVisible]);

    useUiEvent(HcCenterEvent.TOGGLE_HC_CENTER, onHcCenterEvent);

    const onClubGiftInfoEvent = useCallback((event: ClubGiftInfoEvent) =>
    {
        const parser = event.getParser();

        setUnclaimedGifts(parser.giftsAvailable);
    }, []);

    const onScrSendKickbackInfo = useCallback((event: ScrSendKickbackInfoMessageEvent) =>
    {
        const parser = event.getParser();

        setKickbackData(parser.data)
    }, []);

    const onBadges = useCallback((event: BadgesEvent) =>
    {
        const parser = event.getParser();

        setBadgeCode(BadgeResolver.getClubBadge(parser.getAllBadgeCodes()));
    }, [])

    CreateMessageHook(ClubGiftInfoEvent, onClubGiftInfoEvent);
    CreateMessageHook(ScrSendKickbackInfoMessageEvent, onScrSendKickbackInfo);
    CreateMessageHook(BadgesEvent, onBadges);

    useEffect(() =>
    {
        SendMessageHook(new GetClubGiftInfo());
        SendMessageHook(new ScrGetKickbackInfoMessageComposer());
        SendMessageHook(new RequestBadgesComposer());
    }, []);

    const onUserSubscriptionEvent = useCallback((event: UserSubscriptionEvent) =>
    {
        const parser = event.getParser();

        const productName = parser.productName;

        if((productName !== 'club_habbo') && (productName !== 'habbo_club')) return;

        setClubDays(Math.max(0, parser.daysToPeriodEnd));
        setPastClubPeriods(Math.max(0, parser.periodsSubscribedAhead));
        setPastClubDays(Math.max(0, parser.pastClubDays));
        setMinsTillExpire(Math.max(0, parser.minutesUntilExpiration));
    }, []);

    useEffect(() =>
    {
        if(clubDays > 0) return setClubStatus(ClubStatus.ACTIVE)
        if(pastClubDays > 0) return setClubStatus(ClubStatus.EXPIRED);

    }, [clubDays, pastClubDays]);

    CreateMessageHook(UserSubscriptionEvent, onUserSubscriptionEvent);

    const getClubText = useCallback(() =>
    {
        const totalDays = ((clubPeriods * 31) + clubDays);
        const minutesUntilExpiration = minsTillExpire;

        if(clubStatus !== ClubStatus.ACTIVE)
        {
            return LocalizeText('purse.clubdays.zero.amount.text');
        }
        else if((minutesUntilExpiration > -1) && (minutesUntilExpiration < (60 * 24)))
        {
            return FriendlyTime.shortFormat(minutesUntilExpiration * 60);
        }
        else
        {
            return FriendlyTime.shortFormat(totalDays * 86400);
        }
    }, [clubStatus, clubDays, clubPeriods, minsTillExpire]);

    const getInfoText = useCallback(() =>
    {
        switch(clubStatus)
        {
            case ClubStatus.ACTIVE:
                return LocalizeText('hccenter.status.' + clubStatus + '.info',
                    ['timeleft', 'joindate', 'streakduration'],
                    [getClubText(), kickbackData.firstSubscriptionDate, FriendlyTime.shortFormat(kickbackData.currentHcStreak * 86400)]);
            case ClubStatus.EXPIRED:
                return LocalizeText('hccenter.status.' + clubStatus + '.info', ['joindate'], [kickbackData.firstSubscriptionDate])
            default:
                return LocalizeText('hccenter.status.' + clubStatus + '.info');
        }
    }, [clubStatus, kickbackData, getClubText]);

    const getHcPaydayTime = useCallback(() =>
    {
        if(kickbackData.timeUntilPayday < 60) return LocalizeText('hccenter.special.time.soon');
        return FriendlyTime.shortFormat(kickbackData.timeUntilPayday * 60);
    }, [kickbackData]);

    const getHcPaydayAmount = useCallback(() =>
    {
        return LocalizeText('hccenter.special.sum', ['credits'], [(kickbackData.creditRewardForStreakBonus + kickbackData.creditRewardForMonthlySpent).toString()])
    }, [kickbackData])

    if(!isVisible) return null;

    const popover = (
        <Popover id="popover-basic">
            <Popover.Body className="text-black py-2 px-3">
                <h5>{LocalizeText('hccenter.breakdown.title')}</h5>
                <div>{LocalizeText('hccenter.breakdown.creditsspent', ['credits'], [kickbackData.totalCreditsSpent.toString()])}</div>
                <div>{LocalizeText('hccenter.breakdown.paydayfactor.percent', ['percent'], [(kickbackData.kickbackPercentage * 100).toString()])}</div>
                <div>{LocalizeText('hccenter.breakdown.streakbonus', ['credits'], [kickbackData.creditRewardForStreakBonus.toString()])}</div>
                <hr className="w-100 text-black my-1" />
                <div>{LocalizeText('hccenter.breakdown.total', ['credits', 'actual'], [getHcPaydayAmount(),
                ((((kickbackData.kickbackPercentage * kickbackData.totalCreditsSpent) + kickbackData.creditRewardForStreakBonus) * 100) / 100).toString()])}</div>
                <div className="btn btn-link text-primary p-0" onClick={() => { CreateLinkEvent('habbopages/' + GetConfiguration('hc.center')['payday.habbopage']) }}>{
                    LocalizeText('hccenter.special.infolink')}
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <NitroCardView simple={true} className="nitro-hc-center">
            <NitroCardHeaderView headerText={LocalizeText('generic.hccenter')} onCloseClick={() => setIsVisible(false)} />
            <div className="bg-muted p-2 position-relative">
                <div className="hc-logo mb-2" />
                <button className="btn btn-success" onClick={ () => { CreateLinkEvent('catalog/open/' + GetConfiguration('hc.center')['catalog.buy']) } }>
                    {LocalizeText(clubStatus === ClubStatus.ACTIVE ? 'hccenter.btn.extend' : 'hccenter.btn.buy')}
                </button>
                <div className="position-absolute end-0 p-4 top-0 habbo-avatar">
                    <AvatarImageView figure={userFigure} direction={4} scale={2} />
                </div>
            </div>
            <NitroCardContentView>
                <div className="d-flex flex-row mb-1">
                    <BadgeImageView badgeCode={badgeCode} className="align-self-center flex-shrink-0 me-1" />
                    <div className="w-100 text-black streak-info">
                        <h6 className="mb-0">{LocalizeText('hccenter.status.' + clubStatus)}</h6>
                        <div dangerouslySetInnerHTML={{ __html: getInfoText() }} />
                    </div>
                </div>
                {GetConfiguration('hc.center')['payday.info'] &&
                    <div className="d-flex flex-row align-items-center mb-n2">
                        <div className="rounded-start bg-primary p-2 payday-special mb-1 d-flex flex-column">
                            <h4 className="mb-1">{LocalizeText('hccenter.special.title')}</h4>
                            <div>{LocalizeText('hccenter.special.info')}</div>
                            <div className="btn btn-link text-white p-0 mt-auto align-self-baseline" onClick={() => { CreateLinkEvent('habbopages/' + GetConfiguration('hc.center')['payday.habbopage']) }}>{LocalizeText('hccenter.special.infolink')}</div>
                        </div>
                        <div className="payday flex-shrink-0 p-2">
                            <h5 className="mb-2 ms-2">{LocalizeText('hccenter.special.time.title')}</h5>
                            <div className="d-flex flex-row mb-2">
                                <div className="clock me-2" />
                                <h6 className="mb-0 align-self-center">{getHcPaydayTime()}</h6>
                            </div>
                            {clubStatus === ClubStatus.ACTIVE &&
                                <div className="pe-3">
                                    <h5 className="ms-2 mb-1 bolder">{LocalizeText('hccenter.special.amount.title')}</h5>
                                    <div className="d-flex flex-column">
                                        <div className="w-100 text-center ms-4n">{getHcPaydayAmount()}</div>
                                        <OverlayTrigger trigger="hover" placement="left" overlay={popover}>
                                            <div className="btn btn-link align-self-end text-primary">
                                                {LocalizeText('hccenter.breakdown.infolink')}
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }
                {GetConfiguration('hc.center')['gift.info'] &&
                    <div className="rounded bg-success p-2 d-flex flex-row mb-0">
                        <div>
                            <h4 className="mb-1">{LocalizeText('hccenter.gift.title')}</h4>
                            <div dangerouslySetInnerHTML={{ __html: unclaimedGifts > 0 ? LocalizeText('hccenter.unclaimedgifts', ['unclaimedgifts'], [unclaimedGifts.toString()]) : LocalizeText('hccenter.gift.info') }}></div>
                        </div>
                        <button className="btn btn-primary btn-lg align-self-center ms-auto" onClick={() => { CreateLinkEvent('catalog/open/' + GetConfiguration('hc.center')['catalog.gifts']) }}>{LocalizeText(clubStatus === ClubStatus.ACTIVE ? 'hccenter.btn.gifts.redeem' : 'hccenter.btn.gifts.view')}</button>
                    </div>
                }
                {GetConfiguration('hc.center')['benefits.info'] &&
                    <div className="benefits text-black py-2">
                        <h5 className="mb-1 text-primary">{LocalizeText('hccenter.general.title')}</h5>
                        <div className="mb-2" dangerouslySetInnerHTML={{ __html: LocalizeText('hccenter.general.info') }} />
                        <button className="btn btn-link p-0 text-primary" onClick={() => { CreateLinkEvent('habbopages/' + GetConfiguration('hc.center')['benefits.habbopage']) }}>{LocalizeText('hccenter.general.infolink')}</button>
                    </div>
                }
            </NitroCardContentView>
        </NitroCardView>
    );
}
