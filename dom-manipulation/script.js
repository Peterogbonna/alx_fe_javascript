// script.js

// 1. Initialize an array of quote objects
const quotes = [
  { text: 'The only way to do great work is to love what you do.', category: 'Inspiration' },
  { text: 'Innovation distinguishes between a leader and a follower.', category: 'Technology' },
  { text: 'Stay hungry, stay foolish.', category: 'Life' },
];

// 2. Select HTML elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

// 3. Function to display a random quote
function showRandomQuote() {
  // Get a random index from the quotes array
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Update the DOM with the new quote
  quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>- Category: ${randomQuote.category}</em></p>`;
}

// 4. Function to add a new quote
function addQuote() {
  const quoteText = newQuoteText.value.trim(); // .trim() removes leading/trailing whitespace
  const quoteCategory = newQuoteCategory.value.trim();

  // Validate that the user entered both a quote and a category
  if (quoteText !== '' && quoteCategory !== '') {
    // Create a new quote object
    const newQuote = {
      text: quoteText,
      category: quoteCategory,
    };

    // Add the new quote to the quotes array
    quotes.push(newQuote);

    // Clear the input fields
    newQuoteText.value = '';
    newQuoteCategory.value = '';

    // Optionally, show the newly added quote
    alert('Quote added successfully!');
    showRandomQuote(); // Or you could show the new quote directly
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// 5. Add event listeners to the buttons
// When the page loads, display an initial quote
document.addEventListener('DOMContentLoaded', showRandomQuote);

// Listen for a click on the "Show New Quote" button
newQuoteBtn.addEventListener('click', showRandomQuote);

// Listen for a click on the "Add Quote" button
addQuoteBtn.addEventListener('click', addQuote);