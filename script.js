document.addEventListener('DOMContentLoaded', function () {
    const gameForm = document.getElementById('gameForm');
    const gameList = document.getElementById('gameList');
    const searchInput = document.getElementById('searchInput');

    // Load games from localStorage on page load
    function loadGames() {
        const games = JSON.parse(localStorage.getItem('games')) || [];
        displayGames(games);
    }

    // Display games in the table
    function displayGames(games) {
        gameList.innerHTML = `
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
    
        // Add event listeners to edit buttons
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const gameId = button.getAttribute('data-id');
                editGame(gameId);
            });
        });
    
        // Add event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const gameId = button.getAttribute('data-id');
                deleteGame(gameId);
            });
        });
    }
    
    function deleteGame(gameId) {
        let games = JSON.parse(localStorage.getItem('games')) || [];
        games = games.filter(game => game.id !== gameId);
        localStorage.setItem('games', JSON.stringify(games));
        loadGames(); // Reload games after deletion
    }

    // Add or edit a game
    function addOrEditGame(e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const publisher = document.getElementById('publisher').value;
        const releaseDate = document.getElementById('releaseYear').value;
        const gameImage = document.getElementById('gameImage').value;
        const criticScore = document.getElementById('criticScore').value;
        const personalScore = document.getElementById('personalScore').value;
        const notes = document.getElementById('notes').value;
        const gameId = document.getElementById('gameId').value;

        const game = {
            id: gameId || Date.now(),
            title,
            publisher,
            releaseDate,
            gameImage,
            criticScore,
            personalScore,
            notes
        };

        let games = JSON.parse(localStorage.getItem('games')) || [];
        if (gameId) {
            const index = games.findIndex(g => g.id === gameId);
            if (index !== -1) {
                games[index] = game;
            }
        } else {
            games.push(game);
        }
        localStorage.setItem('games', JSON.stringify(games));

        loadGames();
        gameForm.reset();
    }

    // Edit a game
    function editGame(gameId) {
        const games = JSON.parse(localStorage.getItem('games')) || [];
        const game = games.find(g => g.id === gameId);
        if (game) {
            document.getElementById('title').value = game.title;
            document.getElementById('publisher').value = game.publisher;
            document.getElementById('releaseYear').value = game.releaseDate;
            document.getElementById('gameImage').value = game.gameImage;
            document.getElementById('criticScore').value = game.criticScore;
            document.getElementById('personalScore').value = game.personalScore;
            document.getElementById('notes').value = game.notes;
            document.getElementById('gameId').value = game.id;
        }
    }

    // Delete a game
    function deleteGame(gameId) {
        let games = JSON.parse(localStorage.getItem('games')) || [];
        games = games.filter(game => game.id !== gameId);
        localStorage.setItem('games', JSON.stringify(games));
        loadGames();
    }

    // Search or filter games by title
    function searchGames() {
        const searchTerm = searchInput.value.toLowerCase();
        const games = JSON.parse(localStorage.getItem('games')) || [];
        const filteredGames = games.filter(game =>
            game.title.toLowerCase().includes(searchTerm)
        );
        displayGames(filteredGames);
    }

    // Event listener for form submission
    gameForm.addEventListener('submit', addOrEditGame);

    // Event listener for search input
    searchInput.addEventListener('input', searchGames);

    // Initial load of games
    loadGames();
});