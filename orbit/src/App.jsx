
import { useState } from "react";
import "./App.css";

const destinations = [
  {
    country: "🇫🇷 FRANSIYA",
    name: "Parij",
    caption: "Romantika har qadamda",
    price: 890,
    type: "city",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
    tag: "✦ ENG MASHHUR",
  },
  {
    country: "🇨🇭 SHVEYTSARIYA",
    name: "Interlaken",
    caption: "Tog‘lar bag‘ridagi sokinlik",
    price: 1240,
    type: "nature",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85",
    tag: "TABIIY MO‘JIZA",
  },
  {
    country: "🇯🇵 YAPONIYA",
    name: "Kioto",
    caption: "An’analar va zamonaviylik",
    price: 1590,
    type: "city",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=85",
    tag: "YANGI MADANIYAT",
  },
  {
    country: "🇲🇻 MALDIV OROLLARI",
    name: "Maldiv",
    caption: "Okean bilan yuzma-yuz",
    price: 1790,
    type: "beach",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=85",
    tag: "OROL DAM OLISHI",
  },
  {
    country: "🇦🇪 BAA",
    name: "Dubay",
    caption: "Kelajak bugun boshlanadi",
    price: 970,
    type: "city",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=85",
    tag: "SHAHAR CHIROQLARI",
  },
  {
    country: "🇺🇿 O‘ZBEKISTON",
    name: "Chorvoq",
    caption: "Yaqin, go‘zal va unutilmas",
    price: 120,
    type: "nature",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85",
    tag: "SARGUZASHT",
  },
];

const filters = [
  ["all", "Barchasi"],
  ["city", "Shaharlar"],
  ["nature", "Tabiat"],
  ["beach", "Dengiz"],
];

const travelClasses = [
  { id: "economy", name: "Economy", detail: "Qulay va hamyonbop", multiplier: 1 },
  { id: "comfort", name: "Comfort", detail: "Qo‘shimcha qulaylik", multiplier: 1.45 },
  { id: "premium", name: "Premium", detail: "Eng zo‘r tajriba", multiplier: 2 },
];

function Globe() {
  return (
    <div className="hero-art" aria-label="Aylanayotgan neon sayyora">
      <div className="orbit orbit-a" />
      <div className="orbit orbit-b" />
      <div className="orbit orbit-c" />

      <div className="planet">
        <div className="planet-shine" />
        <div className="continent continent-one" />
        <div className="continent continent-two" />
        <div className="continent continent-three" />
        <div className="planet-grid" />
      </div>

      <div className="float-card card-paris">
        <span>🇫🇷</span>
        <div>
          <b>Parij</b>
          <small>Sevgi shahri</small>
        </div>
        <strong>↗</strong>
      </div>

      <div className="float-card card-japan">
        <span>🇯🇵</span>
        <div>
          <b>Yaponiya</b>
          <small>Sharq mo‘jizasi</small>
        </div>
        <strong>↗</strong>
      </div>

      <div className="float-card card-note">✦ Har bir safar — yangi hikoya</div>
      <span className="spark spark-a">✦</span>
      <span className="spark spark-b">✧</span>
    </div>
  );
}

