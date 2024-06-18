import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Button, Column, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
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
            <NitroCardContentView gap={ 0 } overflow="hidden">
                <Column gap={ 2 }>
                    <Grid className="text-black font-bold	 border-bottom px-1 pb-1" gap={ 1 }>
                        <div className="col-span-6">{ LocalizeText('generic.username') }</div>
                        <div className="col-span-6" />
                    </Grid>
                </Column>
                <Column className="striped-children" gap={ 0 } overflow="auto">
                    { users && (users.length > 0) && users.map(userName =>
                    {
                        return (
                            <Grid key={ userName } alignItems="center" className="text-black border-bottom p-1" gap={ 1 }>
                                <div className="col-span-6">{ userName }</div>
                                <div className="col-span-6">
                                    <div className="flex items-center gap-1 justify-end">
                                        <Button variant="success" onClick={ () => answer(userName, true) }>
                                            { LocalizeText('generic.accept') }
                                        </Button>
                                        <Button variant="danger" onClick={ () => answer(userName, false) }>
                                            { LocalizeText('generic.deny') }
                                        </Button>
                                    </div>
                                </div>
                            </Grid>
                        );
                    }) }
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
};
