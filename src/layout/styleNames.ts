export const styleNames = (...styles: object[]) =>
{
    let mergedStyle = {};

    styles.filter(Boolean).forEach(style => mergedStyle = { ...mergedStyle, ...style });

    return mergedStyle;
};
