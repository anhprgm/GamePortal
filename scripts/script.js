const cipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);

    return text => text.split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
}

class Item {
    constructor(name, image, iframelink) {
        this.name = name;
        this.image = image;
        this.iframelink = iframelink;
    }
}

fetch('https://raw.githubusercontent.com/anhprgm/GamePortal/refs/heads/main/data/data.json')
    .then(response => response.json()) 
    .then(data => {
        parseGameData(data);
    })
    .catch(error => console.error('Error loading JSON:', error));

function parseGameData(data) {
    const items = [];
    data.forEach(game => {
        items.push(new Item(game.name, `https://r3s.rbogame.com/${game.image.file_path}`, `https://rbogame.com/game/${game.url}/play/iframe`));
    });
    renderItems(items);
}

const gameGrid = document.querySelector('.game-grid');
const searchInput = document.getElementById('search-input');

function renderItems(filteredItems) {
    gameGrid.innerHTML = ''; // Clear previous items
    filteredItems.forEach(item => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');

        gameCard.innerHTML = `
            <div class="image-container">
                <img src="${item.image}" alt=${item.image})}>
            </div>
            <p>${item.name}</p>
        `;
        gameCard.addEventListener('click', () => {
            handleClick(item.name);
            window.open(`/play/play.html?game=${encrypt(item.iframelink)}`, '_self');
        });
        gameGrid.appendChild(gameCard);
    });
}

function handleClick(gameName) {
    console.log(`You clicked on ${gameName}`);
}

function searchGame() {
    const query = searchInput.value.toLowerCase();
    const filteredItems = items.filter(item => item.name.toLowerCase().includes(query));
    renderItems(filteredItems);
}

function encrypt(url) {
    let myCipher = cipher("12345678");
    return myCipher(url);
}


searchInput.addEventListener('input', searchGame);


