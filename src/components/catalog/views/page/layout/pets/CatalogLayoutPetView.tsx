import { ApproveNameMessageComposer, ApproveNameMessageEvent, ColorConverter, GetSellablePetPalettesComposer, PurchaseFromCatalogComposer, SellablePetPaletteData } from "@nitrots/nitro-renderer"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { DispatchUiEvent, GetPetAvailableColors, GetPetIndexFromLocalization, LocalizeText, NotificationAlertType, SendMessageComposer } from "../../../../../../api"
import { Button } from "../../../../../../common"
import { CatalogPurchaseFailureEvent } from "../../../../../../events"
import { useCatalog, useMessageEvent, useNotification } from "../../../../../../hooks"
import { CatalogAddOnBadgeWidgetView } from "../../widgets/CatalogAddOnBadgeWidgetView"
import { CatalogPurchaseWidgetView } from "../../widgets/CatalogPurchaseWidgetView"
import { CatalogSimplePriceWidgetView } from "../../widgets/CatalogSimplePriceWidgetView"
import { CatalogViewProductWidgetView } from "../../widgets/CatalogViewProductWidgetView"
import { CatalogLayoutProps } from "../CatalogLayout.types"

export const CatalogLayoutPetView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props
    const [ petIndex, setPetIndex ] = useState(-1)
    const [ sellablePalettes, setSellablePalettes ] = useState<SellablePetPaletteData[]>([])
    const [ selectedPaletteIndex, setSelectedPaletteIndex ] = useState(-1)
    const [ sellableColors, setSellableColors ] = useState<number[][]>([])
    const [ selectedColorIndex, setSelectedColorIndex ] = useState(-1)
    const [ colorsShowing, setColorsShowing ] = useState(false)
    const [ petName, setPetName ] = useState("")
    const [ approvalResult, setApprovalResult ] = useState(-1)
    const { currentOffer = null, setCurrentOffer = null, setPurchaseOptions = null, catalogOptions = null, roomPreviewer = null } = useCatalog()
    const { petPalettes = null } = catalogOptions
    const { simpleAlert = null } = useNotification()

    const getColor = useMemo(() =>
    {
        if(!sellableColors.length || (selectedColorIndex === -1)) return 0xFFFFFF

        return sellableColors[selectedColorIndex][0]
    }, [ sellableColors, selectedColorIndex ])

    const petBreedName = useMemo(() =>
    {
        if((petIndex === -1) || !sellablePalettes.length || (selectedPaletteIndex === -1)) return ""

        return LocalizeText(`pet.breed.${ petIndex }.${ sellablePalettes[selectedPaletteIndex].breedId }`)
    }, [ petIndex, sellablePalettes, selectedPaletteIndex ])

    const petPurchaseString = useMemo(() =>
    {
        if(!sellablePalettes.length || (selectedPaletteIndex === -1)) return ""

        const paletteId = sellablePalettes[selectedPaletteIndex].paletteId

        let color = 0xFFFFFF

        if(petIndex <= 7)
        {
            if(selectedColorIndex === -1) return ""

            color = sellableColors[selectedColorIndex][0]
        }

        let colorString = color.toString(16).toUpperCase()

        while(colorString.length < 6) colorString = ("0" + colorString)

        return `${ paletteId }\n${ colorString }`
    }, [ sellablePalettes, selectedPaletteIndex, petIndex, sellableColors, selectedColorIndex ])

    const validationErrorMessage = useMemo(() =>
    {
        switch(approvalResult)
        {
        case 1:
            simpleAlert(LocalizeText("catalog.alert.petname.long"), NotificationAlertType.ALERT, null, null, LocalizeText("catalog.alert.purchaseerror.title"))
            return
        case 2:
            simpleAlert(LocalizeText("catalog.alert.petname.short"), NotificationAlertType.ALERT, null, null, LocalizeText("catalog.alert.purchaseerror.title"))
            return
        case 3:
            simpleAlert(LocalizeText("catalog.alert.petname.chars"), NotificationAlertType.ALERT, null, null, LocalizeText("catalog.alert.purchaseerror.title"))
            return
        case 4:
            simpleAlert(LocalizeText("catalog.alert.petname.bobba"), NotificationAlertType.ALERT, null, null, LocalizeText("catalog.alert.purchaseerror.title"))
            return
        }
    }, [ approvalResult ])

    const purchasePet = useCallback(() =>
    {
        if(approvalResult === -1)
        {
            SendMessageComposer(new ApproveNameMessageComposer(petName, 1))
            return
        }

        if(approvalResult === 0)
        {
            SendMessageComposer(new PurchaseFromCatalogComposer(page.pageId, currentOffer.offerId, `${ petName }\n${ petPurchaseString }`, 1))
            return
        }

        setApprovalResult(-1)
    }, [ page, currentOffer, petName, petPurchaseString, approvalResult ])

    useMessageEvent<ApproveNameMessageEvent>(ApproveNameMessageEvent, event =>
    {
        const parser = event.getParser()

        setApprovalResult(parser.result)

        if(parser.result === 0) purchasePet()
        else DispatchUiEvent(new CatalogPurchaseFailureEvent(-1))
    })

    useEffect(() =>
    {
        if(!page || !page.offers.length) return

        const offer = page.offers[0]

        setCurrentOffer(offer)
        setPetIndex(GetPetIndexFromLocalization(offer.localizationId))
        setColorsShowing(false)
    }, [ page, setCurrentOffer ])

    useEffect(() =>
    {
        if(!currentOffer) return

        const productData = currentOffer.product.productData

        if(!productData) return

        if(petPalettes)
        {
            for(const paletteData of petPalettes)
            {
                if(paletteData.breed !== productData.type) continue
    
                const palettes: SellablePetPaletteData[] = []
    
                for(const palette of paletteData.palettes)
                {
                    if(!palette.sellable) continue
    
                    palettes.push(palette)
                }
    
                setSelectedPaletteIndex((palettes.length ? 0 : -1))
                setSellablePalettes(palettes)
    
                return
            }
        }

        setSelectedPaletteIndex(-1)
        setSellablePalettes([])

        SendMessageComposer(new GetSellablePetPalettesComposer(productData.type))
    }, [ currentOffer, petPalettes ])

    useEffect(() =>
    {
        if(petIndex === -1) return

        const colors = GetPetAvailableColors(petIndex, sellablePalettes)

        setSelectedColorIndex((colors.length ? 0 : -1))
        setSellableColors(colors)
    }, [ petIndex, sellablePalettes ])

    useEffect(() =>
    {
        if(!roomPreviewer) return
        
        roomPreviewer.reset(false)

        if((petIndex === -1) || !sellablePalettes.length || (selectedPaletteIndex === -1)) return

        let petFigureString = `${ petIndex } ${ sellablePalettes[selectedPaletteIndex].paletteId }`

        if(petIndex <= 7) petFigureString += ` ${ getColor.toString(16) }`

        roomPreviewer.addPetIntoRoom(petFigureString)
    }, [ roomPreviewer, petIndex, sellablePalettes, selectedPaletteIndex, getColor ])

    useEffect(() =>
    {
        setApprovalResult(-1)
    }, [ petName ])

    if(!currentOffer) return null

    return (<>
        { (approvalResult > 0) && validationErrorMessage }
        <div className="flex-1">
            { currentOffer &&
                <div className="relative h-[200px]">
                    <CatalogViewProductWidgetView height={ 200 } isBackground={ false } />
                    <CatalogAddOnBadgeWidgetView className="absolute right-2 top-2 " />
                    <p className="absolute left-2 top-2 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ petBreedName }</p>
                    <CatalogSimplePriceWidgetView className="absolute bottom-1.5 right-1.5 !px-0" />
                </div> }
            <div>
                <p className="mb-[7px] text-sm" dangerouslySetInnerHTML={ { __html: page.localization.getText(2) } } />
                <div className="illumina-card h-20 w-full overflow-hidden p-1">
                    <div className="illumina-scrollbar flex h-full flex-wrap content-start gap-[3px] overflow-auto">
                        { ((petIndex > -1) && (petIndex <= 7)) && (sellableColors.length > 0) && sellableColors.map((colorSet, index) => (
                            <Button key={ index } className={`!h-[22px] !w-[27px] !p-[5px] ${(selectedColorIndex === index) ? "!p-1.5" : ""}`} onClick={ event => setSelectedColorIndex(index) }>
                                <div className={`size-full border ${(selectedColorIndex === index) ? "!border-[#00000027]" : "border-[#A4A4A4] dark:border-black"}`} style={{ backgroundColor: ColorConverter.int2rgb(colorSet[0]) }} />
                            </Button>
                        )) }
                    </div>
                </div>
            </div>
            <div className="mt-[3px] flex flex-col">
                <p className="mb-[7px] text-sm" dangerouslySetInnerHTML={ { __html: page.localization.getText(1) } } />
                <input type="text" className="illumina-input h-[25px] w-full px-[7px]" value={ petName } onChange={ event => setPetName(event.target.value) } />
            </div>
            <div className="mt-[3px] flex flex-col">
                <p className="mb-[7px] text-sm" dangerouslySetInnerHTML={ { __html: page.localization.getText(3) } } />
                <div className="illumina-select relative flex h-[25px] items-center gap-[3px] px-2.5">
                    <select className="w-full" onChange={ event => setSelectedPaletteIndex(parseInt(event.target.value))}>
                        { !colorsShowing && sellablePalettes.length > 0 && sellablePalettes.map((palette, index) => (
                            <option className="!text-black" key={index} value={index}>
                                {LocalizeText(`pet.breed.${petIndex}.${palette.breedId}`)}
                            </option>
                        ))}
                    </select>
                    <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                </div>
            </div>
        </div>
        <div className="flex h-[57px] flex-col justify-end">
            <CatalogPurchaseWidgetView isPet={ true } purchaseCallback={ purchasePet } />
        </div>
    </>)
}
