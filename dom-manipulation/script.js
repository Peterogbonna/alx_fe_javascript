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
        // Update the categories in the filter dropdown
        populateCategories();
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

// --- Server Interaction & Syncing Functions ---

// Function to update status message on the UI
function setStatus(message) {
  const statusMessageDiv = document.getElementById('statusMessage');
  statusMessageDiv.textContent = message;
}

// Simulates fetching data from a server using a mock API
async function fetchQuotesFromServer() {
  setStatus('Fetching latest data...');
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // Transform the mock API data to fit our quote structure
    const serverQuotes = data.map(post => ({
      text: post.title,
      category: `User ${post.userId}`
    }));
    return serverQuotes;
  } catch (error) {
    console.error('Failed to fetch from server:', error);
    setStatus('Failed to fetch data from server.');
    return []; // Return an empty array on error to prevent app from breaking
  }
}

// Main syncing function to handle data synchronization and conflict resolution
async function syncQuotes() {
  setStatus('Syncing with server...');
  try {
    const serverData = await fetchQuotesFromServer();
    
    // Simple conflict resolution: server data takes precedence
    // Create a Set of server quote texts for fast lookup
    const serverQuoteTexts = new Set(serverData.map(q => q.text));
    
    // Filter local quotes to find ones that are not on the server
    const localQuotesToSync = quotes.filter(q => !serverQuoteTexts.has(q.text));
    
    // Combine server data and new local data
    quotes = [...serverData, ...localQuotesToSync];
    
    // Save the merged data to local storage
    saveQuotes();
    
    // Update the UI
    populateCategories();
    showRandomQuote();
    
    setStatus('Data synced successfully!');
  } catch (error) {
    setStatus('Failed to sync data.');
    console.error('Syncing error:', error);
  }
}

// --- Core Application Functions ---

// Function to display a random quote from the quotes array
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  // Get the current selected category from the filter dropdown
  const selectedCategory = document.getElementById('categoryFilter').value;
  
  // Filter quotes based on the selected category
  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);

  // Check if there are quotes to display after filtering
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    // Update the DOM with the new quote and its category
    quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>- Category: ${randomQuote.category}</em></p>`;
    // Save the last viewed quote to session storage
    saveLastViewedQuote(randomQuote);
  } else {
    quoteDisplay.innerHTML = `<p>No quotes available in this category. Please add or import some!</p>`;
  }
}

// Function to handle adding a new quote from the form
async function addQuote() {
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

    setStatus('Adding quote and syncing...');
    try {
      // Simulate posting the new quote to a server
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: newQuote.text,
          body: newQuote.category,
          userId: 1, // hardcoded for this example
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to post to server.');
      }
      
      const responseData = await response.json();
      console.log('Server response:', responseData);

      // Add the new quote to the local array
      quotes.push(newQuote);
      
      // Save the updated local array to local storage
      saveQuotes();
      // Update the categories in the filter dropdown
      populateCategories();
      
      // Clear the input fields for the next entry
      newQuoteText.value = '';
      newQuoteCategory.value = '';
      
      setStatus('Quote added successfully and synced!');
      // Update the display with a new random quote
      showRandomQuote();
    } catch (error) {
      setStatus('Failed to add quote to server.');
      console.error('Posting error:', error);
      // Even if server post fails, save locally
      quotes.push(newQuote);
      saveQuotes();
      populateCategories();
      showRandomQuote();
    }
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

// Function to populate the category filter dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  // Get all unique categories from the quotes array
  const categories = [...new Set(quotes.map(quote => quote.category))];
  
  // Clear any existing options, keeping the "All Categories" option
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  // Populate the dropdown with the unique categories
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  // Restore the last selected category from local storage
  const lastSelectedCategory = localStorage.getItem('lastCategoryFilter');
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }
}

// Function to filter quotes based on the selected category and save the preference
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  // Save the selected category to local storage
  localStorage.setItem('lastCategoryFilter', selectedCategory);
  // Re-display a random quote based on the new filter
  showRandomQuote();
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
  
  // 2. Populate the category filter dropdown
  populateCategories();
  
  // 3. Check for a last viewed quote in session storage and display it
  const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastViewedQuote) {
    const quote = JSON.parse(lastViewedQuote);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>- Category: ${quote.category}</em></p>`;
  } else {
    // Otherwise, show a random quote from the loaded array
    showRandomQuote();
  }
  
  // 4. Attach event listeners to the main buttons
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
  document.getElementById('syncQuotes').addEventListener('click', syncQuotes);
  
  // 5. Dynamically create and append the quote addition form
  createAddQuoteForm();
  
  // 6. Set up a periodic sync every 5 minutes (300000 ms)
  setInterval(syncQuotes, 300000);
});
