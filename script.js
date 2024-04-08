document.addEventListener('DOMContentLoaded', function () {
    const gameForm = document.getElementById('gameForm');
    const gameList = document.getElementById('gameList');
    const searchInput = document.getElementById('searchInput');

    // Function to load games from localStorage on page load
    function loadGames() {
        const games = JSON.parse(localStorage.getItem('games')) || [];
        displayGames(games);
    }

    // Function to display games in the table
    function displayGames(games) {
        // Log the games array to see what data is loaded
        gameList.innerHTML = generateGameTable(games);
        console.log('Games:', games); 
    }

    // Function to generate the game table HTML
    function generateGameTable(games) {
        return `
            <table>
                <tr>
                    <th>Title</th>
                    <th>Publisher</th>
                    <th>Release Date</th>
                    <th>Image</th>
                    <th>Critic Score</th>
                    <th>Personal Score</th>
                    <th>Notes</th>
                    <th>Action</th>
                </tr>
                ${games.map(game => `
                    <tr data-id="${game.id}">
                        <td>${game.title}</td>
                        <td>${game.publisher}</td>
                        <td>${game.releaseDate}</td>
                        <td><img src="${game.gameImage}" alt="${game.title}" style="max-width: 200px;"></td>
                        <td>${game.criticScore}</td>
                        <td>${game.personalScore}</td>
                        <td>${game.notes}</td>
                        <td>
                        <button class="edit-btn" data-id="${game.id}">Edit</button>
                        <button class="delete-btn" data-id="${game.id}">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </table>
        `;
    }

    // Function to sort games based on a specified property
    function sortGamesByProperty(games, property) {
        return games.slice().sort((a, b) => {
        if (a[property] < b[property]) return -1;
        if (a[property] > b[property]) return 1;
        return 0;
        });
    }

    // Function to handle sort action
    function handleSortAction(property) {
        const games = JSON.parse(localStorage.getItem('games')) || [];
        const sortedGames = sortGamesByProperty(games, property);
        displayGames(sortedGames);
    }

    // Event listener for sort buttons
    document.querySelectorAll('.sort-btn').forEach(button => {
        button.addEventListener('click', function() {
        const property = button.getAttribute('data-property');
        handleSortAction(property);
        });
    });

    // Function to handle edit and delete actions
    function handleGameActions(event) {
        console.log('Clicked Button:', event.target);
        if (event.target.classList.contains('edit-btn')) {
        const gameId = event.target.getAttribute('data-id');
        console.log('Edit Game ID:', gameId);
        editGame(gameId);
        } else if (event.target.classList.contains('delete-btn')) {
        const gameId = event.target.getAttribute('data-id');
        console.log('Delete Game ID:', gameId);
        deleteGame(gameId);
        }
    }

    // Function to handle form submission for adding/editing games
    function addOrEditGame(e) {
        e.preventDefault();
        const game = getFormData();
        console.log('Form Data:', game); // Log the form data being submitted
        updateGameInStorage(game);
        loadGames();
        gameForm.reset();
    }

    // Function to retrieve form data
    function getFormData() {
        return {
        id: gameForm.gameId.value || Date.now(),
        title: gameForm.title.value,
        publisher: gameForm.publisher.value,
        releaseDate: gameForm.releaseYear.value,
        gameImage: gameForm.gameImage.value,
        criticScore: gameForm.criticScore.value,
        personalScore: gameForm.personalScore.value,
        notes: gameForm.notes.value
        };
    }

    // Function to update game data in localStorage
    function updateGameInStorage(game) {
        let games = JSON.parse(localStorage.getItem('games')) || [];
        const index = games.findIndex(g => g.id === game.id);
        if (index !== -1) {
        games[index] = game;
        } else {
        games.push(game);
        }
        localStorage.setItem('games', JSON.stringify(games));
    }

    // Function to handle editing a game
    function editGame(gameId) {
        const games = JSON.parse(localStorage.getItem('games')) || [];
        const game = games.find(g => g.id === gameId);
        if (game) {
        populateFormWithGameData(game);
        }
    }

    // Function to populate form with game data for editing
    function populateFormWithGameData(game) {
        gameForm.title.value = game.title;
        gameForm.publisher.value = game.publisher;
        gameForm.releaseYear.value = game.releaseDate;
        gameForm.gameImage.value = game.gameImage;
        gameForm.criticScore.value = game.criticScore;
        gameForm.personalScore.value = game.personalScore;
        gameForm.notes.value = game.notes;
        gameForm.gameId.value = game.id;
    }

    // Function to delete a game
    function deleteGame(gameId) {
        let games = JSON.parse(localStorage.getItem('games')) || [];
        games = games.filter(game => game.id !== gameId);
        localStorage.setItem('games', JSON.stringify(games));
        loadGames();
    }

    // Function to search or filter games by title
    function searchGames() {
        const searchTerm = searchInput.value.toLowerCase();
        const games = JSON.parse(localStorage.getItem('games')) || [];
        const filteredGames = games.filter(game =>
        game.title.toLowerCase().includes(searchTerm)
        );
        displayGames(filteredGames);
    }

    // Event listener for click events on game list (delegated)
    gameList.addEventListener('click', handleGameActions);

    // Event listener for form submission
    gameForm.addEventListener('submit', addOrEditGame);

    // Event listener for search input
    searchInput.addEventListener('input', searchGames);

    // Initial load of games
    loadGames();
});