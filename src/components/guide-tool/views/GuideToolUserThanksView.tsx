import { FC } from 'react';
import { LocalizeText } from '../../../api';
import { Column, Text } from '../../../common';

export const GuideToolUserThanksView: FC<{}> = props =>
{
    return (
        <Column gap={ 1 }>
            <Text bold>{ LocalizeText('guide.help.request.user.thanks.info.title') }</Text>
            <Text>{ LocalizeText('guide.help.request.user.thanks.info.desc') }</Text>
        </Column>
    );
};
