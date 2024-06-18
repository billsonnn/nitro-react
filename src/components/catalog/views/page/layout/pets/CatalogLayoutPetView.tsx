import { ApproveNameMessageComposer, ApproveNameMessageEvent, ColorConverter, GetSellablePetPalettesComposer, PurchaseFromCatalogComposer, SellablePetPaletteData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FaFillDrip } from 'react-icons/fa';
import { DispatchUiEvent, GetPetAvailableColors, GetPetIndexFromLocalization, LocalizeText, SendMessageComposer } from '../../../../../../api';
import { AutoGrid, Button, Column, Grid, LayoutGridItem, LayoutPetImageView, Text } from '../../../../../../common';
import { CatalogPurchaseFailureEvent } from '../../../../../../events';
import { useCatalog, useMessageEvent } from '../../../../../../hooks';
import { CatalogAddOnBadgeWidgetView } from '../../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogPurchaseWidgetView } from '../../widgets/CatalogPurchaseWidgetView';
import { CatalogTotalPriceWidget } from '../../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayoutPetView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const [ petIndex, setPetIndex ] = useState(-1);
    const [ sellablePalettes, setSellablePalettes ] = useState<SellablePetPaletteData[]>([]);
    const [ selectedPaletteIndex, setSelectedPaletteIndex ] = useState(-1);
    const [ sellableColors, setSellableColors ] = useState<number[][]>([]);
    const [ selectedColorIndex, setSelectedColorIndex ] = useState(-1);
    const [ colorsShowing, setColorsShowing ] = useState(false);
    const [ petName, setPetName ] = useState('');
    const [ approvalPending, setApprovalPending ] = useState(true);
    const [ approvalResult, setApprovalResult ] = useState(-1);
    const { currentOffer = null, setCurrentOffer = null, setPurchaseOptions = null, catalogOptions = null, roomPreviewer = null } = useCatalog();
    const { petPalettes = null } = catalogOptions;

    const getColor = useMemo(() =>
    {
        if(!sellableColors.length || (selectedColorIndex === -1)) return 0xFFFFFF;

        return sellableColors[selectedColorIndex][0];
    }, [ sellableColors, selectedColorIndex ]);

    const petBreedName = useMemo(() =>
    {
        if((petIndex === -1) || !sellablePalettes.length || (selectedPaletteIndex === -1)) return '';

        return LocalizeText(`pet.breed.${ petIndex }.${ sellablePalettes[selectedPaletteIndex].breedId }`);
    }, [ petIndex, sellablePalettes, selectedPaletteIndex ]);

    const petPurchaseString = useMemo(() =>
    {
        if(!sellablePalettes.length || (selectedPaletteIndex === -1)) return '';

        const paletteId = sellablePalettes[selectedPaletteIndex].paletteId;

        let color = 0xFFFFFF;

        if(petIndex <= 7)
        {
            if(selectedColorIndex === -1) return '';

            color = sellableColors[selectedColorIndex][0];
        }

        let colorString = color.toString(16).toUpperCase();

        while(colorString.length < 6) colorString = ('0' + colorString);

        return `${ paletteId }\n${ colorString }`;
    }, [ sellablePalettes, selectedPaletteIndex, petIndex, sellableColors, selectedColorIndex ]);

    const validationErrorMessage = useMemo(() =>
    {
        let key: string = '';

        switch(approvalResult)
        {
            case 1:
                key = 'catalog.alert.petname.long';
                break;
            case 2:
                key = 'catalog.alert.petname.short';
                break;
            case 3:
                key = 'catalog.alert.petname.chars';
                break;
            case 4:
                key = 'catalog.alert.petname.bobba';
                break;
        }

        if(!key || !key.length) return '';

        return LocalizeText(key);
    }, [ approvalResult ]);

    const purchasePet = useCallback(() =>
    {
        if(approvalResult === -1)
        {
            SendMessageComposer(new ApproveNameMessageComposer(petName, 1));

            return;
        }

        if(approvalResult === 0)
        {
            SendMessageComposer(new PurchaseFromCatalogComposer(page.pageId, currentOffer.offerId, `${ petName }\n${ petPurchaseString }`, 1));

            return;
        }
    }, [ page, currentOffer, petName, petPurchaseString, approvalResult ]);

    useMessageEvent<ApproveNameMessageEvent>(ApproveNameMessageEvent, event =>
    {
        const parser = event.getParser();

        setApprovalResult(parser.result);

        if(parser.result === 0) purchasePet();
        else DispatchUiEvent(new CatalogPurchaseFailureEvent(-1));
    });

    useEffect(() =>
    {
        if(!page || !page.offers.length) return;

        const offer = page.offers[0];

        setCurrentOffer(offer);
        setPetIndex(GetPetIndexFromLocalization(offer.localizationId));
        setColorsShowing(false);
    }, [ page, setCurrentOffer ]);

    useEffect(() =>
    {
        if(!currentOffer) return;

        const productData = currentOffer.product.productData;

        if(!productData) return;

        if(petPalettes)
        {
            for(const paletteData of petPalettes)
            {
                if(paletteData.breed !== productData.type) continue;

                const palettes: SellablePetPaletteData[] = [];

                for(const palette of paletteData.palettes)
                {
                    if(!palette.sellable) continue;

                    palettes.push(palette);
                }

                setSelectedPaletteIndex((palettes.length ? 0 : -1));
                setSellablePalettes(palettes);

                return;
            }
        }

        setSelectedPaletteIndex(-1);
        setSellablePalettes([]);

        SendMessageComposer(new GetSellablePetPalettesComposer(productData.type));
    }, [ currentOffer, petPalettes ]);

    useEffect(() =>
    {
        if(petIndex === -1) return;

        const colors = GetPetAvailableColors(petIndex, sellablePalettes);

        setSelectedColorIndex((colors.length ? 0 : -1));
        setSellableColors(colors);
    }, [ petIndex, sellablePalettes ]);

    useEffect(() =>
    {
        if(!roomPreviewer) return;

        roomPreviewer.reset(false);

        if((petIndex === -1) || !sellablePalettes.length || (selectedPaletteIndex === -1)) return;

        let petFigureString = `${ petIndex } ${ sellablePalettes[selectedPaletteIndex].paletteId }`;

        if(petIndex <= 7) petFigureString += ` ${ getColor.toString(16) }`;

        roomPreviewer.addPetIntoRoom(petFigureString);
    }, [ roomPreviewer, petIndex, sellablePalettes, selectedPaletteIndex, getColor ]);

    useEffect(() =>
    {
        setApprovalResult(-1);
    }, [ petName ]);

    if(!currentOffer) return null;

    return (
        <Grid>
            <Column overflow="hidden" size={ 7 }>
                <AutoGrid columnCount={ 5 }>
                    { !colorsShowing && (sellablePalettes.length > 0) && sellablePalettes.map((palette, index) =>
                    {
                        return (
                            <LayoutGridItem key={ index } itemActive={ (selectedPaletteIndex === index) } onClick={ event => setSelectedPaletteIndex(index) }>
                                <LayoutPetImageView direction={ 2 } headOnly={ true } paletteId={ palette.paletteId } typeId={ petIndex } />
                            </LayoutGridItem>
                        );
                    }) }
                    { colorsShowing && (sellableColors.length > 0) && sellableColors.map((colorSet, index) => <LayoutGridItem key={ index } itemHighlight className="clear-bg" itemActive={ (selectedColorIndex === index) } itemColor={ ColorConverter.int2rgb(colorSet[0]) } onClick={ event => setSelectedColorIndex(index) } />) }
                </AutoGrid>
            </Column>
            <Column center={ !currentOffer } overflow="hidden" size={ 5 }>
                { !currentOffer &&
                    <>
                        { !!page.localization.getImage(1) && <img alt="" src={ page.localization.getImage(1) } /> }
                        <Text center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                    </> }
                { currentOffer &&
                    <>
                        <div className="relative overflow-hidden">
                            <CatalogViewProductWidgetView />
                            <CatalogAddOnBadgeWidgetView className="bg-muted rounded bottom-1 end-1" position="absolute" />
                            { ((petIndex > -1) && (petIndex <= 7)) &&
                                <Button className="bottom-1 start-1" position="absolute" onClick={ event => setColorsShowing(!colorsShowing) }>
                                    <FaFillDrip className="fa-icon" />
                                </Button> }
                        </div>
                        <Column grow gap={ 1 }>
                            <Text truncate>{ petBreedName }</Text>
                            <Column grow gap={ 1 }>
                                <input className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem] form-control-sm w-full" placeholder={ LocalizeText('widgets.petpackage.name.title') } type="text" value={ petName } onChange={ event => setPetName(event.target.value) } />
                                { (approvalResult > 0) &&
                                    <div className="invalid-feedback d-block m-0">{ validationErrorMessage }</div> }
                            </Column>
                            <div className="flex justify-end">
                                <CatalogTotalPriceWidget alignItems="end" justifyContent="end" />
                            </div>
                            <CatalogPurchaseWidgetView purchaseCallback={ purchasePet } />
                        </Column>
                    </> }
            </Column>
        </Grid>
    );
};
