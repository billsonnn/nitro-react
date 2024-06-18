export const GetCloseReasonKey = (code: number) =>
{
    if(code === 1) return 'useless';

    if(code === 2) return 'abusive';

    return 'resolved';
};
