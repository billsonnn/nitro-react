import { NitroLayoutBaseProps } from '../../../layout/base';

export interface BadgeImageViewProps extends NitroLayoutBaseProps
{
    badgeCode: string;
    isGroup?: boolean;
    showInfo?: boolean;
    customTitle?: string;
    isGrayscale?: boolean;
    scale?: number;
}
