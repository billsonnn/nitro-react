import { FC } from 'react';
import { NitroLayoutBase } from '../../../../../../../layout/base';
import { AvatarImageView } from '../../../../../../shared/avatar-image/AvatarImageView';
import { CurrencyIcon } from '../../../../../../shared/currency-icon/CurrencyIcon';
import { FurnitureMannequinPreviewViewProps } from './FurnitureMannequinPreviewView.types';

export const FurnitureMannequinPreviewView: FC<FurnitureMannequinPreviewViewProps> = props =>
{
    const { figure = null, clubLevel = 0 } = props;

    return (
        <NitroLayoutBase className="mannequin-preview" position="relative">
            <AvatarImageView figure={ figure } direction={ 2 } />
            { (clubLevel > 0) && <CurrencyIcon className="position-absolute end-2 bottom-2" type="hc" /> }
        </NitroLayoutBase>
    );
}
