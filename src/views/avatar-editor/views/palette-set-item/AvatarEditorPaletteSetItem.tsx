import { FC, useCallback, useEffect, useState } from 'react';
import { NitroCardGridItemView } from '../../../../layout/card/grid/item/NitroCardGridItemView';
import { AvatarEditorPaletteSetItemProps } from './AvatarEditorPaletteSetItem.types';

export const AvatarEditorPaletteSetItem: FC<AvatarEditorPaletteSetItemProps> = props =>
{
    const { colorItem = null, ...rest } = props;
    const [ updateId, setUpdateId ] = useState(-1);

    const rerender = useCallback(() =>
    {
        setUpdateId(prevValue => (prevValue + 1));
    }, []);

    useEffect(() =>
    {
        colorItem.notify = rerender;

        return () =>
        {
            colorItem.notify = null;
        }
    })

    return <NitroCardGridItemView itemColor={ colorItem.color } itemActive={ colorItem.isSelected } { ...rest } />
}
