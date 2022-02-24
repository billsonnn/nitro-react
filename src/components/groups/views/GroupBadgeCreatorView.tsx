import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { Base, Column, Flex, Grid } from '../../../common';
import { BatchUpdates } from '../../../hooks';
import { BadgeImageView } from '../../../views/shared/badge-image/BadgeImageView';
import { GroupBadgePart } from '../common/GroupBadgePart';
import { useGroupsContext } from '../GroupsContext';

interface GroupBadgeCreatorViewProps
{
    badgeParts: GroupBadgePart[];
    setBadgeParts: Dispatch<SetStateAction<GroupBadgePart[]>>;
}

const POSITIONS: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];

export const GroupBadgeCreatorView: FC<GroupBadgeCreatorViewProps> = props =>
{
    const { badgeParts = [], setBadgeParts = null } = props;
    const [ selectedIndex, setSelectedIndex ] = useState<number>(-1);
    const [ copiedBadgeParts, setCopiedBadgeParts ] = useState<GroupBadgePart[]>(null);
    const { groupsState = null } = useGroupsContext();
    const { badgeBases = null, badgeSymbols = null, badgePartColors = null } = groupsState;
    const willUnmount = useRef(false);

    const setPartProperty = (partIndex: number, property: string, value: number) =>
    {
        const newBadgeParts = [ ...copiedBadgeParts ];
        
        newBadgeParts[partIndex][property] = value;

        BatchUpdates(() =>
        {
            setCopiedBadgeParts(newBadgeParts);

            if(property === 'key') setSelectedIndex(-1);
        });
    }

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            setCopiedBadgeParts(badgeParts);
            setSelectedIndex(-1);
        });
    }, [ badgeParts ]);

    useEffect(() =>
    {
        if(!copiedBadgeParts || (copiedBadgeParts === badgeParts)) return;

        setBadgeParts(copiedBadgeParts);
    }, [ copiedBadgeParts, badgeParts, setBadgeParts ]);

    if(!copiedBadgeParts || !copiedBadgeParts.length) return null;

    return (
        <>
            { ((selectedIndex < 0) && copiedBadgeParts && (copiedBadgeParts.length > 0)) && copiedBadgeParts.map((part, index) =>
                {
                    return (
                        <Flex key={ index } alignItems="center" justifyContent="between" gap={ 2 } className="bg-muted rounded px-2 py-1">
                            <Flex pointer center className="bg-muted rounded p-1" onClick={ event => setSelectedIndex(index) }>
                                { (copiedBadgeParts[index].code && (copiedBadgeParts[index].code.length > 0)) &&
                                <BadgeImageView badgeCode={ copiedBadgeParts[index].code } isGroup={ true } /> }
                                { (!copiedBadgeParts[index].code || !copiedBadgeParts[index].code.length) &&
                                    <Flex center className="badge-image group-badge">
                                        <FontAwesomeIcon icon="plus" />
                                    </Flex> }
                            </Flex>
                            { (part.type !== GroupBadgePart.BASE) &&
                                <Grid gap={ 1 } columnCount={ 3 }>
                                    { POSITIONS.map((position, posIndex) =>
                                        {
                                            return <Base key={ posIndex } pointer className={ `group-badge-position-swatch ${ (copiedBadgeParts[index].position === position) ? 'active' : '' }` } onClick={ event => setPartProperty(index, 'position', position) }></Base>
                                        }) }
                                </Grid> }
                            <Grid gap={ 1 } columnCount={ 8 }>
                                { (badgePartColors.length > 0) && badgePartColors.map((item, colorIndex) =>
                                    {
                                        return <Base key={ colorIndex } pointer className={ `group-badge-color-swatch ${ (copiedBadgeParts[index].color === (colorIndex + 1)) ? 'active' : '' }` } style={{ backgroundColor: '#' + item.color }} onClick={ event => setPartProperty(index, 'color', (colorIndex + 1)) }></Base>
                                    }) }
                            </Grid>
                        </Flex>
                    );
                }) }
            { (selectedIndex >= 0) &&
                <Grid gap={ 1 } columnCount={ 5 }>
                    { (copiedBadgeParts[selectedIndex].type === GroupBadgePart.SYMBOL) &&
                        <Column pointer center className="bg-muted rounded p-1" onClick={ event => setPartProperty(selectedIndex, 'key', 0) }>
                            <Flex center className="badge-image group-badge">
                                <FontAwesomeIcon icon="times" />
                            </Flex>
                        </Column> }
                    { ((copiedBadgeParts[selectedIndex].type === GroupBadgePart.BASE) ? badgeBases : badgeSymbols).map((item, index) =>
                        {
                            return (
                                <Column key={ index } pointer center className="bg-muted rounded p-1" onClick={ event => setPartProperty(selectedIndex, 'key', item.id) }>
                                    <BadgeImageView badgeCode={ GroupBadgePart.getCode(copiedBadgeParts[selectedIndex].type, item.id, copiedBadgeParts[selectedIndex].color, 4) } isGroup={ true } />
                                </Column>
                            );
                        }) }
                </Grid> }
        </>
    );
}
