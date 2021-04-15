import { PurseView } from '../purse/PurseView';
import { RightSideProps } from './RightSideView.types';

export function RightSideView(props: RightSideProps): JSX.Element
{
    return (
        <div className="nitro-right-side">
            <div className="d-flex flex-column">
                <PurseView />
            </div>
        </div>
    );
}
