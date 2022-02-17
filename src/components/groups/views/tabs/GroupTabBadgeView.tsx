import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import { Column, Flex, Grid } from '../../../../common';
import { BadgeImageView } from '../../../../views/shared/badge-image/BadgeImageView';
import { GroupBadgePart } from '../../common/GroupBadgePart';
import { useGroupsContext } from '../../GroupsContext';
import { GroupsActions } from '../../reducers/GroupsReducer';

const POSITIONS: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

interface GroupTabBadgeViewProps
{
    skipDefault?: boolean;
}

export const GroupTabBadgeView: FC<GroupTabBadgeViewProps> = props =>
{
    const { skipDefault = null } = props;
    const [ editingIndex, setEditingIndex ] = useState<number>(0);
    const [ isSelectingModel, setIsSelectingModel ] = useState<boolean>(false);
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { badgeBases = null, badgeSymbols = null, badgePartColors = null, groupBadgeParts = null } = groupsState;

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
        
    }, [ skipDefault, badgeBases, badgePartColors, groupBadgeParts, dispatchGroupsState ]);
    
    return (
        <div className="shared-tab-badge">
            <Flex gap={ 2 }>
                <Flex className="group-badge">
                    <BadgeImageView badgeCode={ getCompleteBadgeCode() } isGroup={ true } className="mx-auto d-block"/>
                </Flex>
                <Column>
                    { (groupBadgeParts.length > 0) && groupBadgeParts.map((part, index) =>
                        {
                            if(part.type === GroupBadgePart.BASE) return null;
                            
                            return (
                                <Flex gap={ 2 }>
                                    <Flex center shrink pointer className="badge-preview" onClick={ event => setIsSelectingModel(true) }>
                                        { (groupBadgeParts[index]['code'] && (groupBadgeParts[index]['code'].length > 0)) &&
                                            <BadgeImageView badgeCode={ groupBadgeParts[index]['code'] } isGroup={ true } /> }
                                        { (!groupBadgeParts[index]['code'] || !groupBadgeParts[index]['code'].length) &&
                                            <FontAwesomeIcon icon="plus" /> }
                                    </Flex>
                                    <Grid gap={ 1 } columnCount={ 3 }>
                                        { POSITIONS.map((position) =>
                                            {
                                                return <div key={ position } className={ 'position-swatch cursor-pointer' + classNames({ ' active': groupBadgeParts[index]['position'] === position }) } onClick={ () => selectPartProperty('position', position) }></div>
                                            }) }
                                    </Grid>
                                    <Grid gap={ 1 } columnCount={ 8 }>
                                        { (badgePartColors.length > 0) && badgePartColors.map((item, colorIndex) =>
                                            {
                                                return <div key={ colorIndex } className={ 'color-swatch cursor-pointer' + classNames({ ' active': item.id === groupBadgeParts[index]['color'] }) } style={{ backgroundColor: '#' + item.color }} onClick={ () => selectPartProperty('color', item.id) }></div>
                                            }) }
                                    </Grid>
                                </Flex>
                            );
                        }) }
                </Column>
            </Flex>
        </div>
    );
};
