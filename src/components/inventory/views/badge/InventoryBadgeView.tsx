import { FC, useEffect, useState } from 'react';
import { LocalizeBadgeName, LocalizeText, UnseenItemCategory } from '../../../../api';
import { LayoutBadgeImageView } from '../../../../common';
import { useInventoryBadges, useInventoryUnseenTracker } from '../../../../hooks';
import { InfiniteGrid, NitroButton } from '../../../../layout';
import { InventoryBadgeItemView } from './InventoryBadgeItemView';

export const InventoryBadgeView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const { badgeCodes = [], activeBadgeCodes = [], selectedBadgeCode = null, isWearingBadge = null, canWearBadges = null, toggleBadge = null, getBadgeId = null, activate = null, deactivate = null } = useInventoryBadges();
    const { isUnseen = null, removeUnseen = null } = useInventoryUnseenTracker();

    useEffect(() =>
    {
        if(!selectedBadgeCode || !isUnseen(UnseenItemCategory.BADGE, getBadgeId(selectedBadgeCode))) return;

        removeUnseen(UnseenItemCategory.BADGE, getBadgeId(selectedBadgeCode));
    }, [ selectedBadgeCode, isUnseen, removeUnseen, getBadgeId ]);

    useEffect(() =>
    {
        if(!isVisible) return;

        const id = activate();

        return () => deactivate(id);
    }, [ isVisible, activate, deactivate ]);

    useEffect(() =>
    {
        setIsVisible(true);

        return () => setIsVisible(false);
    }, []);

    return (
        <div className="grid h-full grid-cols-12 gap-2">
            <div className="flex flex-col col-span-7 gap-1 overflow-hidden">
                <InfiniteGrid<string>
                    columnCount={ 5 }
                    estimateSize={ 50 }
                    itemRender={ item => <InventoryBadgeItemView badgeCode={ item } /> }
                    items={ badgeCodes.filter(code => !isWearingBadge(code)) } />
            </div>
            <div className="flex flex-col justify-between col-span-5 overflow-auto">
                <div className="flex flex-col gap-2 overflow-hidden">
                    <span className="text-sm truncate grow">{ LocalizeText('inventory.badges.activebadges') }</span>
                    <InfiniteGrid<string>
                        columnCount={ 3 }
                        estimateSize={ 50 }
                        itemRender={ item => <InventoryBadgeItemView badgeCode={ item } /> }
                        items={ activeBadgeCodes } />
                </div>
                { !!selectedBadgeCode &&
                    <div className="flex flex-col gap-2">
                        <div className="items-center gap-2">
                            <LayoutBadgeImageView shrink badgeCode={ selectedBadgeCode } />
                            <span className="text-sm truncate grow">{ LocalizeBadgeName(selectedBadgeCode) }</span>
                        </div>
                        <NitroButton
                            disabled={ !isWearingBadge(selectedBadgeCode) && !canWearBadges() }
                            onClick={ event => toggleBadge(selectedBadgeCode) }>
                            { LocalizeText(isWearingBadge(selectedBadgeCode) ? 'inventory.badges.clearbadge' : 'inventory.badges.wearbadge') }
                        </NitroButton>
                    </div> }
            </div>
        </div>
    );
};
