import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { Button, ButtonGroup, Flex, Text } from '../../../../common';

interface DoorbellWidgetItemViewProps
{
    userName: string;
    accept: () => void;
    deny: () => void;
}

export const DoorbellWidgetItemView: FC<DoorbellWidgetItemViewProps> = props =>
{
    const { userName = '', accept = null, deny = null } = props;

    return (
        <Flex alignItems="center" justifyContent="between">
            <Text bold>{ userName }</Text>
            <ButtonGroup>
                <Button variant="success" onClick={ accept }>
                    <FontAwesomeIcon icon="check" />
                </Button>
                <Button variant="danger" onClick={ deny }>
                    <FontAwesomeIcon icon="times" />
                </Button>
            </ButtonGroup>
        </Flex>
    );
}
