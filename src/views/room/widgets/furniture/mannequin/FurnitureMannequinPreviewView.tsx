import { FC } from 'react';
import { Base, LayoutCurrencyIcon } from '../../../../../common';
import { AvatarImageView } from '../../../../shared/avatar-image/AvatarImageView';

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
                <LayoutCurrencyIcon className="position-absolute end-2 bottom-2" type="hc" /> }
        </Base>
    );
}
