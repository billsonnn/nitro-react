import { FC } from 'react';
import { WiredFurniType } from '../../common/WiredFurniType';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionActorIsGroupMemberView: FC<{}> = props =>
{
    return <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ null } />;
}
