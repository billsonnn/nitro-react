import { FC } from 'react';
import { Base } from '../../../../common';
import { FurnitureContextMenuView } from './context-menu/FurnitureContextMenuView';
import { FurnitureDimmerView } from './dimmer/FurnitureDimmerView';
import { FurnitureBackgroundColorView } from './FurnitureBackgroundColorView';
import { FurnitureBadgeDisplayView } from './FurnitureBadgeDisplayView';
import { FurnitureCustomStackHeightView } from './FurnitureCustomStackHeightView';
import { FurnitureExchangeCreditView } from './FurnitureExchangeCreditView';
import { FurnitureExternalImageView } from './FurnitureExternalImageView';
import { FurnitureFriendFurniView } from './FurnitureFriendFurniView';
import { FurnitureGiftOpeningView } from './FurnitureGiftOpeningView';
import { FurnitureManipulationMenuView } from './FurnitureManipulationMenuView';
import { FurnitureMannequinView } from './FurnitureMannequinView';
import { FurnitureStickieView } from './FurnitureStickieView';
import { FurnitureTrophyView } from './FurnitureTrophyView';
import { FurnitureHighScoreView } from './high-score/FurnitureHighScoreView';
import { FurnitureYoutubeDisplayView } from './youtube-tv/FurnitureYoutubeDisplayView';

export const FurnitureWidgetsView: FC<{}> = props =>
{
    return (
        <Base fit position="absolute" className="nitro-room-widgets top-0 start-0">
            <FurnitureBackgroundColorView />
            <FurnitureContextMenuView />
            <FurnitureCustomStackHeightView />
            <FurnitureDimmerView />
            <FurnitureFriendFurniView />
            <FurnitureGiftOpeningView />
            <FurnitureExchangeCreditView />
            <FurnitureHighScoreView />
            <FurnitureManipulationMenuView />
            <FurnitureMannequinView />
            <FurnitureStickieView />
            <FurnitureTrophyView />
            <FurnitureBadgeDisplayView />
            <FurnitureExternalImageView />
            <FurnitureYoutubeDisplayView />
        </Base>
    );
}
