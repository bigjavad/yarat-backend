export const CreatorSlug = (data: string[]) => {
    let fullData: string = "";
    data.forEach((item: string, key: number) => {
        if (key < data.length - 1) {
            fullData += item + " ";
        } else {
            fullData += item;
        }
    });
    fullData = fullData.replaceAll(" ", "-");
    return fullData;
};
