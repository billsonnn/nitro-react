import { FC } from 'react';
import { FurnitureBackgroundColorView } from './background-color/FurnitureBackgroundColorView';
import { FurnitureBadgeDisplayView } from './badge-display/FurnitureBadgeDisplayView';
import { FurnitureContextMenuView } from './context-menu/FurnitureContextMenuView';
import { FurnitureCustomStackHeightView } from './custom-stack-height/FurnitureCustomStackHeightView';
import { FurnitureDimmerView } from './dimmer/FurnitureDimmerView';
import { FurnitureExchangeCreditView } from './exchange-credit/FurnitureExchangeCreditView';
import { FurnitureExternalImageView } from './external-image/FurnitureExternalImageView';
import { FurnitureFriendFurniView } from './friend-furni/FurnitureFriendFurniView';
import { FurnitureHighScoreView } from './high-score/FurnitureHighScoreView';
import { FurnitureManipulationMenuView } from './manipulation-menu/FurnitureManipulationMenuView';
import { FurnitureMannequinView } from './mannequin/FurnitureMannequinView';
import { FurniturePresentView } from './present/FurniturePresentView';
import { FurnitureStickieView } from './stickie/FurnitureStickieView';
import { FurnitureTrophyView } from './trophy/FurnitureTrophyView';

export const FurnitureWidgetsView: FC<{}> = props =>
{
    return (
        <div className="position-absolute nitro-room-widgets top-0 start-0">
            <FurnitureBackgroundColorView />
            <FurnitureContextMenuView />
            <FurnitureCustomStackHeightView />
            <FurnitureDimmerView />
            <FurnitureFriendFurniView />
            <FurnitureExchangeCreditView />
            <FurnitureHighScoreView />
            <FurnitureManipulationMenuView />
            <FurnitureMannequinView />
            <FurniturePresentView />
            <FurnitureStickieView />
            <FurnitureTrophyView />
            <FurnitureBadgeDisplayView />
            <FurnitureExternalImageView />
        </div>
    );
}
