import { WiredActionDefinition } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText } from '../../../../api';
import { GetWiredTimeLocale } from '../../common/GetWiredTimeLocale';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredBaseView } from '../WiredBaseView';

export interface WiredActionBaseViewProps
{
    requiresFurni: number;
    save: () => void;
}

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
            <div className="form-group">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.delay', [ 'seconds' ], [ GetWiredTimeLocale(delay) ]) }</label>
                <ReactSlider
                    className={ 'nitro-slider' }
                    min={ 0 }
                    max={ 20 }
                    value={ delay }
                    onChange={ event => setDelay(event) } />
            </div>
        </WiredBaseView>
    );
}
