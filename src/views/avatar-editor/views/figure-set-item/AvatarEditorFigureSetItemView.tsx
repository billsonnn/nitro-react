import { FC, useCallback, useEffect, useState } from 'react';
import { NitroCardGridItemView } from '../../../../layout/card/grid/item/NitroCardGridItemView';
import { CurrencyIcon } from '../../../shared/currency-icon/CurrencyIcon';
import { AvatarEditorFigureSetItemViewProps } from './AvatarEditorFigureSetItemView.types';

export const AvatarEditorFigureSetItemView: FC<AvatarEditorFigureSetItemViewProps> = props =>
{
    const { partItem = null, onClick = null } = props;
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
        <NitroCardGridItemView itemImage={ (partItem.isClear ? undefined : partItem.imageUrl) } itemActive={ partItem.isSelected } onClick={ event => onClick(partItem) }>
            { partItem.isHC && <CurrencyIcon className="position-absolute end-1 bottom-1" type={ 'hc' } /> }
            { partItem.isClear && <i className="icon clear-icon" /> }
            { partItem.isSellable && <i className="position-absolute icon sellable-icon end-1 bottom-1" /> }
        </NitroCardGridItemView>
    );
}
