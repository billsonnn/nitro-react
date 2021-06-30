import classNames from 'classnames';
import { HabboClubLevelEnum, RoomCreateComposer } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetConfiguration, GetSessionDataManager } from '../../../../api';
import { SendMessageHook } from '../../../../hooks/messages';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { CurrencyIcon } from '../../../shared/currency-icon/CurrencyIcon';
import { useNavigatorContext } from '../../context/NavigatorContext';
import { NavigatorRoomCreatorViewProps, NAVIGATOR_ROOM_MODELS } from './NavigatorRoomCreatorView.types';

export const NavigatorRoomCreatorView: FC<NavigatorRoomCreatorViewProps> = props =>
{
    const { navigatorState = null } = useNavigatorContext();
    const { categories = null } = navigatorState;

    const [ maxVisitorsList, setMaxVisitorsList ] = useState(null);
    const [ name, setName ] = useState(null);
    const [ description, setDescription ] = useState(null);
    const [ category, setCategory ] = useState(null);
    const [ visitorsCount, setVisitorsCount ] = useState(null);
    const [ tradesSetting, setTradesSetting ] = useState(0);
    const [ selectedModelName, setSelectedModelName ] = useState(NAVIGATOR_ROOM_MODELS[0].name);

    useEffect(() =>
    {
        if(!maxVisitorsList)
        {
            const list = [];

            for(let i = 10; i <= 100; i = i + 10)
            {
                list.push(i);
            }

            setMaxVisitorsList(list);
            setVisitorsCount(list[0]);
        }
    }, []);

    useEffect(() =>
    {
        if(categories) setCategory(categories[0].id);
    }, [ categories ]);
    
    const getRoomModelImage = useCallback((name: string) =>
    {
        return GetConfiguration<string>('images.url') + `/navigator/models/model_${ name }.png`;
    }, []);

    const selectModel = useCallback((name: string) =>
    {
        const model = NAVIGATOR_ROOM_MODELS.find(model => model.name === name);

        if(!model) return;

        if(model.clubLevel > GetSessionDataManager().clubLevel) return;

        setSelectedModelName(name);
    }, [ setSelectedModelName ]);

    const createRoom = useCallback(() =>
    {
        if(!name || name.length < 3) return;

        SendMessageHook(new RoomCreateComposer(name, description, 'model_' + selectedModelName, Number(category), Number(visitorsCount), tradesSetting));
    }, [ name, description, category, visitorsCount, tradesSetting, selectedModelName ]);

    return (
        <div className="text-black d-flex flex-column h-100 justify-content-center">
            <div className="row row-cols-2 mb-2">
                <div className="col mb-2">
                    <div className="form-group">
                        <label>{ LocalizeText('navigator.createroom.roomnameinfo') }</label>
                        <input type="text" className="form-control form-control-sm" onChange={ (e) => setName(e.target.value) } />
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label>{ LocalizeText('navigator.category') }</label>
                        <select className="form-select form-select-sm" onChange={ (e) => setCategory(e.target.value) }>
                            { categories && categories.map(category =>
                                {
                                    return <option key={ category.id } value={ category.id }>{ LocalizeText(category.name) }</option>
                                }) }
                        </select>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label>{ LocalizeText('navigator.maxvisitors') }</label>
                        <select className="form-select form-select-sm" onChange={ (e) => setVisitorsCount(e.target.value) }>
                            { maxVisitorsList && maxVisitorsList.map(value =>
                                {
                                    return <option key={ value } value={ value }>{ value }</option>
                                }) }
                        </select>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label>{ LocalizeText('navigator.tradesettings') }</label>
                        <select className="form-select form-select-sm" onChange={ (e) => setTradesSetting(Number(e.target.value)) }>
                            <option value="0">{ LocalizeText('${navigator.roomsettings.trade_not_allowed}') }</option>
                            <option value="1">{ LocalizeText('${navigator.roomsettings.trade_not_with_Controller}') }</option>
                            <option value="2">{ LocalizeText('${navigator.roomsettings.trade_allowed}') }</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="form-group mb-3">
                <label>{ LocalizeText('navigator.createroom.roomdescinfo') }</label>
                <input type="text" className="form-control form-control-sm" onChange={ (e) => setDescription(e.target.value) } />
            </div>
            <div className="room-model-list pb-2 mb-2">
                {
                    NAVIGATOR_ROOM_MODELS.map(model =>
                        {
                            return (<div key={ model.name } onClick={ () => selectModel(model.name) } className={ 'h-100 cursor-pointer d-flex flex-column justify-content-center align-items-center p-1 me-2 rounded border border-2' + classNames({' active': selectedModelName === model.name, ' disabled': GetSessionDataManager().clubLevel < model.clubLevel}) }>
                                <img src={ getRoomModelImage(model.name) } />
                                <div>{ model.tileSize } { LocalizeText('navigator.createroom.tilesize') }</div>
                                { model.clubLevel > HabboClubLevelEnum.NO_CLUB && <CurrencyIcon type="hc" /> }
                            </div>);
                        })
                }
            </div>
            <button className="btn btn-success float-end" onClick={ () => createRoom() } disabled={ !name || name.length < 3 }>{ LocalizeText('navigator.createroom.create') }</button>
        </div>
    );
}
