import {getFormatByURL} from "./output_style";

export const enableRestaAddStyleButton = (onClick: () => void) => {
    const addButton = document.getElementById('resta-add-style');
    if (addButton) {
        addButton.style.display = "block";
        addButton.addEventListener('click', onClick);
    }
}

export const injectStyleJson = async (url: string) => {
    (document.getElementById('resta-style-json') as HTMLInputElement).value = JSON.stringify(await getFormatByURL(url));
}