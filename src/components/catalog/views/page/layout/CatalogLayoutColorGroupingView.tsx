import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColorConverter } from '@nitrots/nitro-renderer';
import { FC, useMemo, useState } from 'react';
import { IPurchasableOffer } from '../../../../../api';
import { AutoGrid, Base, Button, Column, Flex, Grid, LayoutGridItem, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogGridOfferView } from '../common/CatalogGridOfferView';
import { CatalogAddOnBadgeWidgetView } from '../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogLimitedItemWidgetView } from '../widgets/CatalogLimitedItemWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSpinnerWidgetView } from '../widgets/CatalogSpinnerWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export interface CatalogLayoutColorGroupViewProps extends CatalogLayoutProps
{

}

export const CatalogLayoutColorGroupingView : FC<CatalogLayoutColorGroupViewProps> = props =>
{
    const { page = null } = props;
    const [ colorableItems, setColorableItems ] = useState<Map<string, number[]>>(new Map<string, number[]>());
    const { currentOffer = null, setCurrentOffer = null } = useCatalog();
    const [ colorsShowing, setColorsShowing ] = useState<boolean>(false);

    const sortByColorIndex = (a: IPurchasableOffer, b: IPurchasableOffer) =>
    {
        if (((!(a.product.furnitureData.colorIndex)) || (!(b.product.furnitureData.colorIndex))))
        {
            return 1;
        }
        if (a.product.furnitureData.colorIndex > b.product.furnitureData.colorIndex)
        {
            return 1;
        }
        if (a == b)
        {
            return 0;
        }
        return -1;
    }

    const sortyByFurnitureClassName = (a: IPurchasableOffer, b: IPurchasableOffer) =>
    {
        if (a.product.furnitureData.className > b.product.furnitureData.className)
        {
            return 1;
        }
        if (a == b)
        {
            return 0;
        }
        return -1;
    }

    const selectOffer = (offer: IPurchasableOffer) =>
    {
        offer.activate();
        setCurrentOffer(offer);
    }

    const selectColor = (colorIndex: number, productName: string) =>
    {
        const fullName = `${ productName }*${ colorIndex }`;
        const index = page.offers.findIndex(offer => offer.product.furnitureData.fullName === fullName);
        if (index > -1)
        {
            selectOffer(page.offers[index]);
        }
    }

    const offers = useMemo(() =>
    {
        const offers: IPurchasableOffer[] = [];
        const addedColorableItems = new Map<string, boolean>();
        const updatedColorableItems = new Map<string, number[]>();

        page.offers.sort(sortByColorIndex);

        let selectedColor = 0;

        page.offers.forEach(offer =>
        {
            if(!offer.product) return;

            const furniData = offer.product.furnitureData;

            if(((!(furniData)) || (!furniData.hasIndexedColor)))
            {
                offers.push(offer);
            }
            else
            {
                const name = furniData.className;
                const colorIndex = furniData.colorIndex;

                if(!updatedColorableItems.has(name))
                {
                    updatedColorableItems.set(name, []);
                }

                if(furniData.colors)
                {
                    for(let color of furniData.colors)
                    {
                        if(color !== 0xFFFFFF) // for some reason we hate the color white
                        {
                            selectedColor = color;
                        }
                    }

                    if(updatedColorableItems.get(name).indexOf(selectedColor) === -1)
                    {
                        updatedColorableItems.get(name)[colorIndex] = selectedColor;
                    }

                }

                if(!addedColorableItems.has(name))
                {
                    offers.push(offer);
                    addedColorableItems.set(name, true);
                }
            }
        });
        offers.sort(sortyByFurnitureClassName);
        setColorableItems(updatedColorableItems);
        return offers;
    }, [ page.offers ]);

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <AutoGrid columnCount={ 5 }>
                    { (!colorsShowing || !currentOffer || !colorableItems.has(currentOffer.product.furnitureData.className)) &&
                        offers.map((offer, index) => <CatalogGridOfferView key={ index } itemActive={ (currentOffer && (currentOffer.product.furnitureData.hasIndexedColor ? currentOffer.product.furnitureData.className === offer.product.furnitureData.className : currentOffer.offerId === offer.offerId)) } offer={ offer } selectOffer={ selectOffer }/>)
                    }
                    { (colorsShowing && currentOffer && colorableItems.has(currentOffer.product.furnitureData.className)) &&
                        colorableItems.get(currentOffer.product.furnitureData.className).map((color, index) => <LayoutGridItem itemHighlight key={ index } itemActive={ (currentOffer.product.furnitureData.colorIndex === index) } itemColor={ ColorConverter.int2rgb(color) } className="clear-bg" onClick={ event => selectColor(index, currentOffer.product.furnitureData.className) } />)
                    }
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
                            { currentOffer.product.furnitureData.hasIndexedColor &&
                                <Button position="absolute" className="bottom-1 start-1" onClick={ event =>setColorsShowing(prev => !prev) }>
                                    <FontAwesomeIcon icon="fill-drip" />
                                </Button> }
                        </Base>
                        <Column grow gap={ 1 }>
                            <CatalogLimitedItemWidgetView fullWidth />
                            <Text grow truncate>{ currentOffer.localizationName }</Text>
                            <Flex justifyContent="between">
                                <Column gap={ 1 }>
                                    <CatalogSpinnerWidgetView />
                                </Column>
                                <CatalogTotalPriceWidget justifyContent="end" alignItems="end" />
                            </Flex>
                            <CatalogPurchaseWidgetView />
                        </Column>
                    </> }
            </Column>
        </Grid>
    );
}
