import { FC, useEffect, useRef, useState } from "react"
import { IPurchasableOffer, ProductTypeEnum } from "../../../../../api"
import { AutoGridProps, Button, LayoutFurniImageView } from "../../../../../common"
import { useCatalog } from "../../../../../hooks"
import { CatalogSimplePriceWidgetView } from "./CatalogSimplePriceWidgetView"

interface CatalogItemSingleWidgetViewProps extends AutoGridProps {}

export const CatalogItemSingleWidgetView: FC<CatalogItemSingleWidgetViewProps> = (props) => {
    const { columnCount = 5, children = null, ...rest } = props
    const { currentOffer = null, setCurrentOffer = null, currentPage = null, setPurchaseOptions = null } = useCatalog()
    const elementRef = useRef<HTMLDivElement>()
    const [ selectedIndex, setSelectedIndex ] = useState<number>(0)

    const selectOffer = (offer: IPurchasableOffer) => {
        offer.activate()

        if (offer.isLazy) return

        setCurrentOffer(offer)

        if (offer.product && offer.product.productType === ProductTypeEnum.WALL) {
            setPurchaseOptions((prevValue) => {
                const newValue = { ...prevValue }

                newValue.extraData = offer.product.extraParam || null

                return newValue
            })
        }
    }

    const handleNext = () => {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % currentPage.offers.length)
    }

    const handlePrevious = () => {
        setSelectedIndex((prevIndex) => (prevIndex - 1 + currentPage.offers.length) % currentPage.offers.length)
    }

    const selectedOffer = currentPage.offers[selectedIndex]

    useEffect(() => {
        selectOffer(selectedOffer)
    }, [ selectedOffer ])

    useEffect(() => {
        if (currentPage && currentPage.offers) {
            setCurrentOffer(currentPage.offers[selectedIndex])
        }
    }, [])

    if (!currentOffer) return null

    return (
        <div className="relative flex h-[150px] items-end justify-center" ref={elementRef} {...rest}>
            <div className="flex items-end">
                <Button variant="primary" className="!w-[26px] !px-0" onClick={ handlePrevious }>
                    <i className="block h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-56px_-118px]" />
                </Button>
                <div className="flex w-[75px] justify-center">
                    <LayoutFurniImageView productType={selectedOffer.product.productType} productClassId={selectedOffer.product.productClassId} />
                </div>
                <Button variant="primary" className="!w-[26px] !px-0" onClick={ handleNext }>
                    <i className="block h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-56px_-128px]" />
                </Button>
            </div>
            <CatalogSimplePriceWidgetView className="absolute bottom-0 right-1.5 !px-0" />
        </div>
    )
}
