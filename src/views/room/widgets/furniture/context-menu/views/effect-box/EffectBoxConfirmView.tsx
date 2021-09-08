import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../../../layout';
import { useRoomContext } from '../../../../../context/RoomContext';
import { EffectBoxConfirmViewProps } from './EffectBoxConfirmView.types';

export const EffectBoxConfirmView: FC<EffectBoxConfirmViewProps> = props =>
{
    const { objectId = -1, close = null } = props;
    const { roomSession = null, widgetHandler = null } = useRoomContext();

    const useProduct = useCallback(() =>
    {
        roomSession.useMultistateItem(objectId);

        close();
    }, [ roomSession, objectId, close ]);
    
    return (
        <NitroCardView className="nitro-use-product-confirmation">
            <NitroCardHeaderView headerText={ LocalizeText('effectbox.header.title') } onCloseClick={ close } />
            <NitroCardContentView className="d-flex">
                <div className="row">
                    <div className="col d-flex flex-column justify-content-between">
                        <div className="d-flex flex-column">
                            <div className="text-black">{ LocalizeText('effectbox.header.description') }</div>
                        </div>
                        <div className="d-flex justify-content-between align-items-end w-100 h-100">
                            <button type="button" className="btn btn-danger" onClick={ close }>{ LocalizeText('generic.cancel') }</button>
                            <button type="button" className="btn btn-primary" onClick={ useProduct }>{ LocalizeText('generic.ok') }</button>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
