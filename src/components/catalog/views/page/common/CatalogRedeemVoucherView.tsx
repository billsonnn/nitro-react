import { RedeemVoucherMessageComposer, VoucherRedeemErrorMessageEvent, VoucherRedeemOkMessageEvent } from "@nitrots/nitro-renderer"
import { FC, useState } from "react"
import { LocalizeText, NotificationAlertType, SendMessageComposer } from "../../../../../api"
import { Button } from "../../../../../common"
import { useMessageEvent, useNotification } from "../../../../../hooks"

export interface CatalogRedeemVoucherViewProps
{
    text: string;
}

export const CatalogRedeemVoucherView: FC<CatalogRedeemVoucherViewProps> = props =>
{
    const { text = null } = props
    const [ voucher, setVoucher ] = useState<string>("")
    const [ isWaiting, setIsWaiting ] = useState(false)
    const { simpleAlert = null } = useNotification()

    const redeemVoucher = () =>
    {
        if(!voucher || !voucher.length || isWaiting) return

        SendMessageComposer(new RedeemVoucherMessageComposer(voucher))

        setIsWaiting(true)
    }

    useMessageEvent<VoucherRedeemOkMessageEvent>(VoucherRedeemOkMessageEvent, event =>
    {
        const parser = event.getParser()

        let message = LocalizeText("catalog.alert.voucherredeem.ok.description")

        if(parser.productName) message = LocalizeText("catalog.alert.voucherredeem.ok.description.furni", [ "productName", "productDescription" ], [ parser.productName, parser.productDescription ])

        simpleAlert(message, NotificationAlertType.ALERT, null, null, LocalizeText("catalog.alert.voucherredeem.ok.title"))
        
        setIsWaiting(false)
        setVoucher("")
    })

    useMessageEvent<VoucherRedeemErrorMessageEvent>(VoucherRedeemErrorMessageEvent, event =>
    {
        const parser = event.getParser()

        simpleAlert(LocalizeText(`catalog.alert.voucherredeem.error.description.${ parser.errorCode }`), NotificationAlertType.ALERT, null, null, LocalizeText("catalog.alert.voucherredeem.error.title"))

        setIsWaiting(false)
    })

    return (
        <div className="illumina-catalogue-redeem ml-2 h-[61px] p-1.5">
            <p className="pb-1.5 pl-1 text-sm text-white">{ LocalizeText("shop.redeem.button") }</p>
            <div className="flex items-center gap-11">
                <input type="text" className="illumina-input h-[25px] w-[216px] p-[7px]" placeholder={ text } value={ voucher } onChange={ event => setVoucher(event.target.value) } />
                <Button variant="primary" onClick={ redeemVoucher } disabled={ isWaiting }>
                    { LocalizeText("redeem") }
                </Button>
            </div>
        </div>
    )
}
