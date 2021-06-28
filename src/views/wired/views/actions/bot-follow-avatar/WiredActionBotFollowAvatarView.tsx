import { FC, useEffect, useState } from 'react';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

export const WiredActionBotFollowAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ followMode, setFollowMode ] = useState(-1);
    const { trigger = null, setStringParam = null } = useWiredContext();

    useEffect(() =>
    {
        setBotName(trigger.stringData);
        setFollowMode((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType._Str_5431 } save={ null }>
            BOT_CHANGE_FIGURE
        </WiredActionBaseView>
    );
}
