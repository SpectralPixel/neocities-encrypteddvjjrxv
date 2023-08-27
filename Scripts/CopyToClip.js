function delay(ms){
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function copyToClipboard(text, element){
    let previousText = element.innerHTML;

    navigator.clipboard.writeText(text).then(
        () => { /* clipboard successfully set */
            element.innerHTML = "Copied!";
            console.log("Clipboard data set to " + text + ".");
        },
        () => { /* clipboard write failed */
            element.innerHTML = "Something went wrong...";
            console.error("Clipboard data could not be set!");
        },
    );

    await delay(2000);

    element.innerHTML = previousText;
}