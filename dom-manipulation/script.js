// Array to store the quotes, each quote has a 'text' and a 'category'
const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "You only live once, but if you do it right, once is enough.", category: "Wisdom" }
  ];
  
  // Function to display a random quote from the quotes array
  function showRandomQuote() {
    // Select a random quote from the array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
  
    // Find the quoteDisplay div and update its content with the selected quote
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${selectedQuote.text}</p><small>Category: ${selectedQuote.category}</small>`;
  }
  
  // Function to create a form for adding new quotes dynamically
  function createAddQuoteForm() {
    // Create input elements for the new quote text and category
    const formContainer = document.createElement('div');
  
    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';
  
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
  
    // Create a button to add the new quote
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote; // Assign the addQuote function to handle button click
  
    // Append the inputs and button to the form container
    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
  
    // Add the form container to the body (or any specific element where you want the form to appear)
    document.body.appendChild(formContainer);
  }
  
  // Function to add a new quote based on user input
  function addQuote() {
    // Get the input values for the new quote text and category
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;
  
    // Validate that both fields have values
    if (quoteText && quoteCategory) {
      // Add the new quote as an object to the quotes array
      quotes.push({ text: quoteText, category: quoteCategory });
  
      // Optionally, clear the input fields after adding the quote
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
  
      // Inform the user that the quote was added successfully
      alert("New quote added successfully!");
  
      // Display the newly added quote
      showRandomQuote();
    } else {
      // If either field is empty, inform the user
      alert("Please enter both the quote text and category.");
    }
  }
  
  // Event listener to show a new random quote when the 'Show New Quote' button is clicked
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Initially display a random quote when the page loads
  showRandomQuote();
  
  // Call the function to create the form dynamically when the page loads
  createAddQuoteForm();
  