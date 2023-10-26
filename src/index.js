
const GITHUB_API_TOKEN = 'YOUR_GITHUB_API_TOKEN';
const API_BASE_URL = 'https://api.github.com';

document.addEventListener('DOMContentLoaded', () => {
    const githubForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');

    githubForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const searchTerm = searchInput.value;
        if (searchTerm) {
            try {
                const users = await searchUsers(searchTerm);
                displayUsers(users);
            } catch (error) {
                console.error('Error searching for users:', error);
            }
        }
    });

    async function searchUsers(searchTerm) {
        const response = await fetch(`${API_BASE_URL}/search/users?q=${searchTerm}`, {
            headers: {
                Authorization: `token ${GITHUB_API_TOKEN}`
            }
        });
        const data = await response.json();
        return data.items;
    }

    function displayUsers(users) {
        userList.innerHTML = '';

        users.forEach((user) => {
            const userItem = document.createElement('li');
            userItem.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login} avatar">
                <p>${user.login}</p>
                <a href="${user.html_url}" target="_blank">View Profile</a>
            `;
            userItem.addEventListener('click', () => {
                showUserRepos(user.login);
            });
            userList.appendChild(userItem);
        });
    }

    async function showUserRepos(username) {
        try {
            const repos = await getUserRepos(username);
            displayUserRepos(repos);
        } catch (error) {
            console.error('Error fetching user repositories:', error);
        }
    }

    async function getUserRepos(username) {
        const response = await fetch(`${API_BASE_URL}/users/${username}/repos`, {
            headers: {
                Authorization: `token ${GITHUB_API_TOKEN}`
            }
        });
        const repos = await response.json();
        return repos;
    }

    function displayUserRepos(repos) {
        reposList.innerHTML = '';

        repos.forEach((repo) => {
            const repoItem = document.createElement('li');
            repoItem.innerHTML = `
                <p><strong>${repo.name}</strong></p>
                <p>${repo.description || 'No description'}</p>
            `;
            reposList.appendChild(repoItem);
        });
    }
});
