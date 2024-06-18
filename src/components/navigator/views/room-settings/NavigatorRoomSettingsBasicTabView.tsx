import { CreateLinkEvent, RoomDeleteComposer, RoomSettingsSaveErrorEvent, RoomSettingsSaveErrorParser } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { GetMaxVisitorsList, IRoomData, LocalizeText, SendMessageComposer } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useMessageEvent, useNavigator, useNotification } from '../../../../hooks';
import { NitroInput } from '../../../../layout';

const ROOM_NAME_MIN_LENGTH = 3;
const ROOM_NAME_MAX_LENGTH = 60;
const DESC_MAX_LENGTH = 255;
const TAGS_MAX_LENGTH = 15;

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean | string[]) => void;
    onClose: () => void;
}

export const NavigatorRoomSettingsBasicTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null, onClose = null } = props;
    const [ roomName, setRoomName ] = useState<string>('');
    const [ roomDescription, setRoomDescription ] = useState<string>('');
    const [ roomTag1, setRoomTag1 ] = useState<string>('');
    const [ roomTag2, setRoomTag2 ] = useState<string>('');
    const [ tagIndex, setTagIndex ] = useState(0);
    const [ typeError, setTypeError ] = useState<string>('');
    const { showConfirm = null } = useNotification();
    const { categories = null } = useNavigator();

    useMessageEvent<RoomSettingsSaveErrorEvent>(RoomSettingsSaveErrorEvent, event =>
    {
        const parser = event.getParser();

        if(!parser) return;

        switch(parser.code)
        {
            case RoomSettingsSaveErrorParser.ERROR_INVALID_TAG:
                setTypeError('navigator.roomsettings.unacceptablewords');
            case RoomSettingsSaveErrorParser.ERROR_NON_USER_CHOOSABLE_TAG:
                setTypeError('navigator.roomsettings.nonuserchoosabletag');
                break;
            default:
                setTypeError('');
                break;
        }
    });

    const deleteRoom = () =>
    {
        showConfirm(LocalizeText('navigator.roomsettings.deleteroom.confirm.message', [ 'room_name' ], [ roomData.roomName ]), () =>
        {
            SendMessageComposer(new RoomDeleteComposer(roomData.roomId));

            if(onClose) onClose();

            CreateLinkEvent('navigator/search/myworld_view');
        },
        null, null, null, LocalizeText('navigator.roomsettings.deleteroom.confirm.title'));
    };

    const saveRoomName = () =>
    {
        if((roomName === roomData.roomName) || (roomName.length < ROOM_NAME_MIN_LENGTH) || (roomName.length > ROOM_NAME_MAX_LENGTH)) return;

        handleChange('name', roomName);
    };

    const saveRoomDescription = () =>
    {
        if((roomDescription === roomData.roomDescription) || (roomDescription.length > DESC_MAX_LENGTH)) return;

        handleChange('description', roomDescription);
    };

    const saveTags = (index: number) =>
    {
        if(index === 0 && (roomTag1 === roomData.tags[0]) || (roomTag1.length > TAGS_MAX_LENGTH)) return;

        if(index === 1 && (roomTag2 === roomData.tags[1]) || (roomTag2.length > TAGS_MAX_LENGTH)) return;

        if(roomTag1 === '' && roomTag2 !== '') setRoomTag2('');

        setTypeError('');
        setTagIndex(index);
        handleChange('tags', (roomTag1 === '' && roomTag2 !== '') ? [ roomTag2 ] : [ roomTag1, roomTag2 ]);
    };

    useEffect(() =>
    {
        setRoomName(roomData.roomName);
        setRoomDescription(roomData.roomDescription);
        setRoomTag1((roomData.tags.length > 0 && roomData.tags[0]) ? roomData.tags[0] : '');
        setRoomTag2((roomData.tags.length > 0 && roomData.tags[1]) ? roomData.tags[1] : '');
    }, [ roomData ]);

    return (
        <>
            <div className="flex items-center gap-1">
                <Text className="col-span-3">{ LocalizeText('navigator.roomname') }</Text>
                <Column fullWidth gap={ 0 }>
                    <NitroInput maxLength={ ROOM_NAME_MAX_LENGTH } value={ roomName } onBlur={ saveRoomName } onChange={ event => setRoomName(event.target.value) } />
                    { (roomName.length < ROOM_NAME_MIN_LENGTH) &&
                        <Text bold small variant="danger">
                            { LocalizeText('navigator.roomsettings.roomnameismandatory') }
                        </Text> }
                </Column>
            </div>
            <div className="flex items-center gap-1">
                <Text className="col-span-3">{ LocalizeText('navigator.roomsettings.desc') }</Text>
                <textarea className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem] form-control-sm" maxLength={ DESC_MAX_LENGTH } value={ roomDescription } onBlur={ saveRoomDescription } onChange={ event => setRoomDescription(event.target.value) } />
            </div>
            <div className="flex items-center gap-1">
                <Text className="col-span-3">{ LocalizeText('navigator.category') }</Text>
                <select className="form-select form-select-sm" value={ roomData.categoryId } onChange={ event => handleChange('category', event.target.value) }>
                    { categories && categories.map(category => <option key={ category.id } value={ category.id }>{ LocalizeText(category.name) }</option>) }
                </select>
            </div>
            <div className="flex items-center gap-1">
                <Text className="col-span-3">{ LocalizeText('navigator.maxvisitors') }</Text>
                <select className="form-select form-select-sm" value={ roomData.userCount } onChange={ event => handleChange('max_visitors', event.target.value) }>
                    { GetMaxVisitorsList && GetMaxVisitorsList.map(value => <option key={ value } value={ value }>{ value }</option>) }
                </select>
            </div>
            <div className="flex items-center gap-1">
                <Text className="col-span-3">{ LocalizeText('navigator.tradesettings') }</Text>
                <select className="form-select form-select-sm" value={ roomData.tradeState } onChange={ event => handleChange('trade_state', event.target.value) }>
                    <option value="0">{ LocalizeText('navigator.roomsettings.trade_not_allowed') }</option>
                    <option value="1">{ LocalizeText('navigator.roomsettings.trade_not_with_Controller') }</option>
                    <option value="2">{ LocalizeText('navigator.roomsettings.trade_allowed') }</option>
                </select>
            </div>
            <div className="flex items-center gap-1">
                <Text className="col-span-3">{ LocalizeText('navigator.tags') }</Text>
                <Column fullWidth gap={ 0 }>
                    <NitroInput value={ roomTag1 } onBlur={ () => saveTags(0) } onChange={ event => setRoomTag1(event.target.value) } />
                    { (roomTag1.length > TAGS_MAX_LENGTH) &&
                        <Text bold small variant="danger">
                            { LocalizeText('navigator.roomsettings.toomanycharacters') }
                        </Text> }
                    { (tagIndex === 0 && typeError != '') &&
                        <Text bold small variant="danger">
                            { LocalizeText(typeError) }
                        </Text> }
                </Column>
                <Column fullWidth gap={ 0 }>
                    <NitroInput value={ roomTag2 } onBlur={ () => saveTags(1) } onChange={ event => setRoomTag2(event.target.value) } />
                    { (roomTag2.length > TAGS_MAX_LENGTH) &&
                        <Text bold small variant="danger">
                            { LocalizeText('navigator.roomsettings.toomanycharacters') }
                        </Text> }
                    { (tagIndex === 1 && typeError != '') &&
                        <Text bold small variant="danger">
                            { LocalizeText(typeError) }
                        </Text> }
                </Column>
            </div>
            <div className="flex items-center gap-1">
                <div className="col-span-3" />
                <input checked={ roomData.allowWalkthrough } className="form-check-input" type="checkbox" onChange={ event => handleChange('allow_walkthrough', event.target.checked) } />
                <Text>{ LocalizeText('navigator.roomsettings.allow_walk_through') }</Text>
            </div>
            <Text bold pointer underline className="flex items-center justify-center gap-1" variant="danger" onClick={ deleteRoom }>
                <FaTimes className="fa-icon" />
                { LocalizeText('navigator.roomsettings.delete') }
            </Text>
        </>
    );
};
