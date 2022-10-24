import { GroupSaveColorsComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import { IGroupData, LocalizeText, SendMessageComposer } from '../../../../api';
import { AutoGrid, Base, classNames, Column, Flex, Grid, Text } from '../../../../common';
import { useGroup } from '../../../../hooks';

interface GroupTabColorsViewProps
{
    groupData: IGroupData;
    setGroupData: Dispatch<SetStateAction<IGroupData>>;
    setCloseAction: Dispatch<SetStateAction<{ action: () => boolean }>>;
}

export const GroupTabColorsView: FC<GroupTabColorsViewProps> = props =>
{
    const { groupData = null, setGroupData = null, setCloseAction = null } = props;
    const [ colors, setColors ] = useState<number[]>(null);
    const { groupCustomize = null } = useGroup();

    const getGroupColor = (colorIndex: number) =>
    {
        if(colorIndex === 0) return groupCustomize.groupColorsA.find(color => (color.id === colors[colorIndex])).color;

        return groupCustomize.groupColorsB.find(color => (color.id === colors[colorIndex])).color;
    }

    const selectColor = (colorIndex: number, colorId: number) =>
    {
        setColors(prevValue =>
        {
            const newColors = [ ...prevValue ];

            newColors[colorIndex] = colorId;

            return newColors;
        });
    }

    const saveColors = useCallback(() =>
    {
        if(!groupData || !colors || !colors.length) return false;

        if(groupData.groupColors === colors) return true;

        if(groupData.groupId <= 0)
        {
            setGroupData(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.groupColors = [ ...colors ];

                return newValue;
            });

            return true;
        }
        
        SendMessageComposer(new GroupSaveColorsComposer(groupData.groupId, colors[0], colors[1]));

        return true;
    }, [ groupData, colors, setGroupData ]);

    useEffect(() =>
    {
        if(!groupCustomize.groupColorsA || !groupCustomize.groupColorsB || groupData.groupColors) return;

        const groupColors = [ groupCustomize.groupColorsA[0].id, groupCustomize.groupColorsB[0].id ];

        setGroupData(prevValue =>
        {
            return { ...prevValue, groupColors };
        });
    }, [ groupCustomize, groupData.groupColors, setGroupData ]);

    useEffect(() =>
    {
        if(groupData.groupId <= 0)
        {
            setColors(groupData.groupColors ? [ ...groupData.groupColors ] : null);

            return;
        }
        
        setColors(groupData.groupColors);
    }, [ groupData ]);

    useEffect(() =>
    {
        setCloseAction({ action: saveColors });

        return () => setCloseAction(null);
    }, [ setCloseAction, saveColors ]);

    if(!colors) return null;
    
    return (
        <Grid overflow="hidden">
            <Column size={ 2 } gap={ 1 }>
                <Text bold>{ LocalizeText('group.edit.color.guild.color') }</Text>
                { groupData.groupColors && (groupData.groupColors.length > 0) &&
                    <Flex overflow="hidden" className="rounded border">
                        <Base className="group-color-swatch" style={ { backgroundColor: '#' + getGroupColor(0) } } />
                        <Base className="group-color-swatch" style={ { backgroundColor: '#' + getGroupColor(1) } } />
                    </Flex> }
            </Column>
            <Column size={ 5 } gap={ 1 } overflow="hidden">
                <Text bold>{ LocalizeText('group.edit.color.primary.color') }</Text>
                <AutoGrid gap={ 1 } columnCount={ 7 } columnMinWidth={ 16 } columnMinHeight={ 16 }>
                    { groupData.groupColors && groupCustomize.groupColorsA && groupCustomize.groupColorsA.map((item, index) =>
                    {
                        return <div key={ index } className={ classNames('group-badge-color-swatch cursor-pointer', ((groupData.groupColors[0] === item.id) && 'active')) } style={ { backgroundColor: '#' + item.color } } onClick={ () => selectColor(0, item.id) }></div>
                    }) }
                </AutoGrid>
            </Column>
            <Column size={ 5 } gap={ 1 } overflow="hidden">
                <Text bold>{ LocalizeText('group.edit.color.secondary.color') }</Text>
                <AutoGrid gap={ 1 } columnCount={ 7 } columnMinWidth={ 16 } columnMinHeight={ 16 }>
                    { groupData.groupColors && groupCustomize.groupColorsB && groupCustomize.groupColorsB.map((item, index) =>
                    {
                        return <div key={ index } className={ classNames('group-badge-color-swatch cursor-pointer', ((groupData.groupColors[1] === item.id) && 'active')) } style={ { backgroundColor: '#' + item.color } } onClick={ () => selectColor(1, item.id) }></div>
                    }) }
                </AutoGrid>
            </Column>
        </Grid>
    );
};
