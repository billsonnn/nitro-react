import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Base, Button, Column, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useDoorbellWidget } from '../../../../hooks';

export const DoorbellWidgetView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const { users = [], answer = null } = useDoorbellWidget();

    useEffect(() =>
    {
        setIsVisible(!!users.length);
    }, [ users ]);

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-widget-doorbell" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.doorbell.title') } onCloseClick={ event => setIsVisible(false) } />
            <NitroCardContentView overflow="hidden" gap={ 0 }>
                <Column gap={ 2 }>
                    <Grid gap={ 1 } className="text-black fw-bold border-bottom px-1 pb-1">
                        <Base className="g-col-6">{ LocalizeText('generic.username') }</Base>
                        <Base className="g-col-6"></Base>
                    </Grid>
                </Column>
                <Column overflow="auto" className="striped-children" gap={ 0 }>
                    { users && (users.length > 0) && users.map(userName =>
                    {
                        return (
                            <Grid key={ userName } gap={ 1 } alignItems="center" className="text-black border-bottom p-1">
                                <Base className="g-col-6">{ userName }</Base>
                                <Base className="g-col-6">
                                    <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                                        <Button variant="success" onClick={ () => answer(userName, true) }>
                                            { LocalizeText('generic.accept') }
                                        </Button>
                                        <Button variant="danger" onClick={ () => answer(userName, false) }>
                                            { LocalizeText('generic.deny') }
                                        </Button>
                                    </Flex>
                                </Base>
                            </Grid>
                        );
                    }) }
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
