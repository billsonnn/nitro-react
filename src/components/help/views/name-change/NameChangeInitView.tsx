import { GetSessionDataManager } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { NameChangeLayoutViewProps } from './NameChangeView.types';

export const NameChangeInitView: FC<NameChangeLayoutViewProps> = props =>
{
    const { onAction = null } = props;

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="bg-muted rounded p-2 text-center">{ LocalizeText('tutorial.name_change.info.main') }</div>
            <div className="font-bold	 flex items-center justify-center size-full">{ LocalizeText('tutorial.name_change.current', [ 'name' ], [ GetSessionDataManager().userName ]) }</div>
            <div className="flex gap-2">
                <button className="btn btn-success w-full" onClick={ () => onAction('start') }>{ LocalizeText('tutorial.name_change.change') }</button>
                <button className="btn btn-primary w-full" onClick={ () => onAction('confirmation', GetSessionDataManager().userName) }>{ LocalizeText('tutorial.name_change.keep') }</button>
            </div>
        </div>
    );
};
