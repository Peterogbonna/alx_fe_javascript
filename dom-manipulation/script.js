// A static array of quote objects to start with, used if local storage is empty
const defaultQuotes = [
  { text: 'The only way to do great work is to love what you do.', category: 'Inspiration' },
  { text: 'Innovation distinguishes between a leader and a follower.', category: 'Technology' },
  { text: 'Stay hungry, stay foolish.', category: 'Life' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', category: 'Dreams' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', category: 'Motivation' }
];

// This variable will hold our quotes array, either from local storage or the default array
let quotes = [];

// --- Web Storage & JSON Handling Functions ---

// Function to save the quotes array to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to save the last viewed quote to session storage
function saveLastViewedQuote(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Function to export quotes to a JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2); // null and 2 for pretty printing
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Clean up the URL object after the download starts
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        // Add the new quotes to the existing array
        quotes.push(...importedQuotes);
        // Save the updated array to local storage
        saveQuotes();
        // Display a success message
        alert('Quotes imported successfully!');
        // Update the display with a new random quote
        showRandomQuote();
      } else {
        alert('Invalid JSON file format. Please upload an array of quotes.');
      }
    } catch (error) {
      alert('Failed to parse JSON file. Please check the file content.');
      console.error('JSON parsing error:', error);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- Core Application Functions ---

// Function to display a random quote from the quotes array
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  // Check if quotes array is not empty before picking a random quote
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    // Update the DOM with the new quote and its category
    quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>- Category: ${randomQuote.category}</em></p>`;
    // Save the last viewed quote to session storage
    saveLastViewedQuote(randomQuote);
  } else {
    quoteDisplay.innerHTML = `<p>No quotes available. Please add or import some!</p>`;
  }
}

// Function to handle adding a new quote from the form
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');

  const quoteText = newQuoteText.value.trim();
  const quoteCategory = newQuoteCategory.value.trim();

  if (quoteText !== '' && quoteCategory !== '') {
    // Create the new quote object
    const newQuote = {
      text: quoteText,
      category: quoteCategory
    };
    // Add the new quote to the array
    quotes.push(newQuote);
    // Save the updated array to local storage
    saveQuotes();
    // Clear the input fields for the next entry
    newQuoteText.value = '';
    newQuoteCategory.value = '';
    // Display a success message
    alert('Quote added successfully!');
    // Update the display with a new random quote
    showRandomQuote();
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// This function dynamically creates and adds the quote addition form to the DOM
function createAddQuoteForm() {
  const formContainer = document.getElementById('addQuoteFormContainer');
  formContainer.innerHTML = `
    <h2>Add a New Quote</h2>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;
  
  // Attach the event listener for the dynamically created button
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
}

// --- Initial Setup ---

// This function runs when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // 1. Load quotes from local storage or use the default array
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    // Parse the JSON string from local storage
    quotes = JSON.parse(storedQuotes);
  } else {
    // If local storage is empty, use the default hard-coded quotes
    quotes = defaultQuotes;
  }
  
  // 2. Check for a last viewed quote in session storage and display it
  const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastViewedQuote) {
    const quote = JSON.parse(lastViewedQuote);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>- Category: ${quote.category}</em></p>`;
  } else {
    // Otherwise, show a random quote from the loaded array
    showRandomQuote();
  }
  
  // 3. Attach event listeners to the main buttons
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
  
  // 4. Dynamically create and append the quote addition form
  createAddQuoteForm();
});
