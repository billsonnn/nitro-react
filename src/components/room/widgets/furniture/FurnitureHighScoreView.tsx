import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useFurnitureHighScoreWidget } from '../../../../hooks';
import { ContextMenuHeaderView } from '../context-menu/ContextMenuHeaderView';
import { ContextMenuListView } from '../context-menu/ContextMenuListView';
import { ObjectLocationView } from '../object-location/ObjectLocationView';

export const FurnitureHighScoreView: FC<{}> = props =>
{
    const { stuffDatas = null, getScoreType = null, getClearType = null } = useFurnitureHighScoreWidget();

    if(!stuffDatas || !stuffDatas.size) return null;

    return (
        <>
            { Array.from(stuffDatas.entries()).map(([ objectId, stuffData ], index) =>
            {
                return (
                    <ObjectLocationView key={ index } category={ RoomObjectCategory.FLOOR } objectId={ objectId }>
                        <Column className="nitro-widget-high-score nitro-context-menu" gap={ 0 }>
                            <ContextMenuHeaderView>
                                { LocalizeText('high.score.display.caption', [ 'scoretype', 'cleartype' ], [ LocalizeText(`high.score.display.scoretype.${ getScoreType(stuffData.scoreType) }`), LocalizeText(`high.score.display.cleartype.${ getClearType(stuffData.clearType) }`) ]) }
                            </ContextMenuHeaderView>
                            <ContextMenuListView className="h-full" gap={ 1 } overflow="hidden">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center">
                                        <Text bold center className="col-span-8" variant="white">
                                            { LocalizeText('high.score.display.users.header') }
                                        </Text>
                                        <Text bold center className="col-span-4" variant="white">
                                            { LocalizeText('high.score.display.score.header') }
                                        </Text>
                                    </div>
                                    <hr className="m-0" />
                                </div>
                                <Column className="overflow-y-scroll" gap={ 1 } overflow="auto">
                                    { stuffData.entries.map((entry, index) =>
                                    {
                                        return (
                                            <div key={ index } className="flex items-center">
                                                <Text center className="col-span-8" variant="white">
                                                    { entry.users.join(', ') }
                                                </Text>
                                                <Text center className="col-span-4" variant="white">
                                                    { entry.score }
                                                </Text>
                                            </div>
                                        );
                                    }) }
                                </Column>
                            </ContextMenuListView>
                        </Column>
                    </ObjectLocationView>
                );
            }) }
        </>
    );
};
