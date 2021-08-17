import { UseProductItem } from '../../../../../../api';

export interface AvatarInfoUseProductViewProps
{
    item: UseProductItem;
    updateConfirmingProduct: (product: UseProductItem) => void;
    close: () => void;
}
