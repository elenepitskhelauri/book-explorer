const searchInput = document.getElementById("searchInput");
const booksContainer = document.getElementById("booksContainer");
const loading = document.getElementById("loading");

const bookForm = document.getElementById("bookForm");

bookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();

    if(query){
        fetchBooks(query);
    }
});

async function fetchBooks(query){

    try{

        loading.classList.remove("hidden");
        booksContainer.innerHTML = "";


       const url =
`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20&key=${API_KEY}`;

        const response = await fetch(url);

        if(!response.ok){
            throw new Error("Failed to fetch books");
        }

        const data = await response.json();

        displayBooks(data.items || []);

    }
    catch(error){

        booksContainer.innerHTML = `
            <h2>Error: ${error.message}</h2>
        `;

    }
    finally{
        loading.classList.add("hidden");
    }
}

function displayBooks(books){

    if(books.length === 0){

        booksContainer.innerHTML = `
            <h2>No books found.</h2>
        `;
        return;
    }

    books.forEach(book => {

        const info = book.volumeInfo;

        const title =
            info.title || "Unknown Title";

        const author =
            info.authors?.join(", ") || "Unknown Author";

        const image =
            info.imageLinks?.thumbnail ||
            "https://via.placeholder.com/250x350?text=No+Cover";

        const description =
            info.description
        ? info.description.substring(0, 150) + "..."
        : "No description available.";

        const rating =
            info.averageRating || "N/A";

        const publishedDate =
            info.publishedDate || "Unknown";

        const pageCount =
            info.pageCount || "Unknown";

        const publisher =
            info.publisher || "Unknown";

        const card = document.createElement("div");

        card.classList.add("book-card");

        card.innerHTML = `
            <img src="${image}" alt="${title}">
            
            <div class="book-content">
                <h3>${title}</h3>

                <p class="author">
                    ✍️ ${author}
                </p>

                <p class="description">
                    ${description}
                </p>

                <p class="rating">
                    ⭐ Rating: ${rating}
                </p>
                
                <p class="published">
                    📅 Published: ${publishedDate}</p>

                <p class="pages">
                    📖 Pages: ${pageCount}</p>

                <p class="publisher">
                    🏢 Publisher: ${publisher}</p>

                <button class="favorite-btn">
                    ❤️ Save Favorite
                </button>
            </div>
        `;

        const favoriteBtn =
            card.querySelector(".favorite-btn");

        favoriteBtn.addEventListener("click", () => {

            let favorites =
                JSON.parse(localStorage.getItem("favorites")) || [];

            favorites.push({
                title,
                author
            });

            localStorage.setItem(
                "favorites",
                JSON.stringify(favorites)
            );

            alert("Book saved!");
        });

        booksContainer.appendChild(card);
    });
}

fetchBooks("bestsellers");