import { FC } from 'react';
import { LocalizeText } from '../../../api';
import { Text } from '../../../common';
import { useWired } from '../../../hooks';

export const WiredFurniSelectorView: FC<{}> = props =>
{
    const { trigger = null, furniIds = [] } = useWired();

    return (
        <div className="flex flex-col gap-1">
            <Text bold>{ LocalizeText('wiredfurni.pickfurnis.caption', [ 'count', 'limit' ], [ furniIds.length.toString(), trigger.maximumItemSelectionCount.toString() ]) }</Text>
            <Text small>{ LocalizeText('wiredfurni.pickfurnis.desc') }</Text>
        </div>
    );
};
