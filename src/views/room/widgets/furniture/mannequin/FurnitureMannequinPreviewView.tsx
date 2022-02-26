import { FC } from 'react';
import { Base } from '../../../../../common';
import { AvatarImageView } from '../../../../shared/avatar-image/AvatarImageView';
import { CurrencyIcon } from '../../../../shared/currency-icon/CurrencyIcon';

interface FurnitureMannequinPreviewViewProps
{
    figure: string;
    clubLevel: number;
}

export const FurnitureMannequinPreviewView: FC<FurnitureMannequinPreviewViewProps> = props =>
{
    const { figure = null, clubLevel = 0 } = props;

    return (
        <Base position="relative" className="mannequin-preview">
            <AvatarImageView figure={ figure } direction={ 2 } />
            { (clubLevel > 0) &&
                <CurrencyIcon className="position-absolute end-2 bottom-2" type="hc" /> }
        </Base>
    );
}
