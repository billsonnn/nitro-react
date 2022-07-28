export const GetIssueCategoryName = (categoryId: number) =>
{
    switch(categoryId)
    {
        case 1:
        case 2:
            return 'Normal';
        case 3:
            return 'Automatic';
        case 4:
            return 'Automatic IM';
        case 5:
            return 'Guide System';
        case 6:
            return 'IM';
        case 7:
            return 'Room';
        case 8:
            return 'Panic';
        case 9:
            return 'Guardian';
        case 10:
            return 'Automatic Helper';
        case 11:
            return 'Discussion';
        case 12:
            return 'Selfie';
        case 14:
            return 'Photo';
        case 15:
            return 'Ambassador';
    }

    return 'Unknown';
}
