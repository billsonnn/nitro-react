import { FC, useEffect, useState } from 'react';
import { AvatarEditorThumbnailsHelper, FigureData, GetConfigurationValue, IAvatarEditorCategoryPartItem } from '../../../../api';
import { LayoutCurrencyIcon, LayoutGridItem, LayoutGridItemProps } from '../../../../common';
import { useAvatarEditor } from '../../../../hooks';
import { AvatarEditorIcon } from '../AvatarEditorIcon';

export const AvatarEditorFigureSetItemView: FC<{
    setType: string;
    partItem: IAvatarEditorCategoryPartItem;
    isSelected: boolean;
} & LayoutGridItemProps> = props =>
{
    const { setType = null, partItem = null, isSelected = false, ...rest } = props;
    const [ assetUrl, setAssetUrl ] = useState<string>('');
    const { selectedColorParts = null, getFigureStringWithFace = null } = useAvatarEditor();

    const isHC = !GetConfigurationValue<boolean>('hc.disabled', false) && ((partItem.partSet?.clubLevel ?? 0) > 0);

    useEffect(() =>
    {
        if(!setType || !setType.length || !partItem) return;
        
        const loadImage = async () =>
        {
            const isHC = !GetConfigurationValue<boolean>('hc.disabled', false) && ((partItem.partSet?.clubLevel ?? 0) > 0);

            let url: string = null;

            if(setType === FigureData.FACE)
            {
                url = await AvatarEditorThumbnailsHelper.buildForFace(getFigureStringWithFace(partItem.id), isHC);
            }
            else
            {
                url = await AvatarEditorThumbnailsHelper.build(setType, partItem, partItem.usesColor, selectedColorParts[setType] ?? null, isHC);
            }

            if(url && url.length) setAssetUrl(url);
        }

        loadImage();
    }, [ setType, partItem, selectedColorParts, getFigureStringWithFace ]);

    if(!partItem) return null;

    return (
        <LayoutGridItem itemImage={ (partItem.isClear ? undefined : assetUrl) } itemActive={ isSelected } style={ { width: '100%', 'flex': '1' } } { ...rest }>
            { !partItem.isClear && isHC && <LayoutCurrencyIcon className="position-absolute end-1 bottom-1" type="hc" /> }
            { partItem.isClear && <AvatarEditorIcon icon="clear" /> }
            { !partItem.isClear && partItem.partSet.isSellable && <AvatarEditorIcon icon="sellable" position="absolute" className="end-1 bottom-1" /> }
        </LayoutGridItem>
    );
}
