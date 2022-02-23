import { FC } from 'react';
import { LocalizeText } from '../../../api';
import { NitroCardContentView } from '../../../layout';

export const GuideToolUserThanksView: FC<{}> = props =>
{
    return (
        <NitroCardContentView className="text-black flex flex-column gap-2">
            <div className="fw-bold">{ LocalizeText('guide.help.request.user.thanks.info.title') }</div>
            <div>{ LocalizeText('guide.help.request.user.thanks.info.desc') }</div>
        </NitroCardContentView>
    );
};
