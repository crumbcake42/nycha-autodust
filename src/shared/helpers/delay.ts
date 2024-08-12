export const delay = async (t: number) =>
    new Promise(res => {
        setTimeout(res, t);
    });

export default delay;
