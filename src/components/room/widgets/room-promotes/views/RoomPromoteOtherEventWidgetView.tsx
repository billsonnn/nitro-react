import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Base, Column, Flex, Text } from '../../../../../common';

interface RoomPromoteOtherEventWidgetViewProps
{
    eventDescription: string;
}

export const RoomPromoteOtherEventWidgetView: FC<RoomPromoteOtherEventWidgetViewProps> = props =>
{
    const { eventDescription = '' } = props;

    return (
        <>
            <Flex alignItems="center" gap={ 2 } style={ { overflowWrap: 'anywhere' } }>
                <Text variant="white">{ eventDescription }</Text>
            </Flex>
            <br /><br />
            <Column alignItems="center" gap={ 1 }>
                <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark rounded">
                    <Flex fit center position="absolute">
                        <Text variant="white" center>{ LocalizeText('navigator.eventinprogress') }</Text>
                    </Flex>
                    <Text>&nbsp;</Text>
                </Base>
            </Column>
        </>
    );
};