function DestinationCard({ place, featured, liked, onLike, onBook }) {
  return (
    <article
      className={`destination-card ${featured ? "featured" : ""}`}
      style={{ "--photo": `url("${place.image}")` }}
    >
      <div className="card-top">
        <span className="tag">{place.tag}</span>
        <button
          className={`heart ${liked ? "liked" : ""}`}
          onClick={() => onLike(place.name)}
          aria-label={liked ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo‘shish"}
        >
          {liked ? "♥" : "♡"}
        </button>
      </div>

      <div className="card-info">
        <div>
          <small>{place.country}</small>
          <h3>{place.name}</h3>
          <p>{place.caption}</p>
        </div>
        <div className="price">
          ${place.price}
          <small>/ kishidan</small>
        </div>
      </div>

      <button className="card-book-button" onClick={() => onBook(place)}>
        Safarni tanlash <span>↗</span>
      </button>
    </article>
  );
}

function BookingModal({ place, onClose, onToast }) {
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [travelClass, setTravelClass] = useState("economy");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (!place) return null;

  const selectedClass =
    travelClasses.find((item) => item.id === travelClass) ?? travelClasses[0];

  const total = Math.round(place.price * selectedClass.multiplier * travelers);

  function handleSubmit(event) {
    event.preventDefault();

    if (!travelDate || !name.trim() || !phone.trim()) {
      onToast("Iltimos, sana va aloqa ma’lumotlarini to‘ldiring.");
      return;
    }

    onClose();
    onToast(`${place.name} safari uchun so‘rovingiz yuborildi!`);
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Yopish">
          ×
        </button>

        <div
          className="modal-cover"
          style={{ backgroundImage: `url("${place.image}")` }}
        >
          <span>{place.country}</span>
          <h2 id="booking-title">{place.name} safari</h2>
          <p>{place.caption}</p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="travel-date">
            Qachon yo‘lga chiqasiz?
          </label>
          <input
            id="travel-date"
            type="date"
            value={travelDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(event) => setTravelDate(event.target.value)}
            required
          />

          <div className="booking-row">
            <div className="traveler-field">
              <span className="field-label">Sayohatchilar</span>
              <div className="counter">
                <button
                  type="button"
                  onClick={() => setTravelers((count) => Math.max(1, count - 1))}
                  aria-label="Sayohatchilar sonini kamaytirish"
                >
                  −
                </button>
                <strong>{travelers} kishi</strong>
                <button
                  type="button"
                  onClick={() => setTravelers((count) => Math.min(12, count + 1))}
                  aria-label="Sayohatchilar sonini oshirish"
                >
                  +
                </button>
              </div>
            </div>

            <div className="price-preview">
              <span>Taxminiy narx</span>
              <strong>${total.toLocaleString("en-US")}</strong>
            </div>
          </div>

          <span className="field-label">Sayohat klassini tanlang</span>
          <div className="class-options">
            {travelClasses.map((item) => (
              <button
                className={`class-option ${travelClass === item.id ? "selected" : ""}`}
                type="button"
                key={item.id}
                onClick={() => setTravelClass(item.id)}
              >
                <span className="class-radio">
                  {travelClass === item.id ? "●" : "○"}
                </span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.detail}</small>
                </span>
              </button>
            ))}
          </div>

          <div className="booking-row contact-fields">
            <label>
              <span className="field-label">Ismingiz</span>
              <input
                type="text"
                placeholder="Ism Familiya"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
            <label>
              <span className="field-label">Telefon raqamingiz</span>
              <input
                type="tel"
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </label>
          </div>

          <button className="button button-primary booking-submit" type="submit">
            Safarni bron qilish <span>↗</span>
          </button>
          <p className="booking-note">
            Hozircha to‘lov olinmaydi. Menejerimiz siz bilan bog‘lanadi.
          </p>
        </form>
      </section>
    </div>
  );
}

export default function App() {
  const [filter, setFilter] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [bookingPlace, setBookingPlace] = useState(null);
  const [toast, setToast] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const visiblePlaces =
    filter === "all"
      ? destinations
      : destinations.filter((place) => place.type === filter);

  function showToast(message) {
    setToast(message);
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => setToast(""), 3200);
  }

  function toggleFavorite(placeName) {
    const isFavorite = favorites.includes(placeName);

    setFavorites((current) =>
      isFavorite
        ? current.filter((name) => name !== placeName)
        : [...current, placeName],
    );

    showToast(
      isFavorite
        ? `${placeName} sevimlilardan olib tashlandi`
        : `${placeName} sevimlilarga qo‘shildi`,
    );
  }

  function openBooking(place) {
    setBookingPlace(place);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="nav wrap">
        <a className="brand" href="#home" onClick={closeMenu}>
          <span>✳</span> ORBIT<span className="brand-dot">.</span>
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menyuni ochish yoki yopish"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "×" : "☰"}
        </button>

        <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          <a href="#places" onClick={closeMenu}>Yo‘nalishlar</a>
          <a href="#how" onClick={closeMenu}>Qanday ishlaydi</a>
          <a href="#about" onClick={closeMenu}>Biz haqimizda</a>
        </div>

        <a className="nav-cta" href="#places">
          Sayohatni boshlash <span>↗</span>
        </a>
      </nav>

      <main>
        <section className="hero wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><i /> DUNYO SIZNI KUTYAPTI</div>

            <h1>
              O‘zingizni
              <br />
              <span className="gradient-text">toping.</span>
              <br />
              Yo‘lga chiqing<span className="pink">.</span>
            </h1>

            <p>
              Oddiy sayohat emas. Yodingizda qoladigan lahzalar, yangi manzillar
              va o‘zingizga atalgan sarguzasht.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#places">
                Manzillarni ko‘rish <span>↗</span>
              </a>
              <a className="play-link" href="#how">
                <span className="play">▶</span> Biz qanday ishlaymiz?
              </a>
            </div>

            <div className="social-proof">
              <div className="avatars">
                <i>👩🏻</i><i>👨🏽</i><i>👩🏾</i><i>🧑🏼</i>
              </div>
              <div>
                <strong>12 ming+</strong>
                <small>sayohatchi bizga ishondi</small>
              </div>
              <div className="rating">
                <b>★ 4.9</b>
                <small>baholash</small>
              </div>
            </div>
          </div>

          <Globe />
          <a href="#places" className="scroll-hint">↓ &nbsp; PASTGA SURING</a>
        </section>

        <section className="trust wrap">
          <span>BU SAFARLAR SIZ UCHUN</span>
          <div className="trust-items">
            <b>✦ 100+ yo‘nalish</b>
            <b>◉ Ishonchli hamkorlar</b>
            <b>⌁ Oson bron qilish</b>
            <b>♡ 24/7 yordam</b>
          </div>
        </section>

        <section className="destinations wrap" id="places">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><i /> ORZUDAGI MANZILINGIZ</div>
              <h2>
                Keyingi bekat — <span className="gradient-text">qayer?</span>
              </h2>
              <p>
                Kayfiyatingizga mos joyni tanlang. Sarguzasht shu yerdan
                boshlanadi.
              </p>
            </div>
            <a className="text-link" href="#places">Barcha yo‘nalishlar ↗</a>
          </div>

          <div className="filters" role="group" aria-label="Yo‘nalish filtri">
            {filters.map(([id, label]) => (
              <button
                key={id}
                className={`filter ${filter === id ? "active" : ""}`}
                onClick={() => setFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="destination-grid">
            {visiblePlaces.map((place, index) => (
              <DestinationCard
                key={place.name}
                place={place}
                featured={filter === "all" && index === 0}
                liked={favorites.includes(place.name)}
                onLike={toggleFavorite}
                onBook={openBooking}
              />
            ))}
          </div>
        </section>

        <section className="how wrap" id="how">
          <div className="how-orb">
            ✳<span>ORBIT</span>
          </div>

          <div>
            <div className="eyebrow"><i /> OSONGINA</div>
            <h2>
              Uch qadam.
              <br />
              <span className="gradient-text">Bir umr esdalik.</span>
            </h2>

            <div className="steps">
              <div>
                <b>01</b>
                <p><strong>Manzilni tanlang</strong><small>Ko‘nglingiz tusagan joyni toping.</small></p>
              </div>
              <div>
                <b>02</b>
                <p><strong>Safarni rejalang</strong><small>Biz sizga eng qulay variantni tuzamiz.</small></p>
              </div>
              <div>
                <b>03</b>
                <p><strong>Yo‘lga chiqing</strong><small>Qolganini bizga qo‘yib bering.</small></p>
              </div>
            </div>

            <a className="button button-primary" href="#places">
              Sarguzashtni boshlash ↗
            </a>
          </div>
        </section>

        <section className="cta wrap" id="about">
          <div className="eyebrow"><i /> SIZNING NAVBATINGIZ</div>
          <h2>
            Dunyo katta.
            <br />
            <span className="gradient-text">Kutib o‘tirmang.</span>
          </h2>
          <p>Navbatdagi ajoyib hikoyangizni bugun boshlang.</p>
          <a className="button button-light" href="mailto:salom@orbit.uz">
            Biz bilan bog‘laning ↗
          </a>
          <span className="cta-star">✳</span>
        </section>
      </main>

      <footer className="footer wrap">
        <a className="brand" href="#home">
          <span>✳</span> ORBIT<span className="brand-dot">.</span>
        </a>
        <span>© 2025 ORBIT Travel. Barcha huquqlar himoyalangan.</span>
        <div>
          <a href="#about">Instagram</a>
          <a href="#about">Telegram</a>
        </div>
      </footer>

      {bookingPlace && (
        <BookingModal
          key={bookingPlace.name}
          place={bookingPlace}
          onClose={() => setBookingPlace(null)}
          onToast={showToast}
        />
      )}

      {toast && (
        <div className="toast-message" role="status">
          <span>✦</span> {toast}
        </div>
      )}
    </div>
  );
}
