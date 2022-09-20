import { CraftableProductsEvent, CraftComposer, CraftingRecipeEvent, CraftingRecipeIngredientParser, CraftingRecipesAvailableEvent, CraftingResultEvent, GetCraftableProductsComposer, GetCraftingRecipeComposer, RoomEngineTriggerWidgetEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { useCallback, useState } from 'react';
import { GetRoomEngine, LocalizeText, SendMessageComposer } from '../../../../api';
import { useMessageEvent, useRoomEngineEvent } from '../../../events';
import { useInventoryFurni } from '../../../inventory';
import { useNotification } from './../../../notification/useNotification';

const useFurnitureCraftingWidgetState = () =>
{
    const { getItemsByType } = useInventoryFurni();
    const { simpleAlert } = useNotification();
    
    const [ objectId, setObjectId ] = useState(-1);
    const [ recipes, setRecipes ] = useState<{ name: string, localizedName: string, iconUrl: string }[]>([]);
    const [ ingredients, setIngredients ] = useState<{ name: string, iconUrl: string, count: number }[]>([]);
    const [ selectedRecipe, setSelectedRecipe ] = useState<{ name: string, localizedName: string, iconUrl: string }>(null);
    const [ selectedRecipeIngredients, setSelectedRecipeIngredients ] = useState<CraftingRecipeIngredientParser[]>([]);
    const [ cacheRecipeIngredients, setCacheRecipeIngredients ] = useState<Map<string, CraftingRecipeIngredientParser[]>>(new Map());
    const [ isCrafting, setIsCrafting ] = useState(false);

    const resetData = () =>
    {
        setRecipes([]);
        setIngredients([]);
        setSelectedRecipe(null);
        setSelectedRecipeIngredients([]);
        setCacheRecipeIngredients(new Map());
    };

    const onClose = () =>
    {
        setObjectId(-1);
        resetData();
    };

    const craft = () =>
    {
        setIsCrafting(true);
        SendMessageComposer(new CraftComposer(objectId, selectedRecipe.name));
    };

    const selectRecipe = useCallback((recipe: { name: string, localizedName: string, iconUrl: string }) =>
    {
        setSelectedRecipeIngredients([]);
        setSelectedRecipe(recipe);
 
        const cache = cacheRecipeIngredients.get(recipe.name);

        if (cache)
            setSelectedRecipeIngredients(cache);
        else
            SendMessageComposer(new GetCraftingRecipeComposer(recipe.name));
    }, [ cacheRecipeIngredients ]);

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, event => 
    {
        if (event.widget !== RoomWidgetEnum.CRAFTING) return;
        console.log(event);
        setObjectId(event.objectId);
        resetData();
        SendMessageComposer(new GetCraftableProductsComposer(event.objectId));
    });

    useMessageEvent<CraftableProductsEvent>(CraftableProductsEvent, event =>
    {
        const parser = event.getParser();

        if (!parser.isActive()) 
        {
            setObjectId(-1);
            return;
        }

        const recipesToSet = [];

        for(const recipe of parser.recipes)
        {
            //@ts-ignore
            const itemId = GetRoomEngine().roomContentLoader._activeObjectTypeIds.get(recipe.itemName);
            const iconUrl = GetRoomEngine().getFurnitureFloorIconUrl(itemId);
            recipesToSet.push({
                name: recipe.itemName,
                localizedName: LocalizeText('roomItem.name.' + itemId),
                iconUrl
            });
        }

        setRecipes(recipesToSet);

        const ingredientsToSet = [];

        for(const ingredient of parser.ingredients)
        {
            //@ts-ignore
            const itemId = GetRoomEngine().roomContentLoader._activeObjectTypeIds.get(ingredient);
            const iconUrl = GetRoomEngine().getFurnitureFloorIconUrl(itemId);

            const inventoryItems = getItemsByType(itemId);
            let amountAvailable = 0;

            for (const inventoryItem of inventoryItems) amountAvailable += inventoryItem.items.length;

            ingredientsToSet.push({
                name: ingredient,
                iconUrl,
                count: amountAvailable
            });
        }
        
        setIngredients(ingredientsToSet);
    });

    useMessageEvent<CraftingRecipeEvent>(CraftingRecipeEvent, event =>
    {
        const parser = event.getParser();
        setSelectedRecipeIngredients(parser.ingredients);

        const newCache = new Map(cacheRecipeIngredients);
        newCache.set(selectedRecipe.name, parser.ingredients);
        setCacheRecipeIngredients(newCache);
    });

    useMessageEvent<CraftingResultEvent>(CraftingResultEvent, event =>
    {
        setSelectedRecipe(null);
        setSelectedRecipeIngredients([]);

        const parser = event.getParser();

        if (parser.result)
        {
            simpleAlert(LocalizeText('crafting.info.result.ok'));
        }

        setIsCrafting(false);
    });

    useMessageEvent<CraftingRecipesAvailableEvent>(CraftingRecipesAvailableEvent, event =>
    {
    });

    return { objectId, recipes, ingredients, selectedRecipe, selectedRecipeIngredients, isCrafting, selectRecipe, craft, onClose };
}

export const useFurnitureCraftingWidget = useFurnitureCraftingWidgetState;
