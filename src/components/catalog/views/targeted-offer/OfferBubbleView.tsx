import { TargetedOfferData } from "@nitrots/nitro-renderer"
import { Dispatch, SetStateAction } from "react"
import { GetConfiguration } from "../../../../api"

export const OfferBubbleView = (props: { offer: TargetedOfferData, setOpen: Dispatch<SetStateAction<boolean>> }) =>
{
    const { offer = null, setOpen = null } = props

    if (!offer) return

    return <div className="illumina-purse mt-[3px] w-48 cursor-pointer" onClick={ evt => setOpen(true) }>
        <div className="flex gap-[7px] px-[7px] py-2.5">
            <i className="size-10" style={ { backgroundImage: `url(${ GetConfiguration("image.library.url") + offer.iconImageUrl })` } }/>
            <p className="text-xs font-semibold text-white [text-shadow:_0_1px_0_#33312B]">{ offer.title }</p>
        </div>
    </div>
}
