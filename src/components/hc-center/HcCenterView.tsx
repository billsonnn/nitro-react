import { AddLinkEventTracker, ClubGiftInfoEvent, CreateLinkEvent, GetClubGiftInfo, ILinkEventTracker, RemoveLinkEventTracker, ScrGetKickbackInfoMessageComposer, ScrKickbackData, ScrSendKickbackInfoMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { ClubStatus, FriendlyTime, GetClubBadge, GetConfigurationValue, LocalizeText, SendMessageComposer } from '../../api';
import { Button, Column, Flex, LayoutAvatarImageView, LayoutBadgeImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { useInventoryBadges, useMessageEvent, usePurse, useSessionInfo } from '../../hooks';


export const HcCenterView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ kickbackData, setKickbackData ] = useState<ScrKickbackData>(null);
    const [ unclaimedGifts, setUnclaimedGifts ] = useState(0);
    const [ badgeCode, setBadgeCode ] = useState(null);
    const { userFigure = null } = useSessionInfo();
    const { purse = null, clubStatus = null } = usePurse();
    const { badgeCodes = [], activate = null, deactivate = null } = useInventoryBadges();

    const getClubText = () =>
    {
        if(purse.clubDays <= 0) return LocalizeText('purse.clubdays.zero.amount.text');

        if((purse.minutesUntilExpiration > -1) && (purse.minutesUntilExpiration < (60 * 24)))
        {
            return FriendlyTime.shortFormat(purse.minutesUntilExpiration * 60);
        }

        return FriendlyTime.shortFormat(((purse.clubPeriods * 31) + purse.clubDays) * 86400);
    };

    const getInfoText = () =>
    {
        switch(clubStatus)
        {
            case ClubStatus.ACTIVE:
                return LocalizeText(`hccenter.status.${ clubStatus }.info`, [ 'timeleft', 'joindate', 'streakduration' ], [ getClubText(), kickbackData?.firstSubscriptionDate, FriendlyTime.shortFormat(kickbackData?.currentHcStreak * 86400) ]);
            case ClubStatus.EXPIRED:
                return LocalizeText(`hccenter.status.${ clubStatus }.info`, [ 'joindate' ], [ kickbackData?.firstSubscriptionDate ]);
            default:
                return LocalizeText(`hccenter.status.${ clubStatus }.info`);
        }
    };

    const getHcPaydayTime = () => (!kickbackData || kickbackData.timeUntilPayday < 60) ? LocalizeText('hccenter.special.time.soon') : FriendlyTime.shortFormat(kickbackData.timeUntilPayday * 60);
    const getHcPaydayAmount = () => LocalizeText('hccenter.special.sum', [ 'credits' ], [ (kickbackData?.creditRewardForStreakBonus + kickbackData?.creditRewardForMonthlySpent).toString() ]);

    useMessageEvent<ClubGiftInfoEvent>(ClubGiftInfoEvent, event =>
    {
        const parser = event.getParser();

        setUnclaimedGifts(parser.giftsAvailable);
    });

    useMessageEvent<ScrSendKickbackInfoMessageEvent>(ScrSendKickbackInfoMessageEvent, event =>
    {
        const parser = event.getParser();

        setKickbackData(parser.data);
    });

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
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
            },
            eventUrlPrefix: 'habboUI/'
        };

        AddLinkEventTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    useEffect(() =>
    {
        setBadgeCode(GetClubBadge(badgeCodes));
    }, [ badgeCodes ]);

    useEffect(() =>
    {
        if(!isVisible) return;

        const id = activate();

        return () => deactivate(id);
    }, [ isVisible, activate, deactivate ]);

    useEffect(() =>
    {
        SendMessageComposer(new GetClubGiftInfo());
        SendMessageComposer(new ScrGetKickbackInfoMessageComposer());
    }, []);

    if(!isVisible) return null;

    const popover = (
        <>
            <h5>{ LocalizeText('hccenter.breakdown.title') }</h5>
            <div>{ LocalizeText('hccenter.breakdown.creditsspent', [ 'credits' ], [ kickbackData?.totalCreditsSpent.toString() ]) }</div>
            <div>{ LocalizeText('hccenter.breakdown.paydayfactor.percent', [ 'percent' ], [ (kickbackData?.kickbackPercentage * 100).toString() ]) }</div>
            <div>{ LocalizeText('hccenter.breakdown.streakbonus', [ 'credits' ], [ kickbackData?.creditRewardForStreakBonus.toString() ]) }</div>
            <hr className="w-full text-black my-1" />
            <div>{ LocalizeText('hccenter.breakdown.total', [ 'credits', 'actual' ], [ getHcPaydayAmount(), ((((kickbackData?.kickbackPercentage * kickbackData?.totalCreditsSpent) + kickbackData?.creditRewardForStreakBonus) * 100) / 100).toString() ]) }</div>
            <div className="btn btn-link text-primary p-0" onClick={ () => CreateLinkEvent('habbopages/' + GetConfigurationValue('hc.center')['payday.habbopage']) }>
                { LocalizeText('hccenter.special.infolink') }
            </div>
        </>
    );

    return (
        <NitroCardView className="nitro-hc-center" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('generic.hccenter') } onCloseClick={ () => setIsVisible(false) } />
            <Flex className="bg-muted p-2" position="relative">
                <div className="flex flex-col gap-1">
                    <div className="hc-logo" />
                    <Flex>
                        <Button variant="success" onClick={ event => CreateLinkEvent('catalog/open/' + GetConfigurationValue('catalog.links')['hc.buy_hc']) }>
                            { LocalizeText((clubStatus === ClubStatus.ACTIVE) ? 'hccenter.btn.extend' : 'hccenter.btn.buy') }
                        </Button>
                    </Flex>
                </div>
                <div className="end-0 p-4 top-0 habbo-avatar absolute">
                    <LayoutAvatarImageView direction={ 4 } figure={ userFigure } scale={ 2 } />
                </div>
            </Flex>
            <NitroCardContentView>
                <div className="flex gap-2">
                    <LayoutBadgeImageView badgeCode={ badgeCode } className="align-self-center flex-shrink-0 me-1" />
                    <Column className="streak-info" gap={ 0 } size={ 5 }>
                        <Text>{ LocalizeText('hccenter.status.' + clubStatus) }</Text>
                        <Text dangerouslySetInnerHTML={ { __html: getInfoText() } } />
                    </Column>
                </div>
                { GetConfigurationValue('hc.center')['payday.info'] &&
                    <Flex alignItems="center">

                        <Column className="rounded-start bg-primary p-2 payday-special mb-1">
                            <h4 className="mb-1">{ LocalizeText('hccenter.special.title') }</h4>
                            <div>{ LocalizeText('hccenter.special.info') }</div>
                            <div className="btn btn-link text-white p-0 mt-auto align-self-baseline" onClick={ () => CreateLinkEvent('habbopages/' + GetConfigurationValue('hc.center')['payday.habbopage']) }>{ LocalizeText('hccenter.special.infolink') }</div>
                        </Column>
                        <div className="payday flex-shrink-0 p-2">
                            <h5 className="mb-2 ms-2">{ LocalizeText('hccenter.special.time.title') }</h5>
                            <div className="flex flex-row mb-2">
                                <div className="clock me-2" />
                                <h6 className="mb-0 align-self-center">{ getHcPaydayTime() }</h6>
                            </div>
                            { clubStatus === ClubStatus.ACTIVE &&
                                <div className="pe-3">
                                    <h5 className="ms-2 mb-1 bolder">{ LocalizeText('hccenter.special.amount.title') }</h5>
                                    <div className="flex flex-col">
                                        <div className="w-full text-center ms-4n">{ getHcPaydayAmount() }</div>
                                        <div className="btn btn-link align-self-end text-primary">
                                            { LocalizeText('hccenter.breakdown.infolink') }
                                        </div>
                                    </div>
                                </div> }
                        </div>
                    </Flex> }
                { GetConfigurationValue('hc.center')['gift.info'] &&
                    <div className="rounded bg-success p-2 flex flex-row mb-0">
                        <div>
                            <h4 className="mb-1">{ LocalizeText('hccenter.gift.title') }</h4>
                            <div dangerouslySetInnerHTML={ { __html: unclaimedGifts > 0 ? LocalizeText('hccenter.unclaimedgifts', [ 'unclaimedgifts' ], [ unclaimedGifts.toString() ]) : LocalizeText('hccenter.gift.info') } }></div>
                        </div>
                        <button className="btn btn-primary btn-lg align-self-center ms-auto" onClick={ () => CreateLinkEvent('catalog/open/' + GetConfigurationValue('catalog.links')['hc.hc_gifts']) }>
                            { LocalizeText(clubStatus === ClubStatus.ACTIVE ? 'hccenter.btn.gifts.redeem' : 'hccenter.btn.gifts.view') }
                        </button>
                    </div> }
                { GetConfigurationValue('hc.center')['benefits.info'] &&
                    <div className="benefits text-black py-2">
                        <h5 className="mb-1 text-primary">{ LocalizeText('hccenter.general.title') }</h5>
                        <div className="mb-2" dangerouslySetInnerHTML={ { __html: LocalizeText('hccenter.general.info') } } />
                        <button className="btn btn-link p-0 text-primary" onClick={ () => CreateLinkEvent('habbopages/' + GetConfigurationValue('hc.center')['benefits.habbopage']) }>
                            { LocalizeText('hccenter.general.infolink') }
                        </button>
                    </div> }
            </NitroCardContentView>
        </NitroCardView>
    );
};
