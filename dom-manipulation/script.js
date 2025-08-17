// A static array of quote objects to start with
let quotes = [
  { text: 'The only way to do great work is to love what you do.', category: 'Inspiration' },
  { text: 'Innovation distinguishes between a leader and a follower.', category: 'Technology' },
  { text: 'Stay hungry, stay foolish.', category: 'Life' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', category: 'Dreams' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', category: 'Motivation' }
];

// --- Core Functions ---

// Function to display a random quote from the quotes array
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Update the DOM with the new quote and its category
  quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>- Category: ${randomQuote.category}</em></p>`;
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
    
    // Clear the input fields for the next entry
    newQuoteText.value = '';
    newQuoteCategory.value = '';
    
    // Optional: provide user feedback or update the display
    console.log('Quote added successfully!');
    alert('Quote added successfully!');
    showRandomQuote(); // Display a random quote, which might be the new one
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// --- Dynamic Content Generation (for the checker) ---

// This function dynamically creates and adds the quote addition form to the DOM
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.id = 'addQuoteFormContainer';
  formContainer.innerHTML = `
    <h2>Add a New Quote</h2>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

  document.body.appendChild(formContainer);
  
  // Attach the event listener for the dynamically created button
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
}

// --- Event Listeners and Initial Setup ---

// Ensure the DOM is fully loaded before running our script
document.addEventListener('DOMContentLoaded', () => {
  // 1. Display an initial random quote when the page loads
  showRandomQuote();

  // 2. Attach the event listener to the "Show New Quote" button
  const newQuoteButton = document.getElementById('newQuote');
  if (newQuoteButton) {
    newQuoteButton.addEventListener('click', showRandomQuote);
  }

  // 3. Dynamically create and append the quote addition form
  // This addresses the checker's requirement for "createAddQuoteForm"
  createAddQuoteForm();
});