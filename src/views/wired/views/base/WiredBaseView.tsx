import { FC, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager } from '../../../../api';
import { WiredEvent } from '../../../../events';
import { dispatchUiEvent } from '../../../../hooks/events';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { useWiredContext } from '../../context/WiredContext';
import { WiredFurniType } from '../../WiredView.types';
import { WiredBaseViewProps } from './WiredBaseView.types';

export const WiredBaseView: FC<WiredBaseViewProps> = props =>
{
    const { wiredType = '', requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, children = null } = props;
    const [ wiredName, setWiredName ] = useState<string>(null);
    const [ wiredDescription, setWiredDescription ] = useState<string>(null);
    const { trigger = null, setTrigger = null, setIntParams = null, setStringParam = null, setFurniIds = null } = useWiredContext();

    useEffect(() =>
    {
        if(!trigger) return;

        const spriteId = (trigger.spriteId || -1);

        const furniData = GetSessionDataManager().getFloorItemData(spriteId);

        if(!furniData)
        {
            setWiredName(('NAME: ' + spriteId));
            setWiredDescription(('NAME: ' + spriteId));
        }
        else
        {
            setWiredName(furniData.name);
            setWiredDescription(furniData.description);
        }

        setIntParams(trigger.intData);
        setStringParam(trigger.stringData);
        setFurniIds(trigger.selectedItems);
    }, [ trigger, setIntParams, setStringParam, setFurniIds ]);

    const onSave = useCallback(() =>
    {
        if(save) save();

        setTimeout(() => dispatchUiEvent(new WiredEvent(WiredEvent.SAVE_WIRED)), 1);
    }, [ save ]);

    const close = useCallback(() =>
    {
        setTrigger(null);
    }, [ setTrigger ]);

    return (
        <NitroCardView className="nitro-wired" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('wiredfurni.title') } onCloseClick={ close } />
            <NitroCardContentView className="text-black">
                <div className="d-flex align-items-center">
                    <i className={ `me-2 icon icon-wired-${ wiredType }` } />
                    <div className="fw-bold">{ wiredName }</div>
                </div>
                <div>{ wiredDescription }</div>
                <div>
                    { !children ? null : <>
                        <hr className="my-1 mb-2 bg-dark" />
                        { children }
                    </> }
                </div>
                { (requiresFurni !== WiredFurniType.STUFF_SELECTION_OPTION_NONE) &&
                    <>
                        <hr className="my-1 mb-2 bg-dark" />
                        <div className="fw-bold">{ LocalizeText('wiredfurni.pickfurnis.caption', [ 'count', 'limit' ], [ '0', trigger.maximumItemSelectionCount.toString() ]) }</div>
                        <div>{ LocalizeText('wiredfurni.pickfurnis.desc') }</div>
                    </> }
                <div className="d-flex mt-3">
                    <button className="btn btn-success  btn-sm me-2 w-100" onClick={ onSave }>{ LocalizeText('wiredfurni.ready') }</button>
                    <button className="btn btn-secondary btn-sm w-100" onClick={ close }>{ LocalizeText('cancel') }</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
