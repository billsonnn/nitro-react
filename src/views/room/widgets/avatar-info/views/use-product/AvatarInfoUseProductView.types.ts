import { Dispatch, SetStateAction } from 'react';
import { UseProductItem } from '../../../../events';

export interface AvatarInfoUseProductViewProps
{
    item: UseProductItem;
    setConfirmingProduct: Dispatch<SetStateAction<UseProductItem>>;
    close: () => void;
}
