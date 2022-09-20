import { CraftComposer, CraftingRecipeIngredientParser, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { GetRoomEngine, IsOwnerOfFurniture, LocalizeText, SendMessageComposer } from '../../../../api';
import { AutoGrid, Button, Column, Flex, LayoutGridItem, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useFurnitureCraftingWidget, useInventoryFurni, useRoom } from '../../../../hooks';

export const FurnitureCraftingView: FC<{}> = props =>
{
    const { objectId = -1, recipes = [], ingredients = [], selectedRecipe = null, selectedRecipeIngredients = null, selectRecipe = null, onClose = null } = useFurnitureCraftingWidget();
    const { activate, deactivate } = useInventoryFurni();
    const { roomSession = null } = useRoom();

    const [ craftCounter, setCraftCounter ] = useState(0);
    const [ tryingToCraft, setTryingToCraft ] = useState(false);
    const [ craftInterval, setCraftInterval ] = useState(null);

    const isOwner = useMemo(() =>
    {
        const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, objectId, RoomObjectCategory.FLOOR);
        return IsOwnerOfFurniture(roomObject);
    }, [ objectId, roomSession.roomId ]);

    const canCraft = useMemo(() =>
    {
        for (const ingredient of selectedRecipeIngredients) 
        {
            const ingredientData = ingredients.find((i) => i.name === ingredient.itemName);

            if (ingredientData.count < ingredient.count) return false;
        }

        return true;
    }, [ ingredients, selectedRecipeIngredients ]);

    const cancelCraft = () =>
    {
        setTryingToCraft(false);
        setCraftCounter(0);
        clearInterval(craftInterval);
    };

    const tryCraft = () =>
    {
        if (tryingToCraft) 
        {
            cancelCraft();
            return;
        }

        setCraftCounter(5);
        setTryingToCraft(true);
        setCraftInterval(setInterval(() => setCraftCounter(v => v - 1), 1000));
    };

    useEffect(() =>
    {
        if (craftCounter <= 0 && tryingToCraft) 
        {
            clearInterval(craftInterval);
            setCraftInterval(null);
            setTryingToCraft(false);
            craft();
        }
    }, [ craftCounter ]);

    const craft = useCallback(() =>
    {
        if (!selectedRecipe) return;

        SendMessageComposer(new CraftComposer(objectId, selectedRecipe.name));
    }, [ objectId, selectedRecipe ]);

    const renderSelectedRecipeIngredient = (ingredient: CraftingRecipeIngredientParser) =>
    {
        const ingredientData = ingredients.find((i) => i.name === ingredient.itemName);

        const elements = [];

        for (let i = 0; i < ingredient.count; i++)
        {
            elements.push(<LayoutGridItem key={ i } itemImage={ ingredientData.iconUrl } className={ (ingredientData.count - (i) <= 0 ? 'opacity-0-5 ' : '') + 'cursor-default' } />);
        }

        return elements;
    };

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
                                    { (selectedRecipeIngredients.length > 0) && selectedRecipeIngredients.map((item) => renderSelectedRecipeIngredient(item)) }
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
                                <Button variant={ !isOwner || !canCraft ? 'danger' : tryingToCraft ? 'warning' : 'success' } disabled={ !isOwner || !canCraft } onClick={ tryCraft }>
                                    { LocalizeText(!isOwner ? 'crafting.btn.notowner' : !canCraft ? 'crafting.status.recipe.incomplete' : tryingToCraft ? 'generic.cancel' : 'crafting.btn.craft') }
                                </Button>
                            </Flex>
                        </> }
                    </Flex>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
