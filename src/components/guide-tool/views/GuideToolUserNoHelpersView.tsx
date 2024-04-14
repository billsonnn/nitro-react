import { FC } from 'react';
import { LocalizeText } from '../../../api';
import { Text } from '../../../common';

export const GuideToolUserNoHelpersView: FC<{}> = props =>
{
    return (
        <div className="flex flex-col gap-1">
            <Text bold>{ LocalizeText('guide.help.request.no_tour_guides.title') }</Text>
            <Text>{ LocalizeText('guide.help.request.no_tour_guides.message') }</Text>
        </div>
    );
};
