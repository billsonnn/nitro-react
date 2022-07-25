import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
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
                    <ObjectLocationView key={ index } objectId={ objectId } category={ RoomObjectCategory.FLOOR }>
                        <Column className="nitro-widget-high-score nitro-context-menu" gap={ 0 }>
                            <ContextMenuHeaderView>
                                { LocalizeText('high.score.display.caption', [ 'scoretype', 'cleartype' ], [ LocalizeText(`high.score.display.scoretype.${ getScoreType(stuffData.scoreType) }`), LocalizeText(`high.score.display.cleartype.${ getClearType(stuffData.clearType) }`) ]) }
                            </ContextMenuHeaderView>
                            <ContextMenuListView overflow="hidden" gap={ 1 } className="h-100">
                                <Column gap={ 1 }>
                                    <Flex alignItems="center">
                                        <Text center bold variant="white" className="col-8">
                                            { LocalizeText('high.score.display.users.header') }
                                        </Text>
                                        <Text center bold variant="white" className="col-4">
                                            { LocalizeText('high.score.display.score.header') }
                                        </Text>
                                    </Flex>
                                    <hr className="m-0" />
                                </Column>
                                <Column overflow="auto" gap={ 1 } className="overflow-y-scroll">
                                    { stuffData.entries.map((entry, index) =>
                                    {
                                        return (
                                            <Flex key={ index } alignItems="center">
                                                <Text center variant="white" className="col-8">
                                                    { entry.users.join(', ') }
                                                </Text>
                                                <Text center variant="white" className="col-4">
                                                    { entry.score }
                                                </Text>
                                            </Flex>
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
}
