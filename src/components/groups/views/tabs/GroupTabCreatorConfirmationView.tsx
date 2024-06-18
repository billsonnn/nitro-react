import { Dispatch, FC, SetStateAction } from 'react';
import { IGroupData, LocalizeText } from '../../../../api';
import { Column, Flex, Grid, LayoutBadgeImageView, Text } from '../../../../common';
import { useGroup } from '../../../../hooks';

interface GroupTabCreatorConfirmationViewProps
{
    groupData: IGroupData;
    setGroupData: Dispatch<SetStateAction<IGroupData>>;
    purchaseCost: number;
}

export const GroupTabCreatorConfirmationView: FC<GroupTabCreatorConfirmationViewProps> = props =>
{
    const { groupData = null, setGroupData = null, purchaseCost = 0 } = props;
    const { groupCustomize = null } = useGroup();

    const getCompleteBadgeCode = () =>
    {
        if(!groupData || !groupData.groupBadgeParts || !groupData.groupBadgeParts.length) return '';

        let badgeCode = '';

        groupData.groupBadgeParts.forEach(part => (part.code && (badgeCode += part.code)));

        return badgeCode;
    };

    const getGroupColor = (colorIndex: number) =>
    {
        if(colorIndex === 0) return groupCustomize.groupColorsA.find(c => c.id === groupData.groupColors[colorIndex]).color;

        return groupCustomize.groupColorsB.find(c => c.id === groupData.groupColors[colorIndex]).color;
    };

    if(!groupData) return null;

    return (
        <Grid gap={ 1 } overflow="hidden">
            <Column size={ 3 }>
                <Column center className="bg-muted rounded p-1" gap={ 2 }>
                    <Text bold center>{ LocalizeText('group.create.confirm.guildbadge') }</Text>
                    <LayoutBadgeImageView badgeCode={ getCompleteBadgeCode() } isGroup={ true } />
                </Column>
                <Column center className="bg-muted rounded p-1" gap={ 2 }>
                    <Text bold center>{ LocalizeText('group.edit.color.guild.color') }</Text>
                    <Flex className="rounded border" overflow="hidden">
                        <div className="w-[30px] h-[40px]" style={ { backgroundColor: '#' + getGroupColor(0) } } />
                        <div className="w-[30px] h-[40px]" style={ { backgroundColor: '#' + getGroupColor(1) } } />
                    </Flex>
                </Column>
            </Column>
            <Column justifyContent="between" size={ 9 }>
                <div className="flex flex-col">
                    <div className="flex flex-col gap-1">
                        <Text bold>{ groupData.groupName }</Text>
                        <Text>{ groupData.groupDescription }</Text>
                    </div>
                    <Text overflow="auto">{ LocalizeText('group.create.confirm.info') }</Text>
                </div>
                <Text center className="bg-primary rounded p-1" variant="white">
                    { LocalizeText('group.create.confirm.buyinfo', [ 'amount' ], [ purchaseCost.toString() ]) }
                </Text>
            </Column>
        </Grid>
    );
};
