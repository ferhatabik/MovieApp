// Titles: https://omdbapi.com/?s=thor&page=1&apikey=fc1fef96
// details: http://www.omdbapi.com/?i=tt3896198&apikey=fc1fef96

// HTML'den gerekli elementleri alıyoruz
const movieSearchBox = document.getElementById('movie-search-box'); // Arama kutusu
const searchList = document.getElementById('search-list'); // Arama sonuçları listesi
const resultGrid = document.getElementById('result-grid'); // Film detaylarının gösterildiği alan

// API'den filmleri yüklemek için async bir fonksiyon oluşturuyoruz
async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`; // OMDB API'ye istek yapmak için URL
    const res = await fetch(URL); // API'ye istek gönderme
    const data = await res.json(); // API yanıtını JSON olarak ayrıştırma
    if (data.Response == "True") {
        // Eğer API yanıtı başarılıysa, filmleri listelemek için displayMovieList fonksiyonunu çağırıyoruz
        displayMovieList(data.Search);
    }
}

// Kullanıcının film aramasını işleyen fonksiyon
function findMovies() {
    let searchTerm = (movieSearchBox.value).trim(); // Arama kutusundan kullanıcının girdiği metni al
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list'); // Arama sonuçlarını göstermek için CSS sınıfını kaldır
        loadMovies(searchTerm); // Filmleri yükle
    } else {
        searchList.classList.add('hide-search-list'); // Arama sonuçlarını gizlemek için CSS sınıfını ekle
    }
}

// Film listesini ekranda gösteren fonksiyon
function displayMovieList(movies) {
    searchList.innerHTML = ""; // Arama sonuçları listesini temizle
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div'); // Her film için bir div öğesi oluştur
        movieListItem.dataset.id = movies[idx].imdbID; // movie id'sini data-id olarak ayarlıyoruz
        movieListItem.classList.add('search-list-item'); // CSS sınıfını ekleyerek stil uygula
        let moviePoster = (movies[idx].Poster != "N/A") ? movies[idx].Poster : "image_not_found.png"; // Film posterini kontrol et
        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `; // HTML içeriğini oluştur
        searchList.appendChild(movieListItem); // Film öğesini arama sonuçları listesine ekleyin
    }
    loadMovieDetails(); // Film detaylarını yükle
}

// Her bir film öğesine tıklamada film detaylarını yükleme işlemini gerçekleştiren fonksiyon
function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item'); // Tüm film öğelerini seç
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list'); // Arama sonuçlarını gizle
            movieSearchBox.value = ""; // Arama kutusunu temizle
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`); // Film detayları için OMDB API'ye istek gönder
            const movieDetails = await result.json(); // API yanıtını JSON olarak ayrıştırma
            displayMovieDetails(movieDetails); // Film detaylarını gösterme
        });
    });
}

// Film detaylarını ekranda gösteren fonksiyon
function displayMovieDetails(details) {
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}

// Kullanıcının arama kutusunun dışına tıkladığında arama sonuçlarını gizleme işlemi
window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") {
        searchList.classList.add('hide-search-list');
    }
});
