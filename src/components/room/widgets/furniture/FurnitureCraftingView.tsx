import { GetRoomEngine, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { IsOwnerOfFurniture, LocalizeText } from '../../../../api';
import { AutoGrid, Button, Column, LayoutGridItem, LayoutLoadingSpinnerView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
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

        for(const ingredient of requiredIngredients)
        {
            const ingredientData = ingredients.find(data => (data.name === ingredient.itemName));


            if(!ingredientData || ingredientData.count < ingredient.count) return false;
        }

        return true;
    }, [ ingredients, requiredIngredients ]);

    const tryCraft = () =>
    {
        if(!waitingToConfirm)
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
                <div className="flex !flex-grow gap-2 overflow-hidden">
                    <div className="flex flex-col w-full gap-2">
                        <Column fullHeight overflow="hidden">
                            <div className="bg-muted rounded py-1 text-center">{ LocalizeText('crafting.title.products') }</div>
                            <AutoGrid columnCount={ 5 }>
                                { (recipes.length > 0) && recipes.map((item) => <LayoutGridItem key={ item.name } itemActive={ selectedRecipe && selectedRecipe.name === item.name } itemImage={ item.iconUrl } onClick={ () => selectRecipe(item) } />) }
                            </AutoGrid>
                        </Column>
                        <Column fullHeight overflow="hidden">
                            <div className="bg-muted rounded py-1 text-center">{ LocalizeText('crafting.title.mixer') }</div>
                            <AutoGrid columnCount={ 5 }>
                                { (ingredients.length > 0) && ingredients.map((item) => <LayoutGridItem key={ item.name } className={ (!item.count ? 'opacity-0-5 ' : '') + 'cursor-default' } itemCount={ item.count } itemCountMinimum={ 0 } itemImage={ item.iconUrl } />) }
                            </AutoGrid>
                        </Column>
                    </div>
                    <div className="flex flex-col w-full gap-2">
                        { !selectedRecipe && <Column center fullHeight className="text-black text-center">{ LocalizeText('crafting.info.start') }</Column> }
                        { selectedRecipe && <>
                            <div className="flex flex-col h-full overflow-hidden">
                                <div className="bg-muted rounded py-1 text-center">{ LocalizeText('crafting.current_recipe') }</div>
                                <AutoGrid columnCount={ 5 }>
                                    { !!requiredIngredients && (requiredIngredients.length > 0) && requiredIngredients.map(ingredient =>
                                    {
                                        const ingredientData = ingredients.find((i) => i.name === ingredient.itemName);

                                        const elements: ReactElement[] = [];

                                        for(let i = 0; i < ingredient.count; i++)
                                        {
                                            elements.push(<LayoutGridItem key={ i } className={ (ingredientData.count - (i) <= 0 ? 'opacity-0-5 ' : '') + 'cursor-default' } itemImage={ ingredientData.iconUrl } />);
                                        }

                                        return elements;
                                    }) }
                                </AutoGrid>
                            </div>
                            <div className="flex flex-col h-full gap-2">
                                <div className="flex flex-col h-full bg-muted rounded gap-2">
                                    <div className="py-1 text-center">{ LocalizeText('crafting.result') }</div>
                                    <div className="flex items-center justify-center flex-col h-full pb-1 gap-1">
                                        <div className="flex flex-col h-full">
                                            <img src={ selectedRecipe.iconUrl } />
                                        </div>
                                        <div className="text-black">{ selectedRecipe.localizedName }</div>
                                    </div>
                                </div>
                                <Button disabled={ !isOwner || !canCraft || isCrafting } variant={ !isOwner || !canCraft ? 'danger' : waitingToConfirm ? 'warning' : isCrafting ? 'primary' : 'success' } onClick={ tryCraft }>
                                    { !isCrafting && LocalizeText(!isOwner ? 'crafting.btn.notowner' : !canCraft ? 'crafting.status.recipe.incomplete' : waitingToConfirm ? 'generic.confirm' : 'crafting.btn.craft') }
                                    { isCrafting && <LayoutLoadingSpinnerView /> }
                                </Button>
                            </div>
                        </> }
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
