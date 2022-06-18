import { useBetween } from 'use-between';
import { LocalStorageKeys } from '../../api';
import { useLocalStorage } from '../useLocalStorage';

const useCatalogPlaceMultipleItemsState = () => useLocalStorage(LocalStorageKeys.CATALOG_PLACE_MULTIPLE_OBJECTS, false);

export const useCatalogPlaceMultipleItems = () => useBetween(useCatalogPlaceMultipleItemsState);
