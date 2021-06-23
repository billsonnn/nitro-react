import { FC } from 'react';
import { NotificationTrayItemViewProps } from './NotificationTrayItemView.types';

export const NotificationTrayItemView: FC<NotificationTrayItemViewProps> = props =>
{
    const { title = null, content = null, timestamp = null, onCloseClick = null } = props;
    
    return (
        <div className="rounded bg-muted mb-2 text-black">
            <div className="py-1 px-2 fw-bold d-flex justify-content-between align-items-center">
                <div className="me-2">{ title }</div>
                <i className="fas fa-times cursor-pointer" onClick={ onCloseClick }></i>
            </div>
            <div className="py-1 px-2">
                { content }
            </div>
            <div className="py-1 px-2">
                <i className="far fa-clock"></i> { timestamp }
            </div>
        </div>
    );
};
