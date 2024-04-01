import { FC, useEffect, useState } from 'react';
import { AvatarEditorThumbnailsHelper, GetConfigurationValue, IAvatarEditorCategoryPartItem } from '../../../../api';
import { LayoutCurrencyIcon, LayoutGridItem, LayoutGridItemProps } from '../../../../common';
import { AvatarEditorIcon } from '../AvatarEditorIcon';

export const AvatarEditorFigureSetItemView: FC<{
    setType: string;
    partItem: IAvatarEditorCategoryPartItem;
    isSelected: boolean;
} & LayoutGridItemProps> = props =>
{
    const { setType = null, partItem = null, isSelected = false, ...rest } = props;
    const [ assetUrl, setAssetUrl ] = useState<string>('');

    const isHC = !GetConfigurationValue<boolean>('hc.disabled', false) && ((partItem.partSet?.clubLevel ?? 0) > 0);

    useEffect(() =>
    {
        if(!setType || !setType.length || !partItem) return;
        
        const loadImage = async () =>
        {
            const isHC = !GetConfigurationValue<boolean>('hc.disabled', false) && ((partItem.partSet?.clubLevel ?? 0) > 0);
            const url = await AvatarEditorThumbnailsHelper.build(setType, partItem, partItem.usesColor, isHC);

            if(url && url.length) setAssetUrl(url);
        }

        loadImage();
    }, [ setType, partItem ]);

    if(!partItem || !partItem.partSet) return null;

    return (
        <LayoutGridItem itemImage={ (partItem.isClear ? undefined : assetUrl) } itemActive={ isSelected } style={ { width: '100%' } } { ...rest }>
            { !partItem.isClear && isHC && <LayoutCurrencyIcon className="position-absolute end-1 bottom-1" type="hc" /> }
            { partItem.isClear && <AvatarEditorIcon icon="clear" /> }
            { !partItem.isClear && partItem.partSet.isSellable && <AvatarEditorIcon icon="sellable" position="absolute" className="end-1 bottom-1" /> }
        </LayoutGridItem>
    );
}
