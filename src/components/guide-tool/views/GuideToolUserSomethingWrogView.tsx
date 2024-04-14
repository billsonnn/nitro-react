import { FC } from 'react';
import { LocalizeText } from '../../../api';
import { Text } from '../../../common';

export const GuideToolUserSomethingWrogView: FC<{}> = props =>
{
    return (
        <div className="flex flex-col gap-1">
            <Text>{ LocalizeText('guide.help.request.user.guide.disconnected.error.desc') }</Text>
        </div>
    );
};
