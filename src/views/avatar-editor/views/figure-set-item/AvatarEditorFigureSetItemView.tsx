import { FC, useEffect, useState } from 'react';
import { NitroCardGridItemView } from '../../../../layout/card/grid/item/NitroCardGridItemView';
import { AvatarEditorFigureSetItemViewProps } from './AvatarEditorFigureSetItemView.types';

export const AvatarEditorFigureSetItemView: FC<AvatarEditorFigureSetItemViewProps> = props =>
{
    const { partItem = null, onClick = null } = props;
    const [ imageUrl, setImageUrl ] = useState<string>(null);

    useEffect(() =>
    {
        setImageUrl(partItem.imageUrl);
    }, [ partItem.imageUrl ]);

    return <NitroCardGridItemView itemImage={ imageUrl } onClick={ () => onClick(partItem) } />
}
