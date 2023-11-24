# DEWBRE300_FTO2308_Group2A_DewaldBreed_IWACapstone

This project, called book-connect, is a website that allows a user to view book previews and filter books by title, author and/or genre.
It uses scripts to function, with scripts.js containing most of the initialization scripts, data.js containing all the data for the books,
and generators.js containing functions which generate new data and html for use in scripts.js

As it is, the project has all the functionalities as requested by the following user stories:

As a user, I want to view a list of book previews, by title and author, so that I can discover new books to read.
As a user, I want an image associated with all book previews so that I can recognize a book by the cover even if I forgot the name.
As a user, I want to have the option of reading a summary of the book so that I can decide whether I want to read it.
As a user, I want to have the option of seeing the date that a book was published so that I can determine how easy it is to obtain second-hand.
As a user, I want to find books based on specific text phrases so that I don’t need to remember the entire title of a book.
As a user, I want to filter books by author so that I can find books to read by authors that I enjoy.
As a user, I want to filter books by genre so that I can find books to read in genres that I enjoy.
As a user, I want to toggle between dark and light modes so that I can use the app comfortably at night.

How to use:

When loading the page, it will display 36 previews which can be clicked on to view a more detailed overlay with more information.

Clicking the "Show More" button at the bottom will populate the page with 36 more previews until no more books are left, in
which case the button is disabled. The button will also display how many books remain, and the value decreases as more previews
populate the page.

Initially the page will use the theme that corresponds to the browsers preferred color-scheme. When the settings button is clicked (top right of page)
it will open an overlay containing a drop-down menu where one can select their desired theme. Upon submission it will change the color scheme according
to the selected theme ("day" or "night").

Clicking the Search (or filter) button will open the search overlay containing a form where one can choose to enter a book title, partially or full and in upper or lowercase. The title can also be left empty to search through all titles. One can also select a specific genre and/or author from the respective drop-down lists. All three of these search criteria can be used simultaneously if desired. Upon submission the page will remove all previous book previews
and repopulate the page with all books that match the search parameters. If no books match the parameters, a message will be displayed indicating that no book was found. After submitting a search, the "Show More" button will still reflect the correct amount of remaining books, and can be clicked to populate the page with more matching results until none remain, at which point the button is disabled.

Submitting the search form with the title input blank, and selecting the "All Genres" and "All Authors" options will return all books, essentially resetting the page back to the state it was upon first loading.
