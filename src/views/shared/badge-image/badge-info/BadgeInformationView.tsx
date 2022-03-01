import { FC } from 'react';

interface BadgeInformationViewProps
{
    title: string;
    description: string;
}

export const BadgeInformationView: FC<BadgeInformationViewProps> = props =>
{
    const { title = null, description = null } = props;

    return (
        <div className="badge-information text-black py-1 px-2 small">
            <div className="fw-bold mb-1">{ title }</div>
            <div>{ description }</div>
        </div>
    );
};
