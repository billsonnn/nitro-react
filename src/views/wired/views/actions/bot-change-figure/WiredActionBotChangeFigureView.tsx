import { FC, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager } from '../../../../../api';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { AvatarImageView } from '../../../../shared/avatar-image/AvatarImageView';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType, WIRED_STRING_DELIMETER } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

const DEFAULT_FIGURE: string = 'hd-180-1.ch-210-66.lg-270-82.sh-290-81';

export const WiredActionBotChangeFigureView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ figure, setFigure ] = useState('');
    const { trigger = null, setStringParam = null } = useWiredContext();

    useEffect(() =>
    {
        const data = trigger.stringData.split(WIRED_STRING_DELIMETER);

        if(data.length > 0) setBotName(data[0]);
        if(data.length > 1) setFigure(data[1].length > 0 ? data[1] : DEFAULT_FIGURE);
    }, [ trigger ]);

    const copyLooks = useCallback(() =>
    {
        setFigure(GetSessionDataManager().figure);
    }, []);

    const save = useCallback(() =>
    {
        setStringParam((botName + WIRED_STRING_DELIMETER + figure));
    }, [ botName, figure, setStringParam ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-group">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.bot.name') }</label>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </div>
            <div className="d-flex align-items-center justify-content-center">
                <AvatarImageView figure={ figure } direction={ 4 } />
                <button type="button" className="btn btn-primary" onClick={ copyLooks }>{ LocalizeText('wiredfurni.params.capture.figure') }</button>
            </div>
        </WiredActionBaseView>
    );
}
