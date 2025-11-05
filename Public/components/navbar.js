class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        nav {
          background: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .logo {
          color: #1a365d;
          font-weight: bold;
          font-size: 1.5rem;
          font-family: 'Playfair Display', serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nav-links {
          display: flex;
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        a {
          color: #4a5568;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        a:hover {
          color: #2b6cb0;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e2e8f0;
        }
        @media (max-width: 768px) {
          nav {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          .nav-links {
            gap: 1rem;
          }
        }
      </style>
      <nav>
        <a href="index.html" class="logo">
          <i data-feather="anchor"></i>
          HabitHarbor
        </a>
        <ul class="nav-links">
          <li><a href="index.html"><i data-feather="home"></i> Dashboard</a></li>
          <li><a href="habits.html"><i data-feather="list"></i> Habits</a></li>
          <li><a href="stats.html"><i data-feather="bar-chart-2"></i> Statistics</a></li>
          <li><a href="settings.html"><i data-feather="settings"></i> Settings</a></li>
          <li><a href="login.html"><i data-feather="log-in"></i> Login</a></li>
          <li><a href="login.html" id="logoutLink"><i data-feather="log-out"></i> Logout</a></li>
        </ul>
        <div class="user-profile">
          <img src="http://static.photos/people/40x40/123" alt="User" class="avatar">
          <span class="hidden md:inline text-gray-700">John Doe</span>
        </div>
      </nav>
    `;
  }
}

customElements.define('custom-navbar', CustomNavbar);


const logoutLink = this.shadowRoot.querySelector("#logoutLink");
logoutLink?.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("user");
  window.location.href = "/login.html";
});
