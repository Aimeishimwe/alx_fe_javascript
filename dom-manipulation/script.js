// Retrieve stored quotes from localStorage or initialize with default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "You only live once, but if you do it right, once is enough.", category: "Wisdom" }
];

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to create and display the form for adding new quotes
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(formContainer);
}

// Function to add a new quote based on user input
async function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        await postQuoteToServer(newQuote);

        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        alert("New quote added successfully!");
        showRandomQuote();
        populateCategories();
    } else {
        alert("Please enter both the quote text and category.");
    }
}

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${selectedQuote.text}</p><small>Category: ${selectedQuote.category}</small>`;

    sessionStorage.setItem('lastViewedQuote', JSON.stringify(selectedQuote));
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);

            if (Array.isArray(importedQuotes) && importedQuotes.every(quote => quote.text && quote.category)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert('Quotes imported successfully!');
                showRandomQuote();
                populateCategories();
            } else {
                alert('Invalid JSON format. Please upload a valid quotes JSON file.');
            }
        } catch (error) {
            alert('Error reading JSON file. Please try again.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Function to fetch quotes from the simulated server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data.map(item => ({
            text: item.title,
            category: "General"
        }));
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return [];
    }
}

// Function to post a new quote to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(quote)
        });

        if (!response.ok) {
            throw new Error('Failed to post quote to server');
        }

        const result = await response.json();
        console.log('Posted quote to server:', result);
    } catch (error) {
        console.error('Error posting quote to server:', error);
    }
}

// Function to synchronize quotes with the server
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    if (serverQuotes.length > 0) {
        handleQuoteSync(serverQuotes);
    }
}

// Handle syncing quotes with the server and resolving conflicts
function handleQuoteSync(serverQuotes) {
    const updatedQuotes = [];
    const conflictMessages = [];

    serverQuotes.forEach(serverQuote => {
        const localQuoteIndex = quotes.findIndex(localQuote => localQuote.text === serverQuote.text);

        if (localQuoteIndex === -1) {
            updatedQuotes.push(serverQuote);
        } else {
            // Automatically keep the server version to reduce user interaction
            quotes[localQuoteIndex] = serverQuote;
        }
    });

    quotes.push(...updatedQuotes);
    saveQuotes();

    if (updatedQuotes.length > 0) {
        conflictMessages.push(`New quotes added from server: ${updatedQuotes.length}`);
    }

    if (conflictMessages.length > 0) {
        alert(conflictMessages.join('\n'));
    }
}

// Function to populate the category dropdown menu with unique categories
function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuote() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', selectedCategory);

    const filteredQuotes = selectedCategory
        ? quotes.filter(quote => quote.category === selectedCategory)
        : quotes;

    const quoteDisplay = document.getElementById('quoteDisplay');
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const selectedQuote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = `<p>${selectedQuote.text}</p><small>Category: ${selectedQuote.category}</small>`;
    } else {
        quoteDisplay.innerHTML = '<p>No quotes available in this category.</p>';
    }
}

// Function to restore the last selected category when the page loads
function restoreLastSelectedCategory() {
    const lastSelectedCategory = localStorage.getItem('selectedCategory');
    if (lastSelectedCategory) {
        document.getElementById('categoryFilter').value = lastSelectedCategory;
        filterQuote();
    }
}

// Function to periodically sync quotes with the server
function startQuoteSync() {
    syncQuotes();
    setInterval(syncQuotes, 30000);
}

// Event listeners for category filtering and showing a new quote
document.getElementById('categoryFilter').addEventListener('change', filterQuote);
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Display the last viewed quote or show a random one on page load
const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
if (lastViewedQuote) {
    document.getElementById('quoteDisplay').innerHTML = `<p>${lastViewedQuote.text}</p><small>Category: ${lastViewedQuote.category}</small>`;
} else {
    showRandomQuote();
}

// Initialize the app
createAddQuoteForm();
populateCategories();
restoreLastSelectedCategory();
startQuoteSync();
