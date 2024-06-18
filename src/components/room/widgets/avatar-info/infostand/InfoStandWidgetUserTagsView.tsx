import { CreateLinkEvent, NavigatorSearchComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { SendMessageComposer } from '../../../../../api';
import { Flex, Text } from '../../../../../common';

interface InfoStandWidgetUserTagsViewProps
{
    tags: string[];
}

const processAction = (tag: string) =>
{
    CreateLinkEvent(`navigator/search/${ tag }`);
    SendMessageComposer(new NavigatorSearchComposer('hotel_view', `tag:${ tag }`));
};

export const InfoStandWidgetUserTagsView: FC<InfoStandWidgetUserTagsViewProps> = props =>
{
    const { tags = null } = props;

    if(!tags || !tags.length) return null;

    return (
        <>
            <hr className="m-0" />
            <Flex className="flex-tags">
                { tags && (tags.length > 0) && tags.map((tag, index) => <Text key={ index } className="text-tags" variant="white" onClick={ event => processAction(tag) }>{ tag }</Text>) }
            </Flex>
        </>
    );
};
