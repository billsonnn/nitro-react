import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { GetRoomEngine, IsOwnerOfFurniture, LocalizeText } from '../../../../api';
import { AutoGrid, Button, Column, Flex, LayoutGridItem, LayoutLoadingSpinnerView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useFurnitureCraftingWidget, useRoom } from '../../../../hooks';

export const FurnitureCraftingView: FC<{}> = props =>
{
    const { objectId = -1, recipes = [], ingredients = [], selectedRecipe = null, requiredIngredients = null, isCrafting = false, craft = null, selectRecipe = null, onClose = null } = useFurnitureCraftingWidget();
    const { roomSession = null } = useRoom();
    const [ waitingToConfirm, setWaitingToConfirm ] = useState(false);

    const isOwner = useMemo(() =>
    {
        const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, objectId, RoomObjectCategory.FLOOR);
        return IsOwnerOfFurniture(roomObject);
    }, [ objectId, roomSession.roomId ]);

    const canCraft = useMemo(() =>
    {
        if(!requiredIngredients || !requiredIngredients.length) return false;

        for (const ingredient of requiredIngredients) 
        {
            const ingredientData = ingredients.find(data => (data.name === ingredient.itemName));


            if (!ingredientData || ingredientData.count < ingredient.count) return false;
        }

        return true;
    }, [ ingredients, requiredIngredients ]);

    const tryCraft = () =>
    {
        if (!waitingToConfirm) 
        {
            setWaitingToConfirm(true);

            return;
        }

        craft();
        setWaitingToConfirm(false);
    };

    useEffect(() =>
    {
        setWaitingToConfirm(false);
    }, [ selectedRecipe ]);

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-widget-crafting" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('crafting.title') } onCloseClick={ onClose } />
            <NitroCardContentView>
                <Flex grow overflow="hidden" gap={ 2 }>
                    <Flex column fullWidth gap={ 2 }>
                        <Column overflow="hidden" fullHeight>
                            <div className="bg-muted rounded py-1 text-center">{ LocalizeText('crafting.title.products') }</div>
                            <AutoGrid columnCount={ 5 }>
                                { (recipes.length > 0) && recipes.map((item) => <LayoutGridItem key={ item.name } itemImage={ item.iconUrl } itemActive={ selectedRecipe && selectedRecipe.name === item.name } onClick={ () => selectRecipe(item) } />) }
                            </AutoGrid>
                        </Column>
                        <Column overflow="hidden" fullHeight>
                            <div className="bg-muted rounded py-1 text-center">{ LocalizeText('crafting.title.mixer') }</div>
                            <AutoGrid columnCount={ 5 }>
                                { (ingredients.length > 0) && ingredients.map((item) => <LayoutGridItem key={ item.name } itemImage={ item.iconUrl } itemCount={ item.count } itemCountMinimum={ 0 } className={ (!item.count ? 'opacity-0-5 ' : '') + 'cursor-default' } />) }
                            </AutoGrid>
                        </Column>
                    </Flex>
                    <Flex column fullWidth gap={ 2 }>
                        { !selectedRecipe && <Column center fullHeight className="text-black text-center">{ LocalizeText('crafting.info.start') }</Column> }
                        { selectedRecipe && <>
                            <Column overflow="hidden" fullHeight>
                                <div className="bg-muted rounded py-1 text-center">{ LocalizeText('crafting.current_recipe') }</div>
                                <AutoGrid columnCount={ 5 }>
                                    { !!requiredIngredients && (requiredIngredients.length > 0) && requiredIngredients.map(ingredient =>
                                    {
                                        const ingredientData = ingredients.find((i) => i.name === ingredient.itemName);

                                        const elements: ReactElement[] = [];

                                        for (let i = 0; i < ingredient.count; i++)
                                        {
                                            elements.push(<LayoutGridItem key={ i } itemImage={ ingredientData.iconUrl } className={ (ingredientData.count - (i) <= 0 ? 'opacity-0-5 ' : '') + 'cursor-default' } />);
                                        }

                                        return elements;
                                    }) }
                                </AutoGrid>
                            </Column>
                            <Flex gap={ 2 } column fullHeight>
                                <Flex gap={ 2 } className="bg-muted rounded" column fullHeight>
                                    <div className="py-1 text-center">{ LocalizeText('crafting.result') }</div>
                                    <Flex gap={ 1 } center column fullHeight className="pb-1">
                                        <Column fullHeight>
                                            <img src={ selectedRecipe.iconUrl } />
                                        </Column>
                                        <div className="text-black">{ selectedRecipe.localizedName }</div>
                                    </Flex>
                                </Flex>
                                <Button variant={ !isOwner || !canCraft ? 'danger' : waitingToConfirm ? 'warning' : isCrafting ? 'primary' : 'success' } disabled={ !isOwner || !canCraft || isCrafting } onClick={ tryCraft }>
                                    { !isCrafting && LocalizeText(!isOwner ? 'crafting.btn.notowner' : !canCraft ? 'crafting.status.recipe.incomplete' : waitingToConfirm ? 'generic.confirm' : 'crafting.btn.craft') }
                                    { isCrafting && <LayoutLoadingSpinnerView /> }
                                </Button>
                            </Flex>
                        </> }
                    </Flex>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
