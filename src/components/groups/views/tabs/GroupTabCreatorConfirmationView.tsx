import { Dispatch, FC, SetStateAction } from 'react';
import { LocalizeText } from '../../../../api';
import { Base, Column, Flex, Grid, Text } from '../../../../common';
import { BadgeImageView } from '../../../../views/shared/badge-image/BadgeImageView';
import { IGroupData } from '../../common/IGroupData';
import { useGroupsContext } from '../../GroupsContext';

interface GroupTabCreatorConfirmationViewProps
{
    groupData: IGroupData;
    setGroupData: Dispatch<SetStateAction<IGroupData>>;
    purchaseCost: number;
}

export const GroupTabCreatorConfirmationView: FC<GroupTabCreatorConfirmationViewProps> = props =>
{
    const { groupData = null, setGroupData = null, purchaseCost = 0 } = props;
    const { groupCustomize = null } = useGroupsContext();

    const getCompleteBadgeCode = () =>
    {
        if(!groupData || !groupData.groupBadgeParts || !groupData.groupBadgeParts.length) return '';

        let badgeCode = '';

        groupData.groupBadgeParts.forEach(part => (part.code && (badgeCode += part.code)));

        return badgeCode;
    }
    
    const getGroupColor = (colorIndex: number) =>
    {
        if(colorIndex === 0) return groupCustomize.groupColorsA.find(c => c.id === groupData.groupColors[colorIndex]).color;

        return groupCustomize.groupColorsB.find(c => c.id === groupData.groupColors[colorIndex]).color;
    }

    if(!groupData) return null;

    return (
        <Grid overflow="hidden" gap={ 1 }>
            <Column size={ 3 }>
                <Column center className="bg-muted rounded p-1" gap={ 2 }>
                    <Text bold center>{ LocalizeText('group.create.confirm.guildbadge') }</Text>
                    <BadgeImageView badgeCode={ getCompleteBadgeCode() } isGroup={ true } />
                </Column>
                <Column center className="bg-muted rounded p-1" gap={ 2 }>
                    <Text bold center>{ LocalizeText('group.edit.color.guild.color') }</Text>
                    <Flex overflow="hidden" className="rounded border">
                        <Base className="group-color-swatch" style={{ backgroundColor: '#' + getGroupColor(0) }} />
                        <Base className="group-color-swatch" style={{ backgroundColor: '#' + getGroupColor(1) }} />
                    </Flex>
                </Column>
            </Column>
            <Column size={ 9 } justifyContent="between">
                <Column>
                    <Column gap={ 1 }>
                        <Text bold>{ groupData.groupName }</Text>
                        <Text>{ groupData.groupDescription }</Text>
                    </Column>
                    <Text overflow="auto">{ LocalizeText('group.create.confirm.info') }</Text>
                </Column>
                <Text center variant="white" className="bg-primary rounded p-1">
                    { LocalizeText('group.create.confirm.buyinfo', [ 'amount' ], [ purchaseCost.toString() ]) }
                </Text>
            </Column>
        </Grid>
    );
};
