import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../api';
import { BadgeImageView } from '../../../../views/shared/badge-image/BadgeImageView';
import { useGroupsContext } from '../../GroupsContext';

export const GroupCreatorTabConfirmationView: FC<{}> = props =>
{
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { groupName = '', groupDescription = '', groupBadgeParts = null, groupColors = null, groupColorsA = null, groupColorsB = null, purchaseCost = 0 } = groupsState;

    const getCompleteBadgeCode = useCallback(() =>
    {
        let code = '';

        if(!groupBadgeParts) return code;
        
        groupBadgeParts.forEach((badgePart) =>
        {
            if(badgePart.code) code = code + badgePart.code;
        });

        return code;
    }, [ groupBadgeParts ]);
    
    const getGroupColor = useCallback((colorIndex: number) =>
    {
        if(colorIndex === 0) return groupColorsA.find(c => c.id === groupColors[colorIndex]).color;

        return groupColorsB.find(c => c.id === groupColors[colorIndex]).color;
    }, [ groupColors, groupColorsA, groupColorsB ]);

    return (
        <div className="d-flex gap-3 h-100">
            <div>
                <div className="fw-bold text-nowrap">{ LocalizeText('group.create.confirm.guildbadge') }</div>
                <div className="badge-preview">
                    <BadgeImageView badgeCode={ getCompleteBadgeCode() } isGroup={ true } />
                </div>
                <div className="d-flex flex-column align-items-center mt-2">
                    <div className="fw-bold text-nowrap">{ LocalizeText('group.edit.color.guild.color') }</div>
                    { groupColors && <div className="d-flex">
                        <div className="group-color-swatch" style={{ backgroundColor: '#' + getGroupColor(0) }}></div>
                        <div className="group-color-swatch" style={{ backgroundColor: '#' + getGroupColor(1) }}></div>
                    </div> }
                </div>
            </div>
            <div className="d-flex flex-column h-100">
                <div className="fw-bold">{ groupName }</div>
                <div>{ groupDescription }</div>
                <div className="mt-3" dangerouslySetInnerHTML={ { __html: LocalizeText('group.create.confirm.info') } } />
                <div className="mt-auto rounded bg-primary p-1 text-center text-white">{ LocalizeText('group.create.confirm.buyinfo', ['amount'], [purchaseCost.toString()]) }</div>
            </div>
        </div>
    );
};
