import { FC } from "react"
import { LocalizeText } from "../../../../api"
import { Button, DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useFurnitureExchangeWidget } from "../../../../hooks"

export const FurnitureExchangeCreditView: FC<{}> = props =>
{
    const { objectId = -1, value = 0, onClose = null, redeem = null } = useFurnitureExchangeWidget()

    if(objectId === -1) return null

    return (
        <NitroCardView uniqueKey="furniture-exchange" className="illumina-furniture-exchange h-[145px] w-[375px]" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText={ LocalizeText("catalog.redeem.dialog.title") } onCloseClick={ onClose } />
            <NitroCardContentView>
                <div className="flex gap-2.5">
                    <i className="block size-[103px] bg-[url('/client-assets/images/notifications/frank-exchange.png?v=2451779')]" />
                    <div className="flex flex-col">
                        <p className="flex-1 text-sm">{ LocalizeText("widgets.furniture.credit.redeem.value", [ "value" ], [ value.toString() ]) }</p>
                        <div className="flex items-center justify-between">
                            <Button className="!px-8" onClick={ onClose }>
                                { LocalizeText("generic.cancel") }
                            </Button>
                            <Button variant="success" className="!px-8" onClick={ redeem }>
                                { LocalizeText("catalog.redeem.dialog.button.exchange") }
                            </Button>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
