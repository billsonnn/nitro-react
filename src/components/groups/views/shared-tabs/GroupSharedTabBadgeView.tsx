import classNames from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import { BadgeImageView } from '../../../../views/shared/badge-image/BadgeImageView';
import { GroupBadgePart } from '../../common/GroupBadgePart';
import { useGroupsContext } from '../../GroupsContext';
import { GroupsActions } from '../../reducers/GroupsReducer';

const POSITIONS: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

interface GroupSharedTabBadgeViewProps
{
    skipDefault?: boolean;
}

export const GroupSharedTabBadgeView: FC<GroupSharedTabBadgeViewProps> = props =>
{
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { badgeBases = null, badgeSymbols = null, badgePartColors = null, groupBadgeParts = null } = groupsState;

    const { skipDefault = null } = props;

    const [ editingIndex, setEditingIndex ] = useState<number>(0);
    const [ isSelectingModel, setIsSelectingModel ] = useState<boolean>(false);

    useEffect(() =>
    {
        if(skipDefault || !badgeBases || !badgePartColors || groupBadgeParts) return;

        const badgeParts: GroupBadgePart[] = [
            new GroupBadgePart(GroupBadgePart.BASE, badgeBases[0].id, badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, badgePartColors[0].id)
        ];

        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_BADGE_PARTS,
            payload: { badgeParts }
        });
        
    }, [ badgeBases, badgePartColors, groupBadgeParts ]);

    const switchIndex = useCallback((index: number) =>
    {
        setIsSelectingModel(false);
        setEditingIndex(index);
    }, []);

    const selectPartProperty = useCallback((property: string, key: number) =>
    {
        const clonedBadgeParts = Array.from(groupBadgeParts);
        
        clonedBadgeParts[editingIndex][property] = key;
        
        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_BADGE_PARTS,
            payload: { 
                badgeParts: clonedBadgeParts
            }
        });

        if(property === 'key') setIsSelectingModel(false);
    }, [ editingIndex, groupBadgeParts, dispatchGroupsState ]);

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

    const getCurrentPart = useCallback((property: string) =>
    {
        return groupBadgeParts[editingIndex][property];
    }, [ groupBadgeParts, editingIndex ]);
    
    return (
    <div className="shared-tab-badge">
        <div className="d-flex gap-2">
            <div className="badge-preview flex-shrink-0 me-3">
                <BadgeImageView badgeCode={ getCompleteBadgeCode() } isGroup={ true } />
            </div>
            <div>
                <div className="d-flex gap-2 align-items-center">
                    { groupBadgeParts && groupBadgeParts.map((badgePart, partIndex) =>
                        {
                            return (
                                <div key={ partIndex } className={ 'badge-preview flex-shrink-0 d-flex align-items-center justify-content-center cursor-pointer' + classNames({ ' active': editingIndex === partIndex }) } onClick={ () => switchIndex(partIndex) }>
                                    { badgePart.code && <BadgeImageView badgeCode={ badgePart.code } isGroup={ true } /> }
                                    { !badgePart.code && <i className="fas fa-plus text-primary h4 m-0" /> }
                                </div>
                            )
                        }) }
                </div>
                { !isSelectingModel && groupBadgeParts && <div className="d-flex gap-2 mt-3">
                    <div className="badge-preview d-flex align-items-center justify-content-center flex-shrink-0 cursor-pointer" onClick={ () => setIsSelectingModel(true) }>
                        { getCurrentPart('code') && <BadgeImageView badgeCode={ getCurrentPart('code') } isGroup={ true } /> }
                        { !getCurrentPart('code') && <i className="fas fa-plus text-primary h4 m-0" /> }
                    </div>
                    <div>
                        <div className="row row-cols-3 g-0 gap-1 w-100 h-100 overflow-auto">
                            { POSITIONS.map((position) =>
                                {
                                    return <div key={ position } className={ 'position-swatch cursor-pointer' + classNames({ ' active': getCurrentPart('position') === position }) } onClick={ () => selectPartProperty('position', position) }></div>
                                }) }
                        </div>
                    </div>
                    <div>
                        <div className="row row-cols-8 g-0 gap-1 w-100 h-100 overflow-auto">
                            { badgePartColors && badgePartColors.map((item, index) =>
                                {
                                    return <div key={ index } className={ 'color-swatch cursor-pointer' + classNames({ ' active': item.id === getCurrentPart('color') }) } style={{ backgroundColor: '#' + item.color }} onClick={ () => selectPartProperty('color', item.id) }></div>
                                }) }
                        </div>
                    </div>
                </div> }
                { isSelectingModel && <div className="selection-list row row-cols-8 g-0 align-content-start gap-1 h-100 overflow-auto mt-3">
                    { groupBadgeParts[editingIndex].type !== GroupBadgePart.BASE && <>
                        <div className="cursor-pointer badge-preview d-flex align-items-center justify-content-center" onClick={ () => selectPartProperty('key', 0) }>
                            <i className="fas fa-times text-primary h4 m-0" />
                        </div>
                    </> }
                    { (groupBadgeParts[editingIndex].type === GroupBadgePart.BASE ? badgeBases : badgeSymbols).map((item, index) =>
                        {
                            return <div key={ index } className={ 'cursor-pointer badge-preview' + classNames({ ' bg-primary': groupBadgeParts[editingIndex].key === item.id }) } onClick={ () => selectPartProperty('key', item.id) }>
                                <BadgeImageView badgeCode={ GroupBadgePart.getCode(groupBadgeParts[editingIndex].type, item.id, groupBadgeParts[editingIndex].color, 4) } isGroup={ true } />
                            </div>
                        }) }
                </div>}
            </div>
        </div>
    </div>);
};
