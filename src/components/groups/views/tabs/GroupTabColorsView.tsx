import classNames from 'classnames';
import { FC, useEffect } from 'react';
import { LocalizeText } from '../../../../api';
import { AutoGrid, Base, Column, Flex, Grid, Text } from '../../../../common';
import { useGroupsContext } from '../../GroupsContext';
import { GroupsActions } from '../../reducers/GroupsReducer';

export const GroupTabColorsView: FC<{}> = props =>
{
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { groupColors = null, groupColorsA = null, groupColorsB = null } = groupsState;

    const getGroupColor = (colorIndex: number) =>
    {
        if(colorIndex === 0) return groupColorsA.find(color => (color.id === groupColors[colorIndex])).color;

        return groupColorsB.find(color => (color.id === groupColors[colorIndex])).color;
    }

    const selectColor = (colorIndex: number, colorId: number) =>
    {
        const clonedGroupColors = Array.from(groupColors);

        clonedGroupColors[colorIndex] = colorId;

        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_COLORS,
            payload: { 
                objectValues: clonedGroupColors
            }
        });
    }

    useEffect(() =>
    {
        if(!groupColorsA || !groupColorsB || groupColors) return;

        const colors: number[] = [
            groupColorsA[0].id,
            groupColorsB[0].id
        ];

        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_COLORS,
            payload: {
                objectValues: colors
            }
        });
    }, [ dispatchGroupsState, groupColors, groupColorsA, groupColorsB ]);
    
    return (
        <Grid overflow="hidden">
            <Column size={ 2 } gap={ 1 }>
                <Text bold>{ LocalizeText('group.edit.color.guild.color') }</Text>
                { groupColors && (groupColors.length > 0) &&
                    <Flex overflow="hidden" className="rounded border">
                        <Base className="group-color-swatch" style={{ backgroundColor: '#' + getGroupColor(0) }} />
                        <Base className="group-color-swatch" style={{ backgroundColor: '#' + getGroupColor(1) }} />
                    </Flex> }
            </Column>
            <Column size={ 5 } gap={ 1 } overflow="hidden">
                <Text bold>{ LocalizeText('group.edit.color.primary.color') }</Text>
                <AutoGrid gap={ 1 } columnCount={ 7 } columnMinWidth={ 16 } columnMinHeight={ 16 } className="nitro-groups-color-grid">
                    { groupColors && groupColorsA && groupColorsA.map((item, index) =>
                        {
                            return <div key={ index } className={ 'color-swatch cursor-pointer' + classNames({ ' active': (groupColors[0] === item.id) }) } style={{ backgroundColor: '#' + item.color }} onClick={ () => selectColor(0, item.id) }></div>
                        }) }
                </AutoGrid>
            </Column>
            <Column size={ 5 } gap={ 1 } overflow="hidden">
                <Text bold>{ LocalizeText('group.edit.color.secondary.color') }</Text>
                <AutoGrid gap={ 1 } columnCount={ 7 } columnMinWidth={ 16 } columnMinHeight={ 16 } className="nitro-groups-color-grid">
                    { groupColorsB && groupColorsB.map((item, index) =>
                        {
                            return <div key={ index } className={ 'color-swatch cursor-pointer' + classNames({ ' active': (groupColors[1] === item.id) }) } style={{ backgroundColor: '#' + item.color }} onClick={ () => selectColor(1, item.id) }></div>
                        }) }
                </AutoGrid>
            </Column>
        </Grid>
    );
};
