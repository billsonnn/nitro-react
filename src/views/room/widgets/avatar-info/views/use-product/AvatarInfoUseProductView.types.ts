import { UseProductItem } from '../../../../events';

export interface AvatarInfoUseProductViewProps
{
    item: UseProductItem;
    updateConfirmingProduct: (product: UseProductItem) => void;
    close: () => void;
}
