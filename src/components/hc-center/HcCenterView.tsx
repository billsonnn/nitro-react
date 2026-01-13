import { FriendlyTime, ILinkEventTracker, ScrGetKickbackInfoMessageComposer, ScrKickbackData, ScrSendKickbackInfoMessageEvent } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { AddEventLinkTracker, ClubStatus, CreateLinkEvent, GetConfiguration, LocalizeText, RemoveLinkEventTracker, SendMessageComposer } from "../../api"
import { Button, LayoutAvatarImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../common"
import { useInventoryBadges, useMessageEvent, usePurse, useSessionInfo } from "../../hooks"

export const HcCenterView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false)
    const [ kickbackData, setKickbackData ] = useState<ScrKickbackData>(null)
    const { userFigure = null } = useSessionInfo()
    const { purse = null, clubStatus = null } = usePurse()
    const { activate = null, deactivate = null } = useInventoryBadges()

    const hotelName: string = GetConfiguration<string>("illumina.hotel.name")

    const getClubText = () =>
    {
        if(purse.clubDays <= 0) return LocalizeText("purse.clubdays.zero.amount.text")

        if((purse.minutesUntilExpiration > -1) && (purse.minutesUntilExpiration < (60 * 24)))
        {
            return FriendlyTime.shortFormat(purse.minutesUntilExpiration * 60)
        }

        return FriendlyTime.shortFormat(((purse.clubPeriods * 31) + purse.clubDays) * 86400)
    }

    const getInfoText = () =>
    {
        switch(clubStatus)
        {
        case ClubStatus.ACTIVE:
            return LocalizeText(`hccenter.status.${ clubStatus }.info`, [ "timeleft", "joindate", "streakduration" ], [ getClubText(), kickbackData?.firstSubscriptionDate, FriendlyTime.shortFormat(kickbackData?.currentHcStreak * 86400) ])
        case ClubStatus.EXPIRED:
            return LocalizeText(`hccenter.status.${ clubStatus }.info`, [ "joindate" ], [ kickbackData?.firstSubscriptionDate ])
        default:
            return LocalizeText(`hccenter.status.${ clubStatus }.info`)
        }
    }

    useMessageEvent<ScrSendKickbackInfoMessageEvent>(ScrSendKickbackInfoMessageEvent, event =>
    {
        const parser = event.getParser()

        setKickbackData(parser.data)
    })

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split("/")

                if(parts.length < 2) return

                switch(parts[1])
                {
                case "open":
                    if(parts.length > 2)
                    {
                        switch(parts[2])
                        {
                        case "hccenter":
                            setIsVisible(true)
                            break
                        }
                    }
                    return
                }
            },
            eventUrlPrefix: "habboUI/"
        }

        AddEventLinkTracker(linkTracker)

        return () => RemoveLinkEventTracker(linkTracker)
    }, [])

    useEffect(() =>
    {
        if(!isVisible) return

        const id = activate()

        return () => deactivate(id)
    }, [ isVisible, activate, deactivate ])

    useEffect(() =>
    {
        SendMessageComposer(new ScrGetKickbackInfoMessageComposer())
    }, []) 

    if(!isVisible) return null

    return (
        <NitroCardView uniqueKey="hc-center" className="illumina-hc-center w-[460px] overflow-hidden">
            <NitroCardHeaderView headerText={ LocalizeText("generic.hccenter") } onCloseClick={ () => setIsVisible(false) } />
            <div className="relative mx-px flex h-[250px] justify-between overflow-hidden p-2.5">
                <div className="flex flex-col">
                    <img className="mb-3 w-fit" src={`https://habbofont.net/font/hc_big/${ hotelName ?? "Illumina" }+club.gif`} height={ 71 } alt={`${ hotelName } Club`} />
                    <Button variant="success" className="h-[33px] w-fit" onClick={ event => CreateLinkEvent("catalog/open/" + GetConfiguration("catalog.links")["hc.buy_hc"]) }>
                        { LocalizeText((clubStatus === ClubStatus.ACTIVE) ? "hccenter.btn.extend" : "hccenter.btn.buy") }
                    </Button>
                    <div className="mt-5 flex max-w-[180px] flex-col">
                        <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("hccenter.status." + clubStatus) }</p>
                        <p className="text-sm" dangerouslySetInnerHTML={ { __html: getInfoText() } } />
                    </div>
                </div>
                <div className="absolute right-[-100px] top-[-18px] h-[292px] w-[421px] bg-[url('/client-assets/images/hc-center/avatar.png?v=2451779')]">
                    <LayoutAvatarImageView className="!absolute !-top-0.5 !right-[90px]" figure={ userFigure } direction={ 4 } />
                </div>
            </div>
            <NitroCardContentView>
                <div className="illumina-hc-center-benefits mt-12 flex items-end justify-between p-3 pb-0">
                    <div className="text-white">
                        <h5 className="mb-1 font-semibold [text-shadow:_0_1px_0_#dd4e00]">{ LocalizeText("hccenter.general.title") }</h5>
                        <p className="text-sm" dangerouslySetInnerHTML={ { __html: LocalizeText("hccenter.general.info") } } />
                        <button className="mb-3 mt-2.5 text-sm font-semibold underline [text-shadow:_0_1px_0_#dd4e00]" onClick={ () => CreateLinkEvent("habbopages/" + GetConfiguration("hc.center")["benefits.habbopage"]) }>
                            { LocalizeText("hccenter.general.infolink") }
                        </button>
                    </div>
                    <div className="h-[130px] w-[200px] bg-[url('/client-assets/images/hc-center/benefits-promo.png?v=2451779')]" />
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
