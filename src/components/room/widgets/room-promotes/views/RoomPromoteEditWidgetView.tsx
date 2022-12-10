import { EditEventMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../../api';
import { Button, Column, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../../common';

interface RoomPromoteEditWidgetViewProps
{
    eventId: number;
    eventName: string;
    eventDescription: string;
    setIsEditingPromote: (value: boolean) => void;
}

export const RoomPromoteEditWidgetView: FC<RoomPromoteEditWidgetViewProps> = props =>
{
    const { eventId = -1, eventName = '', eventDescription = '', setIsEditingPromote = null } = props;
    const [ newEventName, setNewEventName ] = useState<string>(eventName);
    const [ newEventDescription, setNewEventDescription ] = useState<string>(eventDescription);

    const updatePromote = () =>
    {
        SendMessageComposer(new EditEventMessageComposer(eventId, newEventName, newEventDescription));
        setIsEditingPromote(false);
    }

    return (
        <NitroCardView className="nitro-guide-tool" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.eventsettings.editcaption') } onCloseClick={ () => setIsEditingPromote(false) } />
            <NitroCardContentView className="text-black">
                <Column>
                    <Text bold>{ LocalizeText('navigator.eventsettings.name') }</Text>
                    <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('navigator.eventsettings.name') } maxLength={ 64 } value={ newEventName } onChange={ event => setNewEventName(event.target.value) } />
                </Column>
                <Column>
                    <Text bold>{ LocalizeText('navigator.eventsettings.desc') }</Text>
                    <textarea className="form-control form-control-sm" placeholder={ LocalizeText('navigator.eventsettings.desc') } maxLength={ 64 } value={ newEventDescription } onChange={ event => setNewEventDescription(event.target.value) }></textarea>
                </Column>
                <Column>
                    <Button fullWidth disabled={ !newEventName || !newEventDescription } variant={ (!newEventName || !newEventDescription) ? 'danger' : 'success' } onClick={ event => updatePromote() }>{ LocalizeText('navigator.eventsettings.edit') }</Button>
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
};
