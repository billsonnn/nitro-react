import { BadgesEvent, ClubGiftInfoEvent, FigureUpdateEvent, FriendlyTime, GetClubGiftInfo, ILinkEventTracker, RequestBadgesComposer, ScrGetKickbackInfoMessageComposer, ScrKickbackData, ScrSendKickbackInfoMessageEvent, UserInfoEvent, UserSubscriptionEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { AddEventLinkTracker, CreateLinkEvent, GetConfiguration, LocalizeText, RemoveLinkEventTracker, SendMessageComposer } from '../../api';
import { Base, Button, Column, Flex, LayoutAvatarImageView, LayoutBadgeImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { HcCenterEvent } from '../../events';
import { UseMessageEventHook, UseUiEvent } from '../../hooks';
import { BadgeResolver } from './common/BadgeResolver';
import { ClubStatus } from './common/ClubStatus';


export const HcCenterView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ userFigure, setUserFigure ] = useState<string>(null);
    const [ kickbackData, setKickbackData ] = useState<ScrKickbackData>(null);
    const [ clubDays, setClubDays ] = useState(0);
    const [ pastClubDays, setPastClubDays ] = useState(0);
    const [ clubPeriods, setPastClubPeriods ] = useState(0);
    const [ minsTillExpire, setMinsTillExpire ] = useState(0);
    const [ clubStatus, setClubStatus ] = useState(ClubStatus.NONE);
    const [ unclaimedGifts, setUnclaimedGifts ] = useState(0);
    const [ badgeCode, setBadgeCode ] = useState(BadgeResolver.default_badge);

    const getClubText = () =>
    {
        const totalDays = ((clubPeriods * 31) + clubDays);
        const minutesUntilExpiration = minsTillExpire;

        if(clubStatus !== ClubStatus.ACTIVE)
        {
            return LocalizeText('purse.clubdays.zero.amount.text');
        }
        
        if((minutesUntilExpiration > -1) && (minutesUntilExpiration < (60 * 24)))
        {
            return FriendlyTime.shortFormat(minutesUntilExpiration * 60);
        }
        
        return FriendlyTime.shortFormat(totalDays * 86400);
    }

    const getInfoText = () =>
    {
        switch(clubStatus)
        {
            case ClubStatus.ACTIVE:
                return LocalizeText(`hccenter.status.${ clubStatus }.info`, [ 'timeleft', 'joindate', 'streakduration' ], [ getClubText(), kickbackData.firstSubscriptionDate, FriendlyTime.shortFormat(kickbackData.currentHcStreak * 86400) ]);
            case ClubStatus.EXPIRED:
                return LocalizeText(`hccenter.status.${ clubStatus }.info`, [ 'joindate' ], [ kickbackData.firstSubscriptionDate ]);
            default:
                return LocalizeText(`hccenter.status.${ clubStatus }.info`);
        }
    }

    const getHcPaydayTime = () =>
    {
        if(kickbackData.timeUntilPayday < 60) return LocalizeText('hccenter.special.time.soon');
        return FriendlyTime.shortFormat(kickbackData.timeUntilPayday * 60);
    }

    const getHcPaydayAmount = () =>
    {
        return LocalizeText('hccenter.special.sum', [ 'credits' ], [ (kickbackData.creditRewardForStreakBonus + kickbackData.creditRewardForMonthlySpent).toString() ]);
    }

    const onUserInfoEvent = useCallback((event: UserInfoEvent) =>
    {
        const parser = event.getParser();

        setUserFigure(parser.userInfo.figure);
    }, []);

    UseMessageEventHook(UserInfoEvent, onUserInfoEvent);

    const onUserFigureEvent = useCallback((event: FigureUpdateEvent) =>
    {
        const parser = event.getParser();

        setUserFigure(parser.figure);
    }, []);

    UseMessageEventHook(FigureUpdateEvent, onUserFigureEvent);

    const onHcCenterEvent = useCallback((event: HcCenterEvent) =>
    {
        switch(event.type)
        {
            case HcCenterEvent.TOGGLE_HC_CENTER:
                setIsVisible(!isVisible);
                break;
        }
    }, [isVisible]);

    UseUiEvent(HcCenterEvent.TOGGLE_HC_CENTER, onHcCenterEvent);

    const onClubGiftInfoEvent = useCallback((event: ClubGiftInfoEvent) =>
    {
        const parser = event.getParser();

        setUnclaimedGifts(parser.giftsAvailable);
    }, []);

    UseMessageEventHook(ClubGiftInfoEvent, onClubGiftInfoEvent);

    const onScrSendKickbackInfo = useCallback((event: ScrSendKickbackInfoMessageEvent) =>
    {
        const parser = event.getParser();

        setKickbackData(parser.data);
    }, []);

    UseMessageEventHook(ScrSendKickbackInfoMessageEvent, onScrSendKickbackInfo);

    const onBadges = useCallback((event: BadgesEvent) =>
    {
        const parser = event.getParser();

        setBadgeCode(BadgeResolver.getClubBadge(parser.getAllBadgeCodes()));
    }, []);

    UseMessageEventHook(BadgesEvent, onBadges);

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

    UseMessageEventHook(UserSubscriptionEvent, onUserSubscriptionEvent);

    const linkReceived = useCallback((url: string) =>
    {
        const parts = url.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'open':
                if(parts.length > 2)
                {
                    switch(parts[2])
                    {
                        case 'hccenter':
                            setIsVisible(true);
                            break;
                    }
                }
                return;
        } 
    }, []);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived,
            eventUrlPrefix: 'habboUI/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ linkReceived]);

    useEffect(() =>
    {
        if(clubDays > 0)
        {
            setClubStatus(ClubStatus.ACTIVE);

            return;
        }

        if(pastClubDays > 0)
        {
            setClubStatus(ClubStatus.EXPIRED);

            return;
        }
    }, [ clubDays, pastClubDays ]);

    useEffect(() =>
    {
        SendMessageComposer(new GetClubGiftInfo());
        SendMessageComposer(new ScrGetKickbackInfoMessageComposer());
        SendMessageComposer(new RequestBadgesComposer());
    }, []);

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
        <NitroCardView theme="primary-slim" className="nitro-hc-center">
            <NitroCardHeaderView headerText={ LocalizeText('generic.hccenter') } onCloseClick={ () => setIsVisible(false) } />
            <Flex position="relative" className="bg-muted p-2">
                <Column gap={ 1 }>
                    <div className="hc-logo" />
                    <Flex>
                        <Button variant="success" onClick={ event => { CreateLinkEvent('catalog/open/' + GetConfiguration('hc.center')['catalog.buy']) } }>
                            { LocalizeText((clubStatus === ClubStatus.ACTIVE) ? 'hccenter.btn.extend' : 'hccenter.btn.buy') }
                        </Button>
                    </Flex>
                </Column>
                <Base position="absolute" className="end-0 p-4 top-0 habbo-avatar">
                    <LayoutAvatarImageView figure={ userFigure } direction={ 4 } scale={ 2 } />
                </Base>
            </Flex>
            <NitroCardContentView>
                <Flex gap={ 2 }>
                    <LayoutBadgeImageView badgeCode={badgeCode} className="align-self-center flex-shrink-0 me-1" />
                    <Column size={ 5 } className="streak-info" gap={ 0 }>
                        <Text>{ LocalizeText('hccenter.status.' + clubStatus) }</Text>
                        <Text dangerouslySetInnerHTML={{ __html: getInfoText() }} />
                    </Column>
                </Flex>
                { GetConfiguration('hc.center')['payday.info'] &&
                    <Flex alignItems="center">
                        <Column className="rounded-start bg-primary p-2 payday-special mb-1">
                            <h4 className="mb-1">{LocalizeText('hccenter.special.title')}</h4>
                            <div>{LocalizeText('hccenter.special.info')}</div>
                            <div className="btn btn-link text-white p-0 mt-auto align-self-baseline" onClick={() => { CreateLinkEvent('habbopages/' + GetConfiguration('hc.center')['payday.habbopage']) }}>{LocalizeText('hccenter.special.infolink')}</div>
                        </Column>
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
                    </Flex>
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
