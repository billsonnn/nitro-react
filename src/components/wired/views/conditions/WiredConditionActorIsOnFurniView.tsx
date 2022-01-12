import { FC } from 'react';
import { WiredFurniType } from '../../common/WiredFurniType';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionActorIsOnFurniView: FC<{}> = props =>
{
    return <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } save={ null } />;
}
