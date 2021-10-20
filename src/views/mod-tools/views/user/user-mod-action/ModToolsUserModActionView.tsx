import { FC } from 'react';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { ModToolsUserModActionViewProps } from './ModToolsUserModActionView.types';

export const ModToolsUserModActionView: FC<ModToolsUserModActionViewProps> = props =>
{
    const { user = null, onCloseClick = null } = props;

    return (
        <NitroCardView className="nitro-mod-tools-user-action" simple={true}>
            <NitroCardHeaderView headerText={'Mod Action'} onCloseClick={() => onCloseClick()} />
            <NitroCardContentView className="text-black">
                {user && <div></div>}
            </NitroCardContentView>
        </NitroCardView>
    );
}
