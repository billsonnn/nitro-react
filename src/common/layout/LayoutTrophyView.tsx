import { FC } from 'react';
import { LocalizeText } from '../../api';
import { Base } from '../Base';
import { Column } from '../Column';
import { Flex } from '../Flex';
import { Text } from '../Text';
import { DraggableWindow } from '../draggable-window';

interface LayoutTrophyViewProps
{
    color: string;
    message: string;
    date: string;
    senderName: string;
    customTitle?: string;
    onCloseClick: () => void;
}

export const LayoutTrophyView: FC<LayoutTrophyViewProps> = props =>
{
    const { color = '', message = '', date = '', senderName = '', customTitle = null, onCloseClick = null } = props;

    return (
        <DraggableWindow handleSelector=".drag-handler">
            <Column gap={ 0 } alignItems="center" className={ `nitro-layout-trophy trophy-${ color }` }>
                <Flex center fullWidth position="relative" className="trophy-header drag-handler">
                    <Base position="absolute" pointer className="trophy-close" onClick={ onCloseClick } />
                    <Text bold>{ LocalizeText('widget.furni.trophy.title') }</Text>
                </Flex>
                <Column className="trophy-content py-1" gap={ 1 }>
                    { customTitle &&
                        <Text bold>{ customTitle }</Text> }
                    { message }
                </Column>
                <Flex alignItems="center" justifyContent="between" className="trophy-footer mt-1">
                    <Text bold>{ date }</Text>
                    <Text bold>{ senderName }</Text>
                </Flex>
            </Column>
        </DraggableWindow>
    );
}
