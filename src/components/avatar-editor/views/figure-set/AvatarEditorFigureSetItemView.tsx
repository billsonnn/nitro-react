import { FC, useCallback, useEffect, useState } from 'react';
import { LayoutGridItem, LayoutGridItemProps } from '../../../../common/layout/LayoutGridItem';
import { CurrencyIcon } from '../../../../views/shared/currency-icon/CurrencyIcon';
import { AvatarEditorGridPartItem } from '../../common/AvatarEditorGridPartItem';
import { AvatarEditorIcon } from '../AvatarEditorIcon';

export interface AvatarEditorFigureSetItemViewProps extends LayoutGridItemProps
{
    partItem: AvatarEditorGridPartItem;
}

export const AvatarEditorFigureSetItemView: FC<AvatarEditorFigureSetItemViewProps> = props =>
{
    const { partItem = null, children = null, ...rest } = props;
    const [ updateId, setUpdateId ] = useState(-1);

    const rerender = useCallback(() =>
    {
        setUpdateId(prevValue => (prevValue + 1));
    }, []);

    useEffect(() =>
    {
        partItem.notify = rerender;

        return () =>
        {
            partItem.notify = null;
        }
    })

    return (
        <LayoutGridItem itemImage={ (partItem.isClear ? undefined : partItem.imageUrl) } itemActive={ partItem.isSelected } { ...rest }>
            { partItem.isHC && <CurrencyIcon className="position-absolute end-1 bottom-1" type={ 'hc' } /> }
            { partItem.isClear && <AvatarEditorIcon icon="clear" /> }
            { partItem.isSellable && <AvatarEditorIcon icon="sellable" position="absolute" className="end-1 bottom-1" /> }
            { children }
        </LayoutGridItem>
    );
}
