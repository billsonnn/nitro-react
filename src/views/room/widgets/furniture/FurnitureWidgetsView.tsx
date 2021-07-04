import { FC } from 'react';
import { FurnitureBackgroundColorView } from './background-color/FurnitureBackgroundColorView';
import { FurnitureDimmerView } from './dimmer/FurnitureDimmerView';
import { FurnitureEngravingLockView } from './engraving-lock/FurnitureEngravingLockView';
import { FurnitureExchangeCreditView } from './exchange-credit/FurnitureExchangeCreditView';
import { FurnitureWidgetsViewProps } from './FurnitureWidgetsView.types';
import { FurnitureHighScoreView } from './high-score/FurnitureHighScoreView';
import { FurnitureManipulationMenuView } from './manipulation-menu/FurnitureManipulationMenuView';
import { FurnitureMannequinView } from './mannequin/FurnitureMannequinView';
import { FurniturePresentView } from './present/FurniturePresentView';
import { FurnitureStickieView } from './stickie/FurnitureStickieView';
import { FurnitureTrophyView } from './trophy/FurnitureTrophyView';

export const FurnitureWidgetsView: FC<FurnitureWidgetsViewProps> = props =>
{
    return (
        <div className="position-absolute nitro-room-widgets t-0 l-0">
            <FurnitureBackgroundColorView />
            <FurnitureDimmerView />
            <FurnitureEngravingLockView />
            <FurnitureExchangeCreditView />
            <FurnitureHighScoreView />
            <FurnitureManipulationMenuView />
            <FurnitureMannequinView />
            <FurniturePresentView />
            <FurnitureStickieView />
            <FurnitureTrophyView />
        </div>
    );
}
