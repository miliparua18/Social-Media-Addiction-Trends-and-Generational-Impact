import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-gradient-line"></div>
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div className="footer-brand">
            <h2 className="footer-logo">.SM<span>S</span></h2>
            <p>
               An AI-based tool to predict addiction tendencies and promote healthy digital habits.
            </p>
          </div>

          {/* Team Column */}
          <div className="footer-links">
            <h4>Engineering Team</h4>
            <ul>
              <li>
                <a href="https://www.linkedin.com/in/sankar-bhunia-2a7ab12a6/" target="_blank" rel="noopener noreferrer">
                  Sankar Bhunia <span className="dev-tag">Lead</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/mili-parua-658376310/" target="_blank" rel="noopener noreferrer">
                  Mili Parua <span className="dev-tag">ML</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/sayantanghosh29/" target="_blank" rel="noopener noreferrer">
                  Sayantan Ghosh <span className="dev-tag">Analyst</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact/Status Column */}
          <div className="footer-status">
            <h4>System Services</h4>
            <div className="status-item">
              <span className="status-indicator"></span>
              <p>Addiction Prediction</p>
            </div>
            <div className="status-item">
              <span className="status-indicator"></span>
              <p>Area Wise Visualization</p>
            </div>
            <div className="status-item">
              <span className="status-indicator"></span>
              <p>Future Generational Impact</p>
            </div>
            <div className="status-item">
              <span className="status-indicator"></span>
              <p>Personalized Recommendations</p>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Final Year Project</p>
          <div className="footer-legal">
            <span>Built with Python & React</span>
            <span className="separator">|</span>
            <span>West Bengal, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;