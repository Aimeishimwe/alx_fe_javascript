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
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    // Validate input fields
    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes(); // Save to localStorage

        // Clear input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        alert("New quote added successfully!");
        showRandomQuote(); // Display the newly added quote
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

    // Store the last viewed quote in sessionStorage
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
            } else {
                alert('Invalid JSON format. Please upload a valid quotes JSON file.');
            }
        } catch (error) {
            alert('Error reading JSON file. Please try again.');
        }
    };

    fileReader.readAsText(event.target.files[0]);
}

// Function to fetch quotes from the simulated server
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Example API

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data.map(item => ({
            text: item.title, // Assuming the title is used as a quote
            category: "General" // Default category for fetched quotes
        }));
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return [];
    }
}

// Function to periodically sync data with the server
function startQuoteSync() {
    setInterval(async () => {
        const serverQuotes = await fetchQuotesFromServer();
        if (serverQuotes.length > 0) {
            resolveConflicts(serverQuotes);
            handleQuoteSync(serverQuotes);
        }
    }, 30000); // Fetch every 30 seconds
}

// Handle syncing quotes with the server
function handleQuoteSync(serverQuotes) {
    const updatedQuotes = serverQuotes.filter(serverQuote => {
        return !quotes.some(localQuote => localQuote.text === serverQuote.text);
    });

    // Update local quotes and save
    quotes.push(...updatedQuotes);
    saveQuotes();

    // Notify user of new quotes
    if (updatedQuotes.length > 0) {
        alert(`${updatedQuotes.length} new quote(s) added from the server!`);
    }
}

// Resolve conflicts when syncing with the server
function resolveConflicts(serverQuotes) {
    serverQuotes.forEach(serverQuote => {
        const localQuoteIndex = quotes.findIndex(localQuote => localQuote.text === serverQuote.text);
        if (localQuoteIndex !== -1) {
            const userChoice = confirm(`Conflict detected for quote: "${serverQuote.text}".\nWould you like to keep the server version?`);
            if (userChoice) {
                // Replace local quote with server version
                quotes[localQuoteIndex] = serverQuote;
            }
        }
    });
    saveQuotes();
}

// Event listener to show a new random quote when the 'Show New Quote' button is clicked
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Display the last viewed quote from sessionStorage if available, otherwise show a random quote on page load
const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
if (lastViewedQuote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${lastViewedQuote.text}</p><small>Category: ${lastViewedQuote.category}</small>`;
} else {
    showRandomQuote();
}

// Call the function to create the add quote form when the page loads
createAddQuoteForm();
startQuoteSync(); // Start syncing with the server
