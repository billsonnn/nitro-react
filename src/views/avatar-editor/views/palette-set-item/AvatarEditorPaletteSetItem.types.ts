import { DetailsHTMLAttributes } from 'react';
import { AvatarEditorGridColorItem } from '../../common/AvatarEditorGridColorItem';

export interface AvatarEditorPaletteSetItemProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    colorItem: AvatarEditorGridColorItem;
}
