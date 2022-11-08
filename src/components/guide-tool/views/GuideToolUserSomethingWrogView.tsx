import { FC } from 'react';
import { LocalizeText } from '../../../api';
import { Column, Text } from '../../../common';

export const GuideToolUserSomethingWrogView: FC<{}> = props =>
{
    return (
        <Column gap={ 1 }>
            <Text>{ LocalizeText('guide.help.request.user.guide.disconnected.error.desc') }</Text>
        </Column>
    );
};