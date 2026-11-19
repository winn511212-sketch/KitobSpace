
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const starterBooks = [
  {
    id: 1,
    title: "Dune",
    author: "Frank Herbert",
    category: "Badiiy",
    year: 1965,
    rating: "4.9",
    description: "Arrakis sahrosidagi sarguzashtlar va insoniyat kelajagi haqida.",
    text: "",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=85",
    color: "violet",
  },
  {
    id: 2,
    title: "Cosmos",
    author: "Carl Sagan",
    category: "Ilm-fan",
    year: 1980,
    rating: "4.8",
    description: "Koinot va insoniyatning ilmiy izlanishlari haqida.",
    text: "",
    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=700&q=85",
    color: "blue",
  },
  {
    id: 3,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "Tarix",
    year: 2011,
    rating: "4.9",
    description: "Insoniyat tarixining qadimgi davrlardan bugungacha bo‘lgan hikoyasi.",
    text: "",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=85",
    color: "orange",
  },
  {
    id: 4,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Texnologiya",
    year: 2008,
    rating: "4.7",
    description: "Tartibli va o‘qilishi oson dasturiy kod yozish haqida.",
    text: "",
    cover: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=700&q=85",
    color: "green",
  },
];

const categories = [
  "Barchasi",
  "Badiiy",
  "Ilm-fan",
  "Tarix",
  "Texnologiya",
  "Ta’lim",
];

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function loadBooks() {
  return [...starterBooks, ...readJSON("neon-library-added-books", [])];
}

export default function App() {
  const [user, setUser] = useState(() => readJSON("neon-library-user", null));
  const [accounts, setAccounts] = useState(() =>
    readJSON("neon-library-accounts", []),
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");

  const [allBooks, setAllBooks] = useState(loadBooks);
  const [favorites, setFavorites] = useState(() =>
    user ? readJSON(`neon-library-favorites-${user.username}`, []) : [],
  );
  const [page, setPage] = useState("dashboard");
  const [category, setCategory] = useState("Barchasi");
  const [query, setQuery] = useState("");
  const [readingBook, setReadingBook] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [likedBook, setLikedBook] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "Badiiy",
    description: "",
    text: "",
    cover: "",
  });

  // Demo loyihada admin menyusi barcha hisoblarda ko‘rinadi.
  const isAdmin = true;

  useEffect(() => {
    localStorage.setItem("neon-library-accounts", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(
      "neon-library-added-books",
      JSON.stringify(allBooks.filter((book) => book.custom)),
    );
  }, [allBooks]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `neon-library-favorites-${user.username}`,
        JSON.stringify(favorites),
      );
    }
  }, [favorites, user]);

  function handleAuth(event) {
    event.preventDefault();
    setAuthError("");

    const name = username.trim();

    if (name.length < 3) {
      setAuthError("Username kamida 3 ta belgidan iborat bo‘lsin.");
      return;
    }

    if (password.length < 4) {
      setAuthError("Parol kamida 4 ta belgidan iborat bo‘lsin.");
      return;
    }

    if (authMode === "signup") {
      const exists = accounts.some(
        (account) => account.username.toLowerCase() === name.toLowerCase(),
      );

      if (exists) {
        setAuthError("Bu username band. Log in qilib ko‘ring.");
        return;
      }

      const nextAccounts = [...accounts, { username: name, password }];
      const nextUser = { username: name };

      setAccounts(nextAccounts);
      setUser(nextUser);
      setFavorites([]);
      localStorage.setItem("neon-library-user", JSON.stringify(nextUser));
      return;
    }

    const account = accounts.find(
      (item) =>
        item.username.toLowerCase() === name.toLowerCase() &&
        item.password === password,
    );

    if (!account) {
      setAuthError("Username yoki parol noto‘g‘ri.");
      return;
    }

    const nextUser = { username: account.username };
    setUser(nextUser);
    localStorage.setItem("neon-library-user", JSON.stringify(nextUser));
    setFavorites(
      readJSON(`neon-library-favorites-${account.username}`, []),
    );
  }

  function logout() {
    speechSynthesis.cancel();
    localStorage.removeItem("neon-library-user");
    setUser(null);
    setUsername("");
    setPassword("");
    setPage("dashboard");
  }

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setLikedBook(id);
    window.setTimeout(() => setLikedBook(null), 450);
  }

  function addBook(event) {
    event.preventDefault();

    const book = {
      ...newBook,
      id: Date.now(),
      year: new Date().getFullYear(),
      rating: "Yangi",
      color: "violet",
      custom: true,
      cover:
        newBook.cover ||
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=85",
    };

    setAllBooks((current) => [...current, book]);
    setNewBook({
      title: "",
      author: "",
      category: "Badiiy",
      description: "",
      text: "",
      cover: "",
    });
    setAdminOpen(false);
    setPage("dashboard");
    setCategory("Barchasi");
  }

  function startListening() {
    if (!readingBook?.text) {
      alert("Bu kitobda o‘qiladigan matn yo‘q. Admin panelidan matn qo‘shing.");
      return;
    }

    if (!("speechSynthesis" in window)) {
      alert("Brauzeringiz ovoz chiqarib o‘qishni qo‘llamaydi.");
      return;
    }

    speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(readingBook.text);
    speech.lang = "uz-UZ";
    speechSynthesis.speak(speech);
  }

  const visibleBooks = useMemo(() => {
    const search = query.trim().toLowerCase();

    return allBooks.filter((book) => {
      const matchesPage = page !== "favorites" || favorites.includes(book.id);
      const matchesCategory =
        category === "Barchasi" || book.category === category;
      const matchesSearch =
        !search ||
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search);

      return matchesPage && matchesCategory && matchesSearch;
    });
  }, [allBooks, page, favorites, category, query]);

  if (!user) {
    return (
      <div className="auth-page">
        <form className="auth-card" onSubmit={handleAuth}>
          <div className="brand auth-brand">
            <span className="brand-icon">✳</span>
            <span>kitob<span className="brand-light">.space</span></span>
          </div>

          <div className="eyebrow"><span /> RAQAMLI KUTUBXONANGIZ</div>
          <h1>{authMode === "login" ? "Xush kelibsiz" : "Hisob yarating"}</h1>
          <p className="auth-subtitle">
            {authMode === "login"
              ? "Hisobingizga kirish uchun ma’lumotlarni kiriting."
              : "Username va parol tanlab ro‘yxatdan o‘ting."}
          </p>

          <label className="auth-label">
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Masalan: fayoz"
              autoComplete="username"
            />
          </label>

          <label className="auth-label">
            Parol
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Parolingiz"
              autoComplete={authMode === "login" ? "current-password" : "new-password"}
            />
          </label>

          {authError && <div className="auth-error">{authError}</div>}

          <button className="auth-submit" type="submit">
            {authMode === "login" ? "Log in →" : "Sign up →"}
          </button>

          <div className="auth-switch">
            {authMode === "login" ? "Hisobingiz yo‘qmi?" : "Hisobingiz bormi?"}
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "login" ? "signup" : "login");
                setAuthError("");
              }}
            >
              {authMode === "login" ? "Sign up" : "Log in"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">✳</span>
          <span>kitob<span className="brand-light">.space</span></span>
        </div>

        <div className="side-label">MENYU</div>
        <nav className="side-nav">
          <button
            className={`nav-item ${page === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setPage("dashboard");
              setCategory("Barchasi");
            }}
          >
            <span>⌂</span> Bosh sahifa
          </button>

          <button
            className={`nav-item ${page === "favorites" ? "active" : ""}`}
            onClick={() => {
              setPage("favorites");
              setCategory("Barchasi");
            }}
          >
            <span>♡</span> Sevimlilar
            <span className="nav-count">{favorites.length}</span>
          </button>

          <button className="nav-item" onClick={() => setAdminOpen(true)}>
            <span>＋</span> Admin: kitob qo‘shish
          </button>
        </nav>

        <div className="side-label category-label">KATEGORIYALAR</div>
        <nav className="side-nav">
          {categories.slice(1).map((item) => (
            <button
              className={`nav-item ${category === item ? "active" : ""}`}
              key={item}
              onClick={() => {
                setPage("dashboard");
                setCategory(item);
              }}
            >
              <span className="category-dot" /> {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-avatar">{user.username[0].toUpperCase()}</div>
          <div className="profile-info">
            <strong>{user.username}</strong>
            <span>Kitobxon / Admin demo</span>
          </div>
          <button className="logout-button" onClick={logout}>Chiqish</button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Kutubxona <span>/</span>
            {page === "favorites" ? "Sevimlilar" : "Bosh sahifa"}
          </div>
          <div className="topbar-right">
            <span className="online-status"><i /> O‘qishga tayyormisiz?</span>
            <div className="top-avatar">{user.username[0].toUpperCase()}</div>
          </div>
        </header>

        <section className="content">
          <div className="hero">
            <div className="hero-copy">
              <div className="eyebrow"><span /> SIZNING RAQAMLI KUTUBXONANGIZ</div>
              <h1>Yangi olamlar<br /><span>bir sahifa narida.</span></h1>
              <p>Kitobni tanlang, brauzerda o‘qing yoki ovoz chiqarib tinglang.</p>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="hero-book">
                <div className="book-spine" />
                <div className="book-cover">
                  <span className="cover-star">✳</span>
                  <span className="cover-title">READ<br />BEYOND</span>
                  <span className="cover-caption">THE ORDINARY</span>
                </div>
              </div>
              <span className="sparkle sparkle-one">✦</span>
              <span className="sparkle sparkle-two">✧</span>
            </div>
          </div>

          <div className="section-heading">
            <div>
              <div className="eyebrow muted">
                {page === "favorites" ? "SAQLANGAN KITOBLAR" : "MUTOLAA UCHUN"}
              </div>
              <h2>{page === "favorites" ? "Sevimlilar" : "Kutubxonani kashf et"}</h2>
            </div>
            <div className="book-total"><span>{visibleBooks.length}</span> ta kitob</div>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <span>⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Kitob yoki muallifni qidiring..."
              />
            </label>
            <div className="filter-wrap">
              <span>Filtr:</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </div>

          {visibleBooks.length ? (
            <div className="book-grid">
              {visibleBooks.map((book, index) => (
                <article
                  className="book-card"
                  key={book.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <button className="cover-button" onClick={() => setReadingBook(book)}>
                    <img src={book.cover} alt={`${book.title} muqovasi`} />
                    <span className={`cover-category ${book.color}`}>{book.category}</span>
                  </button>

                  <button
                    className={`heart-button ${favorites.includes(book.id) ? "is-favorite" : ""} ${likedBook === book.id ? "heart-pop" : ""}`}
                    onClick={() => toggleFavorite(book.id)}
                  >
                    {favorites.includes(book.id) ? "♥" : "♡"}
                  </button>

                  <button className="book-info" onClick={() => setReadingBook(book)}>
                    <span className="book-author">{book.author}</span>
                    <strong>{book.title}</strong>
                    <span className="book-meta">
                      <span>★ {book.rating}</span>
                      <span>{book.year}</span>
                    </span>
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">♡</div>
              <h3>{page === "favorites" ? "Sevimlilar hozircha bo‘sh" : "Kitob topilmadi"}</h3>
              <p>Kitobni sevimlilarga qo‘shish uchun yurakchani bosing.</p>
            </div>
          )}
        </section>
      </main>

      {readingBook && (
        <div className="modal-backdrop">
          <section className="reader-modal" role="dialog" aria-modal="true">
            <header className="reader-header">
              <div>
                <div className="eyebrow muted">KITOB O‘QISH</div>
                <h2>{readingBook.title}</h2>
                <span className="book-author">{readingBook.author}</span>
              </div>
              <div className="reader-actions">
                <button onClick={startListening}>🔊 Tinglash</button>
                <button onClick={() => speechSynthesis.cancel()}>⏹ To‘xtatish</button>
                <button onClick={() => {
                  speechSynthesis.cancel();
                  setReadingBook(null);
                }}>
                  ✕ Yopish
                </button>
              </div>
            </header>
            <article className="reader-text">
              {readingBook.text ? (
                readingBook.text.split("\n").map((paragraph, index) =>
                  paragraph.trim() ? <p key={index}>{paragraph}</p> : null,
                )
              ) : (
                <>
                  <p>{readingBook.description}</p>
                  <p className="reader-empty">
                    Bu kitobda to‘liq matn yo‘q. Admin panelidan matni bor kitob qo‘shing.
                  </p>
                </>
              )}
            </article>
          </section>
        </div>
      )}

      {adminOpen && (
        <div className="modal-backdrop">
          <form className="admin-modal" onSubmit={addBook}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setAdminOpen(false)}
            >
              ×
            </button>
            <div className="eyebrow muted">ADMIN PANEL</div>
            <h2>Kitob qo‘shish</h2>

            <input
              required
              placeholder="Kitob nomi"
              value={newBook.title}
              onChange={(event) => setNewBook({ ...newBook, title: event.target.value })}
            />
            <input
              required
              placeholder="Muallif"
              value={newBook.author}
              onChange={(event) => setNewBook({ ...newBook, author: event.target.value })}
            />
            <select
              value={newBook.category}
              onChange={(event) => setNewBook({ ...newBook, category: event.target.value })}
            >
              {categories.slice(1).map((item) => <option key={item}>{item}</option>)}
            </select>
            <input
              placeholder="Muqova rasmi URL (ixtiyoriy)"
              value={newBook.cover}
              onChange={(event) => setNewBook({ ...newBook, cover: event.target.value })}
            />
            <textarea
              required
              placeholder="Kitob haqida qisqacha"
              value={newBook.description}
              onChange={(event) => setNewBook({ ...newBook, description: event.target.value })}
            />
            <textarea
              required
              className="book-text-input"
              placeholder="Kitobning o‘qiladigan matnini kiriting"
              value={newBook.text}
              onChange={(event) => setNewBook({ ...newBook, text: event.target.value })}
            />
            <button className="auth-submit" type="submit">Kitobni saqlash</button>
          </form>
        </div>
      )}
    </div>
  );
}
