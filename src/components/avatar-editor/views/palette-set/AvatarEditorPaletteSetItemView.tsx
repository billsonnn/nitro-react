import { FC, useEffect, useState } from 'react';
import { AvatarEditorGridColorItem, GetConfigurationValue } from '../../../../api';
import { LayoutCurrencyIcon, LayoutGridItem, LayoutGridItemProps } from '../../../../common';

export interface AvatarEditorPaletteSetItemProps extends LayoutGridItemProps
{
    colorItem: AvatarEditorGridColorItem;
}

export const AvatarEditorPaletteSetItem: FC<AvatarEditorPaletteSetItemProps> = props =>
{
    const { colorItem = null, children = null, ...rest } = props;
    const [ updateId, setUpdateId ] = useState(-1);

    const hcDisabled = GetConfigurationValue<boolean>('hc.disabled', false);

    useEffect(() =>
    {
        const rerender = () => setUpdateId(prevValue => (prevValue + 1));

        colorItem.notify = rerender;

        return () => colorItem.notify = null;
    }, [ colorItem ]);

    return (
        <LayoutGridItem itemHighlight itemColor={ colorItem.color } itemActive={ colorItem.isSelected } className="clear-bg" { ...rest }>
            { !hcDisabled && colorItem.isHC && <LayoutCurrencyIcon className="position-absolute end-1 bottom-1" type="hc" /> }
            { children }
        </LayoutGridItem>
    );
}
