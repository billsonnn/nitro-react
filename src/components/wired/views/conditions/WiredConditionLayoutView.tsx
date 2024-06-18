import { WiredConditionlayout } from '../../../../api';
import { WiredConditionActorHasHandItemView } from './WiredConditionActorHasHandItem';
import { WiredConditionActorIsGroupMemberView } from './WiredConditionActorIsGroupMemberView';
import { WiredConditionActorIsOnFurniView } from './WiredConditionActorIsOnFurniView';
import { WiredConditionActorIsTeamMemberView } from './WiredConditionActorIsTeamMemberView';
import { WiredConditionActorIsWearingBadgeView } from './WiredConditionActorIsWearingBadgeView';
import { WiredConditionActorIsWearingEffectView } from './WiredConditionActorIsWearingEffectView';
import { WiredConditionDateRangeView } from './WiredConditionDateRangeView';
import { WiredConditionFurniHasAvatarOnView } from './WiredConditionFurniHasAvatarOnView';
import { WiredConditionFurniHasFurniOnView } from './WiredConditionFurniHasFurniOnView';
import { WiredConditionFurniHasNotFurniOnView } from './WiredConditionFurniHasNotFurniOnView';
import { WiredConditionFurniIsOfTypeView } from './WiredConditionFurniIsOfTypeView';
import { WiredConditionFurniMatchesSnapshotView } from './WiredConditionFurniMatchesSnapshotView';
import { WiredConditionTimeElapsedLessView } from './WiredConditionTimeElapsedLessView';
import { WiredConditionTimeElapsedMoreView } from './WiredConditionTimeElapsedMoreView';
import { WiredConditionUserCountInRoomView } from './WiredConditionUserCountInRoomView';

export const WiredConditionLayoutView = (code: number) =>
{
    switch(code)
    {
        case WiredConditionlayout.ACTOR_HAS_HANDITEM:
            return <WiredConditionActorHasHandItemView />;
        case WiredConditionlayout.ACTOR_IS_GROUP_MEMBER:
        case WiredConditionlayout.NOT_ACTOR_IN_GROUP:
            return <WiredConditionActorIsGroupMemberView />;
        case WiredConditionlayout.ACTOR_IS_ON_FURNI:
        case WiredConditionlayout.NOT_ACTOR_ON_FURNI:
            return <WiredConditionActorIsOnFurniView />;
        case WiredConditionlayout.ACTOR_IS_IN_TEAM:
        case WiredConditionlayout.NOT_ACTOR_IN_TEAM:
            return <WiredConditionActorIsTeamMemberView />;
        case WiredConditionlayout.ACTOR_IS_WEARING_BADGE:
        case WiredConditionlayout.NOT_ACTOR_WEARS_BADGE:
            return <WiredConditionActorIsWearingBadgeView />;
        case WiredConditionlayout.ACTOR_IS_WEARING_EFFECT:
        case WiredConditionlayout.NOT_ACTOR_WEARING_EFFECT:
            return <WiredConditionActorIsWearingEffectView />;
        case WiredConditionlayout.DATE_RANGE_ACTIVE:
            return <WiredConditionDateRangeView />;
        case WiredConditionlayout.FURNIS_HAVE_AVATARS:
        case WiredConditionlayout.FURNI_NOT_HAVE_HABBO:
            return <WiredConditionFurniHasAvatarOnView />;
        case WiredConditionlayout.HAS_STACKED_FURNIS:
            return <WiredConditionFurniHasFurniOnView />;
        case WiredConditionlayout.NOT_HAS_STACKED_FURNIS:
            return <WiredConditionFurniHasNotFurniOnView />;
        case WiredConditionlayout.STUFF_TYPE_MATCHES:
        case WiredConditionlayout.NOT_FURNI_IS_OF_TYPE:
            return <WiredConditionFurniIsOfTypeView />;
        case WiredConditionlayout.STATES_MATCH:
        case WiredConditionlayout.NOT_STATES_MATCH:
            return <WiredConditionFurniMatchesSnapshotView />;
        case WiredConditionlayout.TIME_ELAPSED_LESS:
            return <WiredConditionTimeElapsedLessView />;
        case WiredConditionlayout.TIME_ELAPSED_MORE:
            return <WiredConditionTimeElapsedMoreView />;
        case WiredConditionlayout.USER_COUNT_IN:
        case WiredConditionlayout.NOT_USER_COUNT_IN:
            return <WiredConditionUserCountInRoomView />;
    }

    return null;
};
