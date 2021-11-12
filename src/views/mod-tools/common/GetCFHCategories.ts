import { CallForHelpCategoryData } from '@nitrots/nitro-renderer';

let cfhCategories: CallForHelpCategoryData[] = [];

export const SetCfhCategories = (categories: CallForHelpCategoryData[]) => (cfhCategories = categories);

export const GetCfhCategories = () => cfhCategories;
