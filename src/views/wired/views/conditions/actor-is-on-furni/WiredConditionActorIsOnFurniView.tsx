import { FC } from 'react';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredConditionBaseView } from '../base/WiredConditionBaseView';

export const WiredConditionActorIsOnFurniView: FC<{}> = props =>
{
    return <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } save={ null } />;
}
