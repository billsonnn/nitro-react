import { ColorConverter, IPartColor } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { GetConfigurationValue } from '../../../api';
import { LayoutCurrencyIcon, LayoutGridItem, LayoutGridItemProps } from '../../../common';

export const AvatarEditorPaletteSetItem: FC<{
    setType: string;
    partColor: IPartColor;
    isSelected: boolean;
    width?: string;
} & LayoutGridItemProps> = props =>
{
    const { setType = null, partColor = null, isSelected = false, width = '100%', ...rest } = props;

    if(!partColor) return null;
    
    const isHC = !GetConfigurationValue<boolean>('hc.disabled', false) && (partColor.clubLevel > 0);

    return (
        <LayoutGridItem itemHighlight className="clear-bg" itemActive={ isSelected } itemColor={ ColorConverter.int2rgb(partColor.rgb) } { ...rest }>
            { isHC && <LayoutCurrencyIcon className="position-absolute end-1 bottom-1" type="hc" /> }
        </LayoutGridItem>
    );
}
