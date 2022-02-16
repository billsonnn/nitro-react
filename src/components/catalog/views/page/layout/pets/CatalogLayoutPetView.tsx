import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ApproveNameMessageComposer, ColorConverter, GetSellablePetPalettesComposer, PurchaseFromCatalogComposer, SellablePetPaletteData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { AutoGrid } from '../../../../../../common/AutoGrid';
import { Base } from '../../../../../../common/Base';
import { Button } from '../../../../../../common/Button';
import { Column } from '../../../../../../common/Column';
import { Flex } from '../../../../../../common/Flex';
import { Grid } from '../../../../../../common/Grid';
import { LayoutGridItem } from '../../../../../../common/layout/LayoutGridItem';
import { Text } from '../../../../../../common/Text';
import { CatalogNameResultEvent, CatalogPurchaseFailureEvent } from '../../../../../../events';
import { CatalogWidgetEvent } from '../../../../../../events/catalog/CatalogWidgetEvent';
import { BatchUpdates, dispatchUiEvent, useUiEvent } from '../../../../../../hooks';
import { SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { PetImageView } from '../../../../../../views/shared/pet-image/PetImageView';
import { useCatalogContext } from '../../../../CatalogContext';
import { GetPetAvailableColors, GetPetIndexFromLocalization } from '../../../../common/CatalogUtilities';
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
    const { currentOffer = null, setCurrentOffer = null, setPurchaseOptions = null, catalogOptions = null, roomPreviewer = null } = useCatalogContext();
    const { petPalettes = [] } = catalogOptions;

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

        console.log(approvalResult);

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
            SendMessageHook(new ApproveNameMessageComposer(petName, 1));

            return;
        }

        if(approvalResult === 0)
        {
            SendMessageHook(new PurchaseFromCatalogComposer(page.pageId, currentOffer.offerId, `${ petName }\n${ petPurchaseString }`, 1));

            return;
        }
    }, [ page, currentOffer, petName, petPurchaseString, approvalResult ]);

    const onCatalogNameResultEvent = useCallback((event: CatalogNameResultEvent) =>
    {
        setApprovalResult(event.result);

        if(event.result === 0) purchasePet();
        else dispatchUiEvent(new CatalogPurchaseFailureEvent(-1));
    }, [ purchasePet ]);

    useUiEvent(CatalogWidgetEvent.APPROVE_RESULT, onCatalogNameResultEvent);

    useEffect(() =>
    {
        if(!page || !page.offers.length) return;

        const offer = page.offers[0];

        BatchUpdates(() =>
        {
            setCurrentOffer(offer);
            setPetIndex(GetPetIndexFromLocalization(offer.localizationId));
            setColorsShowing(false);
        });
    }, [ page, setCurrentOffer ]);

    useEffect(() =>
    {
        if(!currentOffer) return;

        const productData = currentOffer.product.productData;

        if(!productData) return;

        for(const paletteData of petPalettes)
        {
            if(paletteData.breed !== productData.type) continue;

            const palettes: SellablePetPaletteData[] = [];

            for(const palette of paletteData.palettes)
            {
                if(!palette.sellable) continue;

                palettes.push(palette);
            }

            BatchUpdates(() =>
            {
                setSelectedPaletteIndex((palettes.length ? 0 : -1));
                setSellablePalettes(palettes);
            });

            return;
        }

        BatchUpdates(() =>
        {
            setSelectedPaletteIndex(-1);
            setSellablePalettes([]);
        });

        SendMessageHook(new GetSellablePetPalettesComposer(productData.type));
    }, [ currentOffer, petPalettes ]);

    useEffect(() =>
    {
        if(petIndex === -1) return;

        const colors = GetPetAvailableColors(petIndex, sellablePalettes);

        BatchUpdates(() =>
        {
            setSelectedColorIndex((colors.length ? 0 : -1));
            setSellableColors(colors);
        });
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
            <Column size={ 7 } overflow="hidden">
                <AutoGrid columnCount={ 5 }>
                    { !colorsShowing && (sellablePalettes.length > 0) && sellablePalettes.map((palette, index) =>
                        {
                            return (
                                <LayoutGridItem key={ index } itemActive={ (selectedPaletteIndex === index) } onClick={ event => setSelectedPaletteIndex(index) }>
                                    <PetImageView typeId={ petIndex } paletteId={ palette.paletteId } direction={ 2 } headOnly={ true } />
                                </LayoutGridItem>
                            );
                        })}
                    { colorsShowing && (sellableColors.length > 0) && sellableColors.map((colorSet, index) => <LayoutGridItem key={ index } itemActive={ (selectedColorIndex === index) } itemColor={ ColorConverter.int2rgb(colorSet[0]) } onClick={ event => setSelectedColorIndex(index) } />) }
                </AutoGrid>
            </Column>
            <Column center={ !currentOffer } size={ 5 } overflow="hidden">
                { !currentOffer &&
                    <>
                        { !!page.localization.getImage(1) && <img alt="" src={ page.localization.getImage(1) } /> }
                        <Text center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                    </> }
                { currentOffer &&
                    <>
                        <Base position="relative" overflow="hidden">
                            <CatalogViewProductWidgetView />
                            <CatalogAddOnBadgeWidgetView position="absolute" className="bg-muted rounded bottom-1 end-1" />
                            { ((petIndex > -1) && (petIndex <= 7)) &&
                                <Button position="absolute" className="bottom-1 start-1" onClick={ event => setColorsShowing(!colorsShowing) }>
                                    <FontAwesomeIcon icon="fill-drip" />
                                </Button> }
                        </Base>
                        <Column grow gap={ 1 }>
                            <Text truncate>{ petBreedName }</Text>
                            <Column grow gap={ 1 }>
                                <input type="text" className="form-control form-control-sm w-100" placeholder={ LocalizeText('widgets.petpackage.name.title') } value={ petName } onChange={ event => setPetName(event.target.value) } />
                                { (approvalResult > 0) &&
                                    <Base className="invalid-feedback d-block m-0">{ validationErrorMessage }</Base> }
                            </Column>
                            <Flex justifyContent="end">
                                <CatalogTotalPriceWidget justifyContent="end" alignItems="end" />
                            </Flex>
                            <CatalogPurchaseWidgetView purchaseCallback={ purchasePet } />
                        </Column>
                    </> }
            </Column>
        </Grid>
    );
}
