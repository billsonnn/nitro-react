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
        <NitroCardGridItemView itemImage={ partItem.imageUrl } itemActive={ partItem.isSelected } onClick={ () => onClick(partItem) }>
            { partItem.isHC && <CurrencyIcon type={ 'hc' } /> }
        </NitroCardGridItemView>
    );
}
