import { FC } from 'react';
import { PurseView } from '../purse/PurseView';
import { RightSideProps } from './RightSideView.types';

export const RightSideView: FC<RightSideProps> = props =>
{
    return (
        <div className="nitro-right-side">
            <div className="d-flex flex-column">
                <PurseView />
            </div>
        </div>
    );
}
