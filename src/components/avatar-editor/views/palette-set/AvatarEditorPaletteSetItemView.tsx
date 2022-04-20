import { FC, useCallback, useEffect, useState } from 'react';
import { GetConfiguration } from '../../../../api';
import { LayoutCurrencyIcon, LayoutGridItem, LayoutGridItemProps } from '../../../../common';
import { AvatarEditorGridColorItem } from '../../common/AvatarEditorGridColorItem';

export interface AvatarEditorPaletteSetItemProps extends LayoutGridItemProps
{
    colorItem: AvatarEditorGridColorItem;
}

export const AvatarEditorPaletteSetItem: FC<AvatarEditorPaletteSetItemProps> = props =>
{
    const { colorItem = null, children = null, ...rest } = props;
    const [ updateId, setUpdateId ] = useState(-1);

    const hcDisabled = GetConfiguration<boolean>('hc.disabled', false);

    const rerender = useCallback(() =>
    {
        setUpdateId(prevValue => (prevValue + 1));
    }, []);

    useEffect(() =>
    {
        colorItem.notify = rerender;

        return () => colorItem.notify = null;
    });

    return (
        <LayoutGridItem itemHighlight itemColor={ colorItem.color } itemActive={ colorItem.isSelected } className="clear-bg" { ...rest }>
            { !hcDisabled && colorItem.isHC && <LayoutCurrencyIcon className="position-absolute end-1 bottom-1" type="hc" /> }
            { children }
        </LayoutGridItem>
    );
}
