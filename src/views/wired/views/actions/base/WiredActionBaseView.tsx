import { WiredActionDefinition } from 'nitro-renderer';
import Slider from 'rc-slider';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { GetWiredTimeLocale } from '../../../common/GetWiredTimeLocale';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredBaseView } from '../../base/WiredBaseView';
import { WiredActionBaseViewProps } from './WiredActionBaseView.types';

export const WiredActionBaseView: FC<WiredActionBaseViewProps> = props =>
{
    const { requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, children = null } = props;
    const [ delay, setDelay ] = useState(-1);
    const { trigger = null, setActionDelay = null } = useWiredContext();

    useEffect(() =>
    {
        setDelay((trigger as WiredActionDefinition).delayInPulses);
    }, [ trigger ]);

    const onSave = useCallback(() =>
    {
        if(save) save();

        setActionDelay(delay);
    }, [ delay, save, setActionDelay ]);

    return (
        <WiredBaseView wiredType="action" requiresFurni={ requiresFurni } save={ onSave }>
            { !children ? null : <>
                { children }
                <hr className="my-1 mb-2 bg-dark" />
            </> }
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.delay', [ 'seconds' ], [ GetWiredTimeLocale(delay) ]) }</div>
            <Slider 
                defaultValue={ delay }
                dots={ true }
                min={ 0 }
                max={ 20 }
                onChange={ event => setDelay(event) }
                />
        </WiredBaseView>
    );
}
