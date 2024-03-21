import { CraftableProductsEvent, CraftComposer, CraftingRecipeEvent, CraftingRecipeIngredientParser, CraftingRecipesAvailableEvent, CraftingResultEvent, GetCraftableProductsComposer, GetCraftingRecipeComposer, GetRoomContentLoader, GetRoomEngine, RoomEngineTriggerWidgetEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { ICraftingIngredient, ICraftingRecipe, LocalizeText, SendMessageComposer } from '../../../../api';
import { useMessageEvent, useNitroEvent } from '../../../events';
import { useInventoryFurni } from '../../../inventory';
import { useNotification } from './../../../notification';

const useFurnitureCraftingWidgetState = () =>
{    
    const [ objectId, setObjectId ] = useState(-1);
    const [ recipes, setRecipes ] = useState<ICraftingRecipe[]>([]);
    const [ selectedRecipe, setSelectedRecipe ] = useState<ICraftingRecipe>(null);
    const [ ingredients, setIngredients ] = useState<ICraftingIngredient[]>([]);
    const [ ingredientNames, setIngredientNames ] = useState<string[]>(null);
    const [ cachedIngredients, setCachedIngredients ] = useState<Map<string, CraftingRecipeIngredientParser[]>>(new Map());
    const [ isCrafting, setIsCrafting ] = useState(false);
    const { groupItems = [], getItemsByType = null, activate = null, deactivate = null } = useInventoryFurni();
    const { simpleAlert = null } = useNotification();

    const requiredIngredients = ((selectedRecipe && cachedIngredients.get(selectedRecipe.name) || null));

    const resetData = () =>
    {
        setRecipes([]);
        setSelectedRecipe(null);
        setIngredients([]);
        setCachedIngredients(new Map());
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

    const selectRecipe = (recipe: ICraftingRecipe) =>
    {
        setSelectedRecipe(recipe);
 
        const cache = cachedIngredients.get(recipe.name);

        if(!cache) SendMessageComposer(new GetCraftingRecipeComposer(recipe.name));
    }

    useNitroEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, event => 
    {
        if (event.widget !== RoomWidgetEnum.CRAFTING) return;

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

        setRecipes(prevValue =>
        {
            const newValue: ICraftingRecipe[] = [];

            for(const recipe of parser.recipes)
            {
                //@ts-ignore
                const itemId = GetRoomContentLoader()._activeObjectTypeIds.get(recipe.itemName);
                const iconUrl = GetRoomEngine().getFurnitureFloorIconUrl(itemId);

                newValue.push({
                    name: recipe.recipeName,
                    localizedName: LocalizeText('roomItem.name.' + itemId),
                    iconUrl
                });
            }

            return newValue;
        });

        setIngredientNames(parser.ingredients);
    });

    useMessageEvent<CraftingRecipeEvent>(CraftingRecipeEvent, event =>
    {
        const parser = event.getParser();

        setCachedIngredients(prevValue =>
        {
            const newValue = new Map(prevValue);

            newValue.set(selectedRecipe.name, parser.ingredients);

            return newValue;
        });
    });

    useMessageEvent<CraftingResultEvent>(CraftingResultEvent, event =>
    {
        setSelectedRecipe(null);
        setIsCrafting(false);

        const parser = event.getParser();

        if(parser.result) simpleAlert(LocalizeText('crafting.info.result.ok'));
    });

    useMessageEvent<CraftingRecipesAvailableEvent>(CraftingRecipesAvailableEvent, event =>
    {
    });

    useEffect(() =>
    {
        if(!ingredientNames || !ingredientNames.length) return;

        setIngredients(prevValue =>
        {
            const newValue: ICraftingIngredient[] = [];

            for(const name of ingredientNames)
            {
                //@ts-ignore
                const itemId = GetRoomContentLoader()._activeObjectTypeIds.get(name);
                const iconUrl = GetRoomEngine().getFurnitureFloorIconUrl(itemId);

                const inventoryItems = getItemsByType(itemId);

                let amountAvailable = 0;

                if (inventoryItems) for (const inventoryItem of inventoryItems) amountAvailable += inventoryItem.items.length;

                newValue.push({
                    name: name,
                    iconUrl,
                    count: amountAvailable
                });
            }

            return newValue;
        });
    }, [ groupItems, ingredientNames, getItemsByType ]);

    useEffect(() =>
    {
        if((objectId === -1)) return;

        const id = activate();

        return () => deactivate(id);
    }, [ objectId, activate, deactivate ]);

    return { objectId, recipes, ingredients, selectedRecipe, requiredIngredients, isCrafting, selectRecipe, craft, onClose };
}

export const useFurnitureCraftingWidget = useFurnitureCraftingWidgetState;
