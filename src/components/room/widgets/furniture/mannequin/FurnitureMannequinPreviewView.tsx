import { FC } from 'react';
import { Base, LayoutAvatarImageView, LayoutCurrencyIcon } from '../../../../../common';

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
            <LayoutAvatarImageView figure={ figure } direction={ 2 } />
            { (clubLevel > 0) &&
                <LayoutCurrencyIcon className="position-absolute end-2 bottom-2" type="hc" /> }
        </Base>
    );
}
