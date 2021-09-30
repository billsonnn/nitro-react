import { ColorConverter, GetSellablePetPalettesComposer, SellablePetPaletteData } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { GetProductDataForLocalization, LocalizeText } from '../../../../../../api';
import { SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { NitroCardGridItemView, NitroCardGridView, NitroLayoutFlexColumn, NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../../../layout';
import { NitroLayoutBase } from '../../../../../../layout/base';
import { PetImageView } from '../../../../../shared/pet-image/PetImageView';
import { GetPetAvailableColors, GetPetIndexFromLocalization } from '../../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogActions } from '../../../../reducers/CatalogReducer';
import { CatalogRoomPreviewerView } from '../../../catalog-room-previewer/CatalogRoomPreviewerView';
import { CatalogPageDetailsView } from '../../../page-details/CatalogPageDetailsView';
import { CatalogLayoutPetViewProps } from './CatalogLayoutPetView.types';
import { CatalogLayoutPetPurchaseView } from './purchase/CatalogLayoutPetPurchaseView';

export const CatalogLayoutPetView: FC<CatalogLayoutPetViewProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null, petPalettes = [] } = catalogState;
    const [ petIndex, setPetIndex ] = useState(-1);
    const [ sellablePalettes, setSellablePalettes ] = useState<SellablePetPaletteData[]>([]);
    const [ selectedPaletteIndex, setSelectedPaletteIndex ] = useState(-1);
    const [ sellableColors, setSellableColors ] = useState<number[][]>([]);
    const [ selectedColorIndex, setSelectedColorIndex ] = useState(-1);
    const [ colorsShowing, setColorsShowing ] = useState(false);

    useEffect(() =>
    {
        if(!pageParser || !pageParser.offers.length) return;

        const offer = pageParser.offers[0];

        dispatchCatalogState({
            type: CatalogActions.SET_CATALOG_ACTIVE_OFFER,
            payload: {
                activeOffer: offer
            }
        });

        setPetIndex(GetPetIndexFromLocalization(offer.localizationId));
        setColorsShowing(false);
    }, [ pageParser, dispatchCatalogState ]);

    useEffect(() =>
    {
        if(!activeOffer) return;

        const productData = GetProductDataForLocalization(activeOffer.localizationId);

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

            setSelectedPaletteIndex((palettes.length ? 0 : -1));
            setSellablePalettes(palettes);

            return;
        }

        setSelectedPaletteIndex(-1);
        setSellablePalettes([]);

        SendMessageHook(new GetSellablePetPalettesComposer(productData.type));
    }, [ activeOffer, petPalettes ]);

    useEffect(() =>
    {
        if(petIndex === -1) return;

        const colors = GetPetAvailableColors(petIndex, sellablePalettes);

        setSelectedColorIndex((colors.length ? 0 : -1));
        setSellableColors(colors);
    }, [ petIndex, sellablePalettes ]);

    const getColor = useMemo(() =>
    {
        if(!sellableColors.length || (selectedColorIndex === -1)) return 0xFFFFFF;

        return sellableColors[selectedColorIndex][0];
    }, [ sellableColors, selectedColorIndex ]);

    useEffect(() =>
    {
        if(!roomPreviewer) return;

        roomPreviewer && roomPreviewer.reset(false);

        if((petIndex === -1) || !sellablePalettes.length || (selectedPaletteIndex === -1)) return;

        let petFigureString = `${ petIndex } ${ sellablePalettes[selectedPaletteIndex].paletteId }`;

        if(petIndex <= 7) petFigureString += ` ${ getColor.toString(16) }`;

        roomPreviewer.addPetIntoRoom(petFigureString);
    }, [ roomPreviewer, petIndex, sellablePalettes, selectedPaletteIndex, getColor ]);

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

        while(colorString.length < 6)
        {
            colorString = ('0' + colorString);
        }

        return `${ paletteId }\n${ colorString }`;
    }, [ sellablePalettes, selectedPaletteIndex, petIndex, sellableColors, selectedColorIndex ]);

    if(!activeOffer) return null;

    return (
        <NitroLayoutGrid>
            <NitroLayoutGridColumn size={ 7 }>
                <NitroCardGridView>
                    { !colorsShowing && (sellablePalettes.length > 0) && sellablePalettes.map((palette, index) =>
                        {
                            return (
                                <NitroCardGridItemView key={ index } itemActive={ (selectedPaletteIndex === index) } onClick={ event => setSelectedPaletteIndex(index) }>
                                    <PetImageView typeId={ petIndex } paletteId={ palette.paletteId } direction={ 2 } headOnly={ true } />
                                </NitroCardGridItemView>
                            );
                        })}
                    { colorsShowing && (sellableColors.length > 0) && sellableColors.map((colorSet, index) =>
                        {
                            return (
                                <NitroCardGridItemView key={ index } itemActive={ (selectedColorIndex === index) } itemColor={ ColorConverter.int2rgb(colorSet[0]) } onClick={ event => setSelectedColorIndex(index) } />
                            );
                        })}
                </NitroCardGridView>
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 }>
                { (petIndex === -1) &&
                    <CatalogPageDetailsView pageParser={ pageParser } /> }
                { (petIndex >= 0) &&
                    <>
                        <NitroLayoutFlexColumn overflow="hidden" position="relative">
                            { roomPreviewer && <CatalogRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } /> }
                            { (petIndex > -1 && petIndex <= 7) &&
                                <NitroLayoutBase className="start-2 bottom-2" position="absolute">
                                    <button type="button" className= { 'btn btn-primary btn-sm color-button ' + (colorsShowing ? 'active ' : '') } onClick={ event => setColorsShowing(!colorsShowing) }>
                                        <i className="fas fa-fill-drip" />
                                    </button>
                                </NitroLayoutBase> }
                        </NitroLayoutFlexColumn>
                        <NitroLayoutFlexColumn className="flex-grow-1" gap={ 2 }>
                            <NitroLayoutBase className="flex-grow-1 text-black text-truncate">{ petBreedName }</NitroLayoutBase>
                            <CatalogLayoutPetPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } extra={ petPurchaseString } />
                        </NitroLayoutFlexColumn>
                    </> }
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
