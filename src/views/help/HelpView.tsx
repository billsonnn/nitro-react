import { FC } from 'react';
import { HelpMessageHandler } from './HelpMessageHandler';

export const HelpView: FC<{}> = props =>
{
    return (
        <>
            <HelpMessageHandler />
        </>
    );
}
