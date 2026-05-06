const msg: string = "Hello!";
alert(msg);

const styleDictionary: Record<string, string> = {
    'Styl 1': 'style-1.css',
    'Styl 2': 'style-2.css',
    'Styl 3': 'style-3.css'
};

interface AppState {
    currentStyleName: string;
    currentStyleFile: string;
    styles: Record<string, string>;
}

const state: AppState = {
    currentStyleName: '',
    currentStyleFile: '',
    styles: styleDictionary
};

let currentLinkElement: HTMLLinkElement | null = null;

function changeStyle(styleName: string) {
    const newStyleFile = state.styles[styleName];
    if (!newStyleFile) return;

    const newLink = document.createElement('link');
    newLink.rel = 'stylesheet';
    newLink.href = newStyleFile;

    document.head.appendChild(newLink);

    if (currentLinkElement && currentLinkElement.parentNode) {
        currentLinkElement.parentNode.removeChild(currentLinkElement);
    }

    state.currentStyleName = styleName;
    state.currentStyleFile = newStyleFile;

    currentLinkElement = newLink;
}

function initButtons() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.marginTop = '20px';

    Object.keys(state.styles).forEach((styleName) => {
        const button = document.createElement('button');
        button.textContent = `${styleName}`;
        button.style.marginRight = '10px';
        button.style.padding = '5px 10px';

        button.addEventListener('click', () => {
            changeStyle(styleName);
        });

        buttonsContainer.appendChild(button);
    });

    footer.appendChild(buttonsContainer);
}

function initApp() {
    const firstStyleName = Object.keys(state.styles)[0];

    changeStyle(firstStyleName);

    initButtons();
}

document.addEventListener('DOMContentLoaded', initApp);