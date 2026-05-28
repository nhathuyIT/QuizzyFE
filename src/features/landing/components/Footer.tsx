"use client";

const footerLinks = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Resources: ["Blog", "Documentation", "Study guides", "API"],
  Company: ["About", "Careers", "Privacy", "Terms"],
};

export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <div className="nav-logo">
            <span>Q</span>
            Quizzy
          </div>
          <p>
            AI-powered flashcards and quizzes that adapt to you. Study less,
            remember more, and ace every exam.
          </p>
        </div>
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className="footer-col">
            <h5>{title}</h5>
            {links.map((link) => (
              <a key={link} href="#">
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <p>© 2026 Quizzy. All rights reserved.</p>
        <div className="footer-socials">
          <a className="social-btn" href="#">
            𝕏
          </a>
          <a className="social-btn" href="#">
            in
          </a>
          <a className="social-btn" href="#">
            ig
          </a>
          <a className="social-btn" href="#">
            yt
          </a>
        </div>
      </div>
    </footer>
  );
}
