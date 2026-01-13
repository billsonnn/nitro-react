import { FriendlyTime, GetTargetedOfferComposer, PurchaseTargetedOfferComposer, TargetedOfferData } from "@nitrots/nitro-renderer"
import { Dispatch, SetStateAction, useMemo, useState } from "react"
import { GetConfiguration, LocalizeText, SendMessageComposer } from "../../../../api"
import { Button, LayoutCurrencyIcon, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { usePurse } from "../../../../hooks"

export const OfferWindowView = (props: { offer: TargetedOfferData, setOpen: Dispatch<SetStateAction<boolean>> }) =>
{
    const { offer = null, setOpen = null } = props

    const { getCurrencyAmount } = usePurse()

    const [ amount, setAmount ] = useState<number>(1)

    const canPurchase = useMemo(() =>
    {
        let credits = false
        let points = false
        let limit = false

        if (offer.priceInCredits > 0) credits = getCurrencyAmount(-1) >= offer.priceInCredits
        
        if (offer.priceInActivityPoints > 0) points = getCurrencyAmount(offer.activityPointType) >= offer.priceInActivityPoints
        else points = true

        if (offer.purchaseLimit > 0) limit = true
        
        return (credits && points && limit)
    },[ offer,getCurrencyAmount ])

    const expirationTime = () =>
    {
        let expirationTime = Math.max(0, (offer.expirationTime - Date.now()) / 1000)

        return FriendlyTime.format(expirationTime)
    }

    const buyOffer = () =>
    {
        SendMessageComposer(new PurchaseTargetedOfferComposer(offer.id, amount))
        SendMessageComposer(new GetTargetedOfferComposer())
    }

    if (!offer) return

    return <NitroCardView uniqueKey="targeted-offer" className="illumina-targeted-offer w-[575px]">
        <NitroCardHeaderView headerText={ LocalizeText(offer.title) } onCloseClick={ event => setOpen(false) } />
        <NitroCardContentView gap={ 1 }>
            <div className="illumina-offers-end-time mb-[13px] flex h-[35px] items-center justify-center">
                <p className="text-[#FFFEFE]">{ LocalizeText("targeted.offer.timeleft",[ "timeleft" ],[ expirationTime() ]) }</p>
            </div>
            <div className="flex justify-between">
                <div className="illumina-offers-content relative mb-[30px] h-[249px] w-80 px-[13px] py-[18px]">
                    <b className="text-lg font-semibold text-[#010100] [text-shadow:_0_1px_0_#ffdd58]">{ LocalizeText(offer.title) }</b>
                    <p className="mt-2.5 text-sm text-[#34190A]" dangerouslySetInnerHTML={ { __html: offer.description } }/>
                    <div className="absolute bottom-[-27px] -right-10 flex h-[138px] w-[136px] flex-col items-center justify-center gap-2.5 bg-[url('/client-assets/images/offers/price-bg.png?v=2451779')]">
                        { offer.priceInCredits > 0 &&
                            <div className="flex items-center gap-2">
                                <p className="invisible text-3xl text-[#FFFFFE]">+</p>
                                <p className="text-3xl text-[#FFFFFE]">{ offer.priceInCredits }</p>
                                <LayoutCurrencyIcon type="big" currency={ -1 } />
                            </div> }
                        { offer.priceInActivityPoints > 0 &&
                            <div className="flex items-center gap-2">
                                <p className="text-3xl text-[#FFFFFE]">+</p>
                                <p className="text-3xl text-[#FFFFFE]">{ offer.priceInActivityPoints }</p>
                                <LayoutCurrencyIcon type="big" currency={ offer.activityPointType } />
                            </div> }
                    </div>
                </div>
                <div className="h-[279px] w-[190px] shrink-0 bg-center bg-no-repeat" style={ { backgroundImage: `url(${ GetConfiguration("image.library.url") + offer.imageUrl })` } } />
            </div>
            <div className="mt-[7px] flex flex-col items-center justify-center">
                <p className={`mb-[7px] font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B] ${ !canPurchase ? "visible" : "invisible" }`}>{ LocalizeText("targeted.offer.not.enough.credits") }</p>
                <div className="flex items-center gap-[15px]">
                    {offer.purchaseLimit > 1 && 
                        <div className="flex items-center gap-3.5">
                            <p className="text-sm text-[#6A6A6A]">{ LocalizeText("catalog.bundlewidget.quantity") }</p>
                            <div className="illumina-input relative h-[26px] w-[30px]">
                                <input type="number" className="size-full bg-transparent px-1.5 text-[13px] text-black" value={ amount } onChange={ evt => setAmount(parseInt(evt.target.value)) } min={ 1 } max={ offer.purchaseLimit } />
                            </div>
                        </div> }
                    <Button variant="success" disabled={ !canPurchase } onClick={ () => buyOffer() }>{ LocalizeText("targeted.offer.button.buy") }</Button>
                </div>
            </div>
        </NitroCardContentView>
    </NitroCardView>
}
