document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const resultsList = document.getElementById('results');
    const notFoundNotification = document.getElementById('notFoundNotification');

    // Event listener to customize right-click menu
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // Prevent the default context menu

        // Create a custom context menu
        const customContextMenu = document.createElement('div');
        customContextMenu.id = 'customContextMenu';
        customContextMenu.innerHTML = `
            <div class="context-menu-item" onclick="performCustomAction('newSearch')">New Search</div>
            <div class="context-menu-item" onclick="performCustomAction('refresh')">Refresh</div>
            <div class="context-menu-item" onclick="performCustomAction('copy')">Copy</div>
            <div class="context-menu-item" onclick="performCustomAction('paste')">Paste</div>

            <div class="context-menu-item" onclick="performCustomAction('saveAs')">Save As</div>
        `;
        customContextMenu.style.position = 'fixed';
        customContextMenu.style.top = `${event.clientY}px`;
        customContextMenu.style.left = `${event.clientX}px`;
        customContextMenu.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        customContextMenu.style.borderRadius = '10px';
        customContextMenu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
        customContextMenu.style.zIndex = '1000';

        // Style the context menu items
        const contextMenuItems = customContextMenu.getElementsByClassName('context-menu-item');
        for (const item of contextMenuItems) {
            item.style.padding = '8px';
            item.style.fontSize = '12px'; // Adjust font size as needed
            item.style.fontFamily = 'Arial, sans-serif'; // Adjust font family as needed
            item.style.color = '#333'; // Text color
            item.style.cursor = 'pointer';
            item.style.transition = 'background-color 0.3s';
            item.style.borderBottom = '1px solid #ccc'; // Separator between items
        }

        document.body.appendChild(customContextMenu);

        // Close the custom context menu on outside click
        document.addEventListener('click', function closeContextMenu() {
            customContextMenu.remove();
            document.removeEventListener('click', closeContextMenu);
        });
    });


    const helpButton = document.getElementById('helpButton');

    helpButton.addEventListener('click', function () {
        location.reload();
    });

    // Function to display current time and date for "time" search
    function displayTimeAndDate() {
        const currentDate = new Date();
        const timeString = currentDate.toLocaleTimeString();
        const dateString = currentDate.toDateString();
        const resultItem = document.createElement('li');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `<p>${timeString} - ${dateString}</p>`;
        resultsList.appendChild(resultItem);
        showSearchResults();
    }

    // Function to display current date for "date" search
    function displayCurrentDate() {
        const currentDate = new Date();
        const dateString = currentDate.toDateString();
        const resultItem = document.createElement('li');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `<p>${dateString}</p>`;
        resultsList.appendChild(resultItem);
        showSearchResults();
    }

    // Function to display version information for "version" search
    function displayVersionInformation() {
        const versionText = `
            Falcon Byte, Version 5.9
            By Harsha Vardhan
            &copy; 2024 HarVa Groups
        `;
        const resultItem = document.createElement('li');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `<pre>${versionText}</pre>`;
        resultsList.appendChild(resultItem);
        showSearchResults();
    }

    // Function to display search history for "std" search
    function displaySearchHistory() {
        // Retrieve search history from storage (you may use localStorage or another method)
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

        if (searchHistory.length > 0) {
            const resultItem = document.createElement('li');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = `
                <p>Search History:</p>
                <ul>
                    ${searchHistory.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
            resultsList.appendChild(resultItem);
            showSearchResults();
        } else {
            showNotFoundNotification();
        }
    }

    // Function to perform search
    function performSearch() {
        const searchTerm = searchInput.value.trim();

        // Check if the user wants to display search history
        if (searchTerm.toLowerCase() === 'std') {
            resultsList.innerHTML = '';
            displaySearchHistory();
            return;
        }

        // Check if the user wants to display the current time and date
        if (searchTerm.toLowerCase() === 'time') {
            resultsList.innerHTML = '';
            displayTimeAndDate();
            return;
        }

        // Check if the user wants to display the current date
        if (searchTerm.toLowerCase() === 'date') {
            resultsList.innerHTML = '';
            displayCurrentDate();
            return;
        }

        // Check if the user wants to display version information
        if (searchTerm.toLowerCase() === 'version') {
            resultsList.innerHTML = '';
            displayVersionInformation();
            return;
        }

    if (searchTerm.toLowerCase().startsWith('/math ')) {
        const mathExpression = searchTerm.slice(6);
        calculateMathExpression(mathExpression);
    } else if (searchTerm.toLowerCase().startsWith('/wiki ')) {
        resultsList.innerHTML = '';

        const wikiQuery = searchTerm.slice(6);
        searchWikipedia(wikiQuery);
    } else {
        resultsList.innerHTML = '';

        if (searchTerm.length === 0) {
            return;
        }

        if (searchTerm.toLowerCase().startsWith('/image ')) {
            const imageQuery = searchTerm.slice(7);
            searchImagesFromUnsplash(imageQuery);
        } else {
            const apiKey = 'AIzaSyDkImyDMpXroXPHCVD0cgGlD5hrBSk4LTA';
            const cx = '013dfbd644bed4d5d';
            const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${searchTerm}&key=${apiKey}&cx=${cx}`;

            $.ajax({
                url: apiUrl,
                dataType: 'json',
                success: function (data) {
                    resultsList.innerHTML = '';

                    if (data.items && data.items.length > 0) {
                        data.items.slice(0, 10).forEach(item => {
                            const listItem = document.createElement('li');
                            listItem.classList.add('result-item');
                            const secureSign = document.createElement('span');
                            secureSign.classList.add('secure-sign');
                            secureSign.textContent = 'Secure';
                            listItem.innerHTML = `
                                <a href="${item.link}" target="_blank">${item.title}</a>
                                <p>${item.snippet}</p>
                            `;
                            listItem.appendChild(secureSign);
                            resultsList.appendChild(listItem);
                        });
                        showSearchResults();
                    } else {
                        showNotFoundNotification();
                    }
                },
                error: function (error) {
                    console.error('Error fetching data:', error);
                    showNotFoundNotification();
                }
            });
        }
    }
}

    function searchWikipedia(query) {
        const wikiApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=${query}&origin=*`;

        $.ajax({
            url: wikiApiUrl,
            dataType: 'json',
            success: function (data) {
                if (data.query && data.query.search && data.query.search.length > 0) {
                    data.query.search.slice(0, 5).forEach(item => {
                        const listItem = document.createElement('li');
                        listItem.classList.add('result-item');
                        listItem.innerHTML = `
                            <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}" target="_blank">${item.title}</a>
                            <p>${item.snippet}</p>
                        `;
                        resultsList.appendChild(listItem);
                    });
                    showSearchResults();
                } else {
                    showNotFoundNotification();
                }
            },
            error: function (error) {
                console.error('Error fetching data from Wikipedia:', error);
                showNotFoundNotification();
            }
        });
    }

    function calculateMathExpression(expression) {
        try {
            const result = eval(expression);
            showMathResult(result);
        } catch (error) {
            console.error('Error evaluating math expression:', error);
            showNotFoundNotification();
        }
    }

    function showMathResult(result) {
        const resultItem = document.createElement('li');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `<p>${result}</p>`;
        resultsList.appendChild(resultItem);
        showSearchResults();
    }

    function showImageResults(images) {
        resultsList.innerHTML = '';

        const imageGrid = document.createElement('div');
        imageGrid.classList.add('image-grid');

        images.forEach(item => {
            if (item.width > item.height) { 
                const gridItem = document.createElement('div');
                gridItem.classList.add('grid-item');
                gridItem.innerHTML = `<img src="${item.urls.small}" alt="${item.alt_description}">`;
                imageGrid.appendChild(gridItem);
            }
        });

        resultsList.appendChild(imageGrid);
        showSearchResults();
    }

    function searchImagesFromUnsplash(query) {
        const unsplashApiKey = 'HzVY4yNAMCocTp8hmPLwUJ5NMbgz3EFBiIyO2CPvfc0';
        const unsplashApiUrl = `https://api.unsplash.com/photos/random?count=50&query=${query}&client_id=${unsplashApiKey}`;

        $.ajax({
            url: unsplashApiUrl,
            dataType: 'json',
            success: function (data) {
                if (data && data.length > 0) {
                    showImageResults(data);
                } else {
                    showNotFoundNotification();
                }
            },
            error: function (error) {
                console.error('Error fetching data from Unsplash:', error);
                showNotFoundNotification();
            }
        });
    }

    function showSearchResults() {
        searchResults.classList.remove('hidden');
        notFoundNotification.classList.add('hidden');

        const resultItems = document.querySelectorAll('.result-item');

        resultItems.forEach(item => {
            const linkElement = item.querySelector('a');
            const faviconUrl = getFaviconUrl(linkElement.href);

            const faviconImg = document.createElement('img');
            faviconImg.src = faviconUrl;
            faviconImg.classList.add('favicon');

            faviconImg.onerror = function () {
            faviconImg.src = 'icon/custom-favicon.png';
            };

            linkElement.parentNode.insertBefore(faviconImg, linkElement);
        });
    }

    function getFaviconUrl(url) {
        const urlObject = new URL(url);
        return `${urlObject.protocol}//${urlObject.host}/favicon.ico`;
    }

            $(document).on('keydown', function (event) {
                if (event.ctrlKey && event.key.toLowerCase() === 'l') {
                    // Ctrl+L: Focus on the search input
                    searchInput.focus();
                } else if (event.ctrlKey && (event.key.toLowerCase() === 'c' || event.key.toLowerCase() === 'a')) {
                    // Disable Ctrl+C and Ctrl+A
                    event.preventDefault();
                }
            });


    function showNotFoundNotification() {
        notFoundNotification.classList.remove('hidden');
        setTimeout(function () {
            notFoundNotification.classList.add('hidden');
        }, 3000);
    }

    searchButton.addEventListener('click', performSearch);

    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
});

    // Function to perform custom actions in the custom context menu
    window.performCustomAction = function (action) {
        switch (action) {
            case 'copy':
                document.execCommand('copy');
                break;
            case 'refresh':
                location.reload();
                break;
            case 'newSearch':
                location.reload();
                break;
            case 'saveAs':
                alert('Save As feature is not directly achievable due to browser security restrictions. Consider guiding users to use the browser\'s built-in "Save Page As" option.');
                break;
            default:
                break;
        }
    };