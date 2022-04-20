import { useBetween } from 'use-between';
import { LocalStorageKeys } from '../../api';
import { useLocalStorage } from '../useLocalStorage';

const useCatalogSkipPurchaseConfirmationState = () => useLocalStorage(LocalStorageKeys.CATALOG_SKIP_PURCHASE_CONFIRMATION, false);

export const useCatalogSkipPurchaseConfirmation = () => useBetween(useCatalogSkipPurchaseConfirmationState);
