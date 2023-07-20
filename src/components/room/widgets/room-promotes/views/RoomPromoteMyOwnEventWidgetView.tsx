import { FC } from 'react';
import { CreateLinkEvent, LocalizeText } from '../../../../../api';
import { Button, Flex, Grid, Text } from '../../../../../common';
import { useRoomPromote } from '../../../../../hooks';

interface RoomPromoteMyOwnEventWidgetViewProps
{
    eventDescription: string;
    setIsEditingPromote: (value: boolean) => void;
}

export const RoomPromoteMyOwnEventWidgetView: FC<RoomPromoteMyOwnEventWidgetViewProps> = props =>
{
    const { eventDescription = '', setIsEditingPromote = null } = props;
    const { setIsExtended } = useRoomPromote();

    const extendPromote = () =>
    {
        setIsExtended(true);
        CreateLinkEvent('catalog/open/room_event');
    }

    return (
        <>
            <Flex alignItems="center" gap={ 2 } style={ { overflowWrap: 'anywhere' } }>
                <Text variant="white">{ eventDescription }</Text>
            </Flex>
            <br /><br />
            <Grid className="d-flex align-items-center justify-content-end gap-2">
                <Button className="btn btn-primary w-100 btn-sm" onClick={ event => setIsEditingPromote(true) }>{ LocalizeText('navigator.roominfo.editevent') }</Button>
                <Button className="btn btn-success w-100 btn-sm" onClick={ event => extendPromote() }>{ LocalizeText('roomad.extend.event') }</Button>
            </Grid>
        </>
    );
};
