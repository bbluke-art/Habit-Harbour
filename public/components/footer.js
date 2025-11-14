class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          background: #1a202c;
          color: white;
          padding: 2rem;
          text-align: center;
          margin-top: auto;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          text-align: left;
        }
        .footer-section h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #e2e8f0;
        }
        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-section li {
          margin-bottom: 0.5rem;
        }
        .footer-section a {
          color: #a0aec0;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-section a:hover {
          color: white;
        }
        .footer-bottom {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #2d3748;
          font-size: 0.875rem;
          color: #a0aec0;
        }
        @media (max-width: 640px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      </style>
      <footer>
        <div class="footer-content">
          <div class="footer-section">
            <h3>HabitHarbor</h3>
            <p>Your personal dock for tracking progress and building better habits every day.</p>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Dashboard</a></li>
              <li><a href="/habits.html">Habits</a></li>
              <li><a href="/stats.html">Statistics</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><a href="/blog.html">Blog</a></li>
              <li><a href="/tips.html">Habit Tips</a></li>
              <li><a href="/support.html">Support</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Connect</h3>
            <div class="flex gap-4">
              <a href="#"><i data-feather="twitter"></i></a>
              <a href="#"><i data-feather="instagram"></i></a>
              <a href="#"><i data-feather="facebook"></i></a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} HabitHarbor. All rights reserved.</p>
        </div>
      </footer>
    `;
  }
}
customElements.define('custom-footer', CustomFooter);
