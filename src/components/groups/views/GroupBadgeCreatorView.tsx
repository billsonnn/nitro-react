import { Dispatch, FC, SetStateAction, useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { GroupBadgePart } from '../../../api';
import { Column, Flex, Grid, LayoutBadgeImageView } from '../../../common';
import { useGroup } from '../../../hooks';

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
    const { groupCustomize = null } = useGroup();

    const setPartProperty = (partIndex: number, property: string, value: number) =>
    {
        const newBadgeParts = [ ...badgeParts ];

        newBadgeParts[partIndex][property] = value;

        setBadgeParts(newBadgeParts);

        if(property === 'key') setSelectedIndex(-1);
    };

    if(!badgeParts || !badgeParts.length) return null;

    return (
        <>
            { ((selectedIndex < 0) && badgeParts && (badgeParts.length > 0)) && badgeParts.map((part, index) =>
            {
                return (
                    <Flex key={ index } alignItems="center" className="bg-muted rounded px-2 py-1" gap={ 2 } justifyContent="between">
                        <Flex center pointer className="bg-muted rounded p-1" onClick={ event => setSelectedIndex(index) }>
                            { (badgeParts[index].code && (badgeParts[index].code.length > 0)) &&
                                <LayoutBadgeImageView badgeCode={ badgeParts[index].code } isGroup={ true } /> }
                            { (!badgeParts[index].code || !badgeParts[index].code.length) &&
                                <Flex center className="relative w-[40px] h-[40px] bg-no-repeat bg-center group-badge">
                                    <FaPlus className="fa-icon" />
                                </Flex> }
                        </Flex>
                        { (part.type !== GroupBadgePart.BASE) &&
                            <Grid columnCount={ 3 } gap={ 1 }>
                                { POSITIONS.map((position, posIndex) =>
                                {
                                    return <div key={ posIndex } className={ `relative rounded-[.25rem] w-[16px] h-[16px] bg-[#fff] border-[2px] border-[solid] border-[#fff] [box-shadow:inset_3px_3px_#0000001a] cursor-pointer ${ (badgeParts[index].position === position) ? 'bg-primary [box-shadow:none]' : '' }` } onClick={ event => setPartProperty(index, 'position', position) } />;
                                }) }
                            </Grid> }
                        <Grid columnCount={ 8 } gap={ 1 }>
                            { (groupCustomize.badgePartColors.length > 0) && groupCustomize.badgePartColors.map((item, colorIndex) =>
                            {
                                return <div key={ colorIndex } className={ `relative [box-shadow:inset_2px_2px_#0003] rounded-[.25rem] w-[16px] h-[16px] bg-[#fff] border-[2px] border-[solid] border-[#fff] [box-shadow:inset_3px_3px_#0000001a]cursor-pointer ${ (badgeParts[index].color === (colorIndex + 1)) ? 'bg-primary [box-shadow:none]' : '' }` } style={ { backgroundColor: '#' + item.color } } onClick={ event => setPartProperty(index, 'color', (colorIndex + 1)) } />;
                            }) }
                        </Grid>
                    </Flex>
                );
            }) }
            { (selectedIndex >= 0) &&
                <Grid columnCount={ 5 } gap={ 1 }>
                    { (badgeParts[selectedIndex].type === GroupBadgePart.SYMBOL) &&
                        <Column center pointer className="bg-muted rounded p-1" onClick={ event => setPartProperty(selectedIndex, 'key', 0) }>
                            <Flex center className="relative w-[40px] h-[40px] bg-no-repeat bg-center group-badge">
                                <FaTimes className="fa-icon" />
                            </Flex>
                        </Column> }
                    { ((badgeParts[selectedIndex].type === GroupBadgePart.BASE) ? groupCustomize.badgeBases : groupCustomize.badgeSymbols).map((item, index) =>
                    {
                        return (
                            <Column key={ index } center pointer className="bg-muted rounded p-1" onClick={ event => setPartProperty(selectedIndex, 'key', item.id) }>
                                <LayoutBadgeImageView badgeCode={ GroupBadgePart.getCode(badgeParts[selectedIndex].type, item.id, badgeParts[selectedIndex].color, 4) } isGroup={ true } />
                            </Column>
                        );
                    }) }
                </Grid> }
        </>
    );
};
