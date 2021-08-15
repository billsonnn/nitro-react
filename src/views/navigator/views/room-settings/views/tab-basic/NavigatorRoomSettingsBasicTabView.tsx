import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { GetMaxVisitorsList } from '../../../../common/RoomSettingsUtils';
import { useNavigatorContext } from '../../../../context/NavigatorContext';
import { NavigatorRoomSettingsTabViewProps } from '../../NavigatorRoomSettingsView.types';

export const NavigatorRoomSettingsBasicTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomSettingsData = null, setRoomSettingsData = null, onSave = null } = props;
    const [ maxVisitorsList, setMaxVisitorsList ] = useState(GetMaxVisitorsList());
    const { navigatorState = null } = useNavigatorContext();
    const { categories = null } = navigatorState;

    const handleChange = useCallback((field: string, value: string | number | boolean) =>
    {
        const roomSettings = Object.assign({}, roomSettingsData);

        let save = true;

        switch(field)
        {
            case 'name':
                roomSettings.roomName = String(value);
                save = false;
                break;
            case 'description':
                roomSettings.roomDescription = String(value);
                save = false;
                break;
            case 'category':
                roomSettings.categoryId =  Number(value);
                break;
            case 'max_visitors': 
                roomSettings.userCount = Number(value);
                break;
            case 'trade_state':
                roomSettings.tradeState =  Number(value);
                break;
            case 'allow_walkthrough':
                roomSettings.allowWalkthrough = Boolean(value);
                break;
        }

        setRoomSettingsData(roomSettings);

        if(save) onSave();
    }, [ roomSettingsData, setRoomSettingsData, onSave ]);

    return (
        <>
            <div className="form-group mb-1">
                <label>{ LocalizeText('navigator.roomname') }</label>
                <input className="form-control form-control-sm" value={ roomSettingsData.roomName } onChange={ event => handleChange('name', event.target.value) } onBlur={ onSave } />
            </div>
            <div className="form-group mb-1">
                <label>{ LocalizeText('navigator.roomsettings.desc') }</label>
                <input className="form-control form-control-sm" value={ roomSettingsData.roomDescription } onChange={ event => handleChange('description', event.target.value) } onBlur={ onSave } />
            </div>
            <div className="form-group mb-1">
                <label>{ LocalizeText('navigator.category') }</label>
                <select className="form-select form-select-sm" value={ roomSettingsData.categoryId } onChange={ event => handleChange('category', event.target.value) }>
                    { categories && categories.map(category =>
                        {
                            return <option key={ category.id } value={ category.id }>{ LocalizeText(category.name) }</option>
                        }) }
                </select>
            </div>
            <div className="form-group mb-1">
                <label>{ LocalizeText('navigator.maxvisitors') }</label>
                <select className="form-select form-select-sm" value={ roomSettingsData.userCount } onChange={ event => handleChange('max_visitors', event.target.value) }>
                    { maxVisitorsList && maxVisitorsList.map(value =>
                        {
                            return <option key={ value } value={ value }>{ value }</option>
                        }) }
                </select>
            </div>
            <div className="form-group mb-1">
                <label>{ LocalizeText('navigator.tradesettings') }</label>
                <select className="form-select form-select-sm" value={ roomSettingsData.tradeState } onChange={ event => handleChange('trade_state', event.target.value) }>
                    <option value="0">{ LocalizeText('navigator.roomsettings.trade_not_allowed') }</option>
                    <option value="1">{ LocalizeText('navigator.roomsettings.trade_not_with_Controller') }</option>
                    <option value="2">{ LocalizeText('navigator.roomsettings.trade_allowed') }</option>
                </select>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={ roomSettingsData.allowWalkthrough } onChange={ event => handleChange('allow_walkthrough', event.target.checked) } />
                <label className="form-check-label">{ LocalizeText('navigator.roomsettings.allow_walk_through') }</label>
            </div>
            <div className="form-group d-flex justify-content-center mt-1">
                <button type="button" className="btn btn-link btn-sm text-danger fw-bold">
                    <i className="fas fa-times me-1" />
                    { LocalizeText('navigator.roomsettings.delete') }</button>
            </div>
        </>
    );
};
