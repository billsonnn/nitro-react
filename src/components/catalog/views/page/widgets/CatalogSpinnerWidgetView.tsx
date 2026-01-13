import { FC } from "react"
import { LocalizeText } from "../../../../../api"
import { useCatalog } from "../../../../../hooks"

const MIN_VALUE: number = 1
const MAX_VALUE: number = 100

export const CatalogSpinnerWidgetView: FC<{}> = props =>
{
    const { currentOffer = null, purchaseOptions = null, setPurchaseOptions = null } = useCatalog()
    const { quantity = 1 } = purchaseOptions

    const updateQuantity = (value: number) =>
    {
        if(isNaN(value)) value = 1

        value = Math.max(value, MIN_VALUE)
        value = Math.min(value, MAX_VALUE)

        if(value === quantity) return

        setPurchaseOptions(prevValue =>
        {
            const newValue = { ...prevValue }

            newValue.quantity = value

            return newValue
        })
    }

    if(!currentOffer || !currentOffer.bundlePurchaseAllowed) return <div className="h-[26px]" />

    return (
        <div className="flex w-[92px] items-center justify-between">
            <p className="text-sm text-[#6A6A6A]">{ LocalizeText("catalog.bundlewidget.quantity") }</p>
            <div className="illumina-input relative h-[26px] w-[30px]">
                <input type="number" className="size-full bg-transparent px-1.5 text-[13px] text-black" value={ quantity } onChange={ event => updateQuantity(event.target.valueAsNumber) } />
            </div>
        </div>
    )
}
