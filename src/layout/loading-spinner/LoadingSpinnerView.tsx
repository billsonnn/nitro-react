import { FC } from 'react';

export const LoadingSpinnerView: FC = props =>
{
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
            <div className="spinner"></div>
            <div className="spinner"></div>
        </div>
    );
}
