import { Dispatch, SetStateAction } from 'react';

export interface CatalogSelectGroupViewProps
{
    selectedGroupIndex: number;
    setSelectedGroupIndex: Dispatch<SetStateAction<number>>;
}
