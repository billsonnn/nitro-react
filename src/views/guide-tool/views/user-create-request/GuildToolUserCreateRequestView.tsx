import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { NitroCardContentView } from '../../../../layout';

export const GuildToolUserCreateRequestView: FC<{}> = props =>
{
    return (
        <NitroCardContentView className="text-black flex flex-column gap-2">
            <div className="duty-status p-2 text-center">
                { LocalizeText('guide.help.request.user.create.help') }
            </div>
            
        </NitroCardContentView>
    );
};
