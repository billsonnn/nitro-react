import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Base, Column, Flex, Grid } from '../../../common';
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
    const { groupCustomize = null } = useGroupsContext();

    const setPartProperty = (partIndex: number, property: string, value: number) =>
    {
        const newBadgeParts = [ ...badgeParts ];
        
        newBadgeParts[partIndex][property] = value;

        setBadgeParts(newBadgeParts);
        
        if(property === 'key') setSelectedIndex(-1);
    }

    if(!badgeParts || !badgeParts.length) return null;

    return (
        <>
            { ((selectedIndex < 0) && badgeParts && (badgeParts.length > 0)) && badgeParts.map((part, index) =>
                {
                    return (
                        <Flex key={ index } alignItems="center" justifyContent="between" gap={ 2 } className="bg-muted rounded px-2 py-1">
                            <Flex pointer center className="bg-muted rounded p-1" onClick={ event => setSelectedIndex(index) }>
                                { (badgeParts[index].code && (badgeParts[index].code.length > 0)) &&
                                <BadgeImageView badgeCode={ badgeParts[index].code } isGroup={ true } /> }
                                { (!badgeParts[index].code || !badgeParts[index].code.length) &&
                                    <Flex center className="badge-image group-badge">
                                        <FontAwesomeIcon icon="plus" />
                                    </Flex> }
                            </Flex>
                            { (part.type !== GroupBadgePart.BASE) &&
                                <Grid gap={ 1 } columnCount={ 3 }>
                                    { POSITIONS.map((position, posIndex) =>
                                        {
                                            return <Base key={ posIndex } pointer className={ `group-badge-position-swatch ${ (badgeParts[index].position === position) ? 'active' : '' }` } onClick={ event => setPartProperty(index, 'position', position) }></Base>
                                        }) }
                                </Grid> }
                            <Grid gap={ 1 } columnCount={ 8 }>
                                { (groupCustomize.badgePartColors.length > 0) && groupCustomize.badgePartColors.map((item, colorIndex) =>
                                    {
                                        return <Base key={ colorIndex } pointer className={ `group-badge-color-swatch ${ (badgeParts[index].color === (colorIndex + 1)) ? 'active' : '' }` } style={{ backgroundColor: '#' + item.color }} onClick={ event => setPartProperty(index, 'color', (colorIndex + 1)) }></Base>
                                    }) }
                            </Grid>
                        </Flex>
                    );
                }) }
            { (selectedIndex >= 0) &&
                <Grid gap={ 1 } columnCount={ 5 }>
                    { (badgeParts[selectedIndex].type === GroupBadgePart.SYMBOL) &&
                        <Column pointer center className="bg-muted rounded p-1" onClick={ event => setPartProperty(selectedIndex, 'key', 0) }>
                            <Flex center className="badge-image group-badge">
                                <FontAwesomeIcon icon="times" />
                            </Flex>
                        </Column> }
                    { ((badgeParts[selectedIndex].type === GroupBadgePart.BASE) ? groupCustomize.badgeBases : groupCustomize.badgeSymbols).map((item, index) =>
                        {
                            return (
                                <Column key={ index } pointer center className="bg-muted rounded p-1" onClick={ event => setPartProperty(selectedIndex, 'key', item.id) }>
                                    <BadgeImageView badgeCode={ GroupBadgePart.getCode(badgeParts[selectedIndex].type, item.id, badgeParts[selectedIndex].color, 4) } isGroup={ true } />
                                </Column>
                            );
                        }) }
                </Grid> }
        </>
    );
}
