import { ColorConverter, IPartColor } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { GetConfigurationValue } from '../../../../api';
import { LayoutCurrencyIcon, LayoutGridItem, LayoutGridItemProps } from '../../../../common';

export interface AvatarEditorPaletteSetItemProps extends LayoutGridItemProps
{
    setType: string;
    partColor: IPartColor;
    isSelected: boolean;
}

// its disabled if its hc and you dont have it
export const AvatarEditorPaletteSetItem: FC<AvatarEditorPaletteSetItemProps> = props =>
{
    const { setType = null, partColor = null, isSelected = false, ...rest } = props;

    if(!partColor) return null;
    
    const isHC = !GetConfigurationValue<boolean>('hc.disabled', false) && (partColor.clubLevel > 0);

    return (
        <LayoutGridItem itemHighlight itemColor={ ColorConverter.int2rgb(partColor.rgb) } itemActive={ isSelected } className="clear-bg" { ...rest }>
            { isHC && <LayoutCurrencyIcon className="position-absolute end-1 bottom-1" type="hc" /> }
        </LayoutGridItem>
    );
}
