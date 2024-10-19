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
  