import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColorConverter, GetSellablePetPalettesComposer, SellablePetPaletteData } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { Base } from '../../../../../../common/Base';
import { Button } from '../../../../../../common/Button';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { LayoutGridItem } from '../../../../../../common/layout/LayoutGridItem';
import { Text } from '../../../../../../common/Text';
import { BatchUpdates } from '../../../../../../hooks';
import { SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { PetImageView } from '../../../../../../views/shared/pet-image/PetImageView';
import { GetPetAvailableColors, GetPetIndexFromLocalization } from '../../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogRoomPreviewerView } from '../../../catalog-room-previewer/CatalogRoomPreviewerView';
import { CatalogPageDetailsView } from '../../../page-details/CatalogPageDetailsView';
import { CatalogLayoutProps } from '../CatalogLayout.types';
import { CatalogLayoutPetPurchaseView } from './CatalogLayoutPetPurchaseView';

export const CatalogLayoutPetView: FC<CatalogLayoutProps> = props =>
{
    const { page = null, roomPreviewer = null } = props;
    const [ petIndex, setPetIndex ] = useState(-1);
    const [ sellablePalettes, setSellablePalettes ] = useState<SellablePetPaletteData[]>([]);
    const [ selectedPaletteIndex, setSelectedPaletteIndex ] = useState(-1);
    const [ sellableColors, setSellableColors ] = useState<number[][]>([]);
    const [ selectedColorIndex, setSelectedColorIndex ] = useState(-1);
    const [ colorsShowing, setColorsShowing ] = useState(false);
    const { currentOffer = null, setCurrentOffer = null, catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { petPalettes = [] } = catalogState;

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

        roomPreviewer && roomPreviewer.reset(false);

        if((petIndex === -1) || !sellablePalettes.length || (selectedPaletteIndex === -1)) return;

        let petFigureString = `${ petIndex } ${ sellablePalettes[selectedPaletteIndex].paletteId }`;

        if(petIndex <= 7) petFigureString += ` ${ getColor.toString(16) }`;

        roomPreviewer.addPetIntoRoom(petFigureString);
    }, [ roomPreviewer, petIndex, sellablePalettes, selectedPaletteIndex, getColor ]);

    if(!currentOffer) return null;

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <Grid grow columnCount={ 5 } overflow="auto">
                    { !colorsShowing && (sellablePalettes.length > 0) && sellablePalettes.map((palette, index) =>
                        {
                            return (
                                <LayoutGridItem key={ index } itemActive={ (selectedPaletteIndex === index) } onClick={ event => setSelectedPaletteIndex(index) }>
                                    <PetImageView typeId={ petIndex } paletteId={ palette.paletteId } direction={ 2 } headOnly={ true } />
                                </LayoutGridItem>
                            );
                        })}
                    { colorsShowing && (sellableColors.length > 0) && sellableColors.map((colorSet, index) => <LayoutGridItem key={ index } itemActive={ (selectedColorIndex === index) } itemColor={ ColorConverter.int2rgb(colorSet[0]) } onClick={ event => setSelectedColorIndex(index) } />) }
                </Grid>
            </Column>
            <Column size={ 5 } overflow="hidden">
                { (petIndex === -1) &&
                    <CatalogPageDetailsView page={ page } /> }
                { (petIndex >= 0) &&
                    <>
                        <Column overflow="hidden" position="relative" gap={ 0 }>
                            { roomPreviewer && <CatalogRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } /> }
                            { (petIndex > -1 && petIndex <= 7) &&
                                <Base position="absolute" className="start-1 bottom-1">
                                    <Button size="sm" active={ colorsShowing } onClick={ event => setColorsShowing(!colorsShowing) }>
                                        <FontAwesomeIcon icon="fill-drip" />
                                    </Button>
                                </Base> }
                        </Column>
                        <Column grow>
                            <Text grow truncate>{ petBreedName }</Text>
                            <CatalogLayoutPetPurchaseView offer={ currentOffer } pageId={ page.pageId } extra={ petPurchaseString } />
                        </Column>
                    </> }
            </Column>
        </Grid>
    );
}
