import { GroupSaveColorsComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import { IGroupData, LocalizeText, SendMessageComposer } from '../../../../api';
import { AutoGrid, Column, Grid, Text } from '../../../../common';
import { useGroup } from '../../../../hooks';
import { classNames } from '../../../../layout';

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
    };

    const selectColor = (colorIndex: number, colorId: number) =>
    {
        setColors(prevValue =>
        {
            const newColors = [ ...prevValue ];

            newColors[colorIndex] = colorId;

            return newColors;
        });
    };

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
            <Column gap={ 1 } size={ 2 }>
                <Text bold>{ LocalizeText('group.edit.color.guild.color') }</Text>
                { groupData.groupColors && (groupData.groupColors.length > 0) &&
                    <div className="flex overflow-hidden border rounded">
                        <div className="w-[30px] h-[40px]" style={ { backgroundColor: '#' + getGroupColor(0) } } />
                        <div className="w-[30px] h-[40px]" style={ { backgroundColor: '#' + getGroupColor(1) } } />
                    </div> }
            </Column>
            <Column gap={ 1 } overflow="hidden" size={ 5 }>
                <Text bold>{ LocalizeText('group.edit.color.primary.color') }</Text>
                <AutoGrid columnCount={ 7 } columnMinHeight={ 16 } columnMinWidth={ 16 } gap={ 1 }>
                    { groupData.groupColors && groupCustomize.groupColorsA && groupCustomize.groupColorsA.map((item, index) =>
                    {
                        return <div key={ index } className={ classNames('relative rounded-[.25rem] w-[16px] h-[16px] bg-[#fff] border-[2px] border-[solid] border-[#fff] [box-shadow:inset_3px_3px_#0000001a] [box-shadow:inset_2px_2px_#0003] cursor-pointer', ((groupData.groupColors[0] === item.id) && 'bg-primary [box-shadow:none]')) } style={ { backgroundColor: '#' + item.color } } onClick={ () => selectColor(0, item.id) }></div>;
                    }) }
                </AutoGrid>
            </Column>
            <Column gap={ 1 } overflow="hidden" size={ 5 }>
                <Text bold>{ LocalizeText('group.edit.color.secondary.color') }</Text>
                <AutoGrid columnCount={ 7 } columnMinHeight={ 16 } columnMinWidth={ 16 } gap={ 1 }>
                    { groupData.groupColors && groupCustomize.groupColorsB && groupCustomize.groupColorsB.map((item, index) =>
                    {
                        return <div key={ index } className={ classNames('relative rounded-[.25rem] w-[16px] h-[16px] bg-[#fff] border-[2px] border-[solid] border-[#fff] [box-shadow:inset_3px_3px_#0000001a] [box-shadow:inset_2px_2px_#0003] cursor-pointer', ((groupData.groupColors[1] === item.id) && 'bg-primary [box-shadow:none]')) } style={ { backgroundColor: '#' + item.color } } onClick={ () => selectColor(1, item.id) }></div>;
                    }) }
                </AutoGrid>
            </Column>
        </Grid>
    );
};
