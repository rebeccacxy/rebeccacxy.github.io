import React from "react";
import "./App.css";
import github from "./img/github.svg";
import linkedin from "./img/linkedin.svg";
import cff from "./img/cff3.png";
import flixie from "./img/flixie_match.png";
import modpal from "./img/modpal.png";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import EmailIcon from "@material-ui/icons/Email";

const Main = () => {
  return (
    <div>
      <div class="page" id="home">
        <div class="page-container">
          <div class="typewriter">
            <h1>
              <a href="/">&gt; Rebecca</a>
            </h1>
          </div>
          <div class="short-bio">
            <p>
              Hi. 👋 I'm a Year 2 Computer Science Undergraduate @ NUS.
            </p>
            <p>
              I love making clean and efficient solutions to challenging
              problems.
            </p>
          </div>

          <div class="social-links">
            <a href="https://www.linkedin.com/in/rcxy/" aria-label="LinkedIn">
              <img
                src={linkedin}
                class="socials button"
                alt="LinkedIn Profile"
              />
            </a>
            <a href="https://github.com/rebeccacxy/" aria-label="GitHub">
              <img src={github} class="socials button" alt="GitHub Profile" />
            </a>
          </div>

          <div class="about">
            <div class="terminal-header">
              <div class="title">rebecca.exe</div>
              <div class="right-side-buttons">
                <div class="fas fa-window-minimize"></div>
                <div class="fas fa-window-restore"></div>
                <div class="fas fa-window-close"></div>
              </div>
            </div>
            <div class="terminal-window">
              <div class="statement" id="top">
                <p class="input">rebecca.location</p>
                <p class="return">singapore</p>
              </div>
              <div class="statement">
                <p class="input">rebecca.education</p>
                <p class="return">
                  bachelor of computing, computer science @ nus
                </p>
              </div>
              <div class="statement">
                <p class="input">rebecca.contact</p>
                <p class="return">
                  <a href="mailto:rebeccacxy@gmail.com">
                    <EmailIcon fontSize="small" /> rebeccachinxy@gmail.com
                  </a>
                </p>
              </div>
              <div class="statement">
                <p class="input">rebecca.resume</p>
                <p class="return">
                  <a
                    href="https://drive.google.com/file/d/1wFfCQXys6VkBxvtvOf2k2FyczZVfKdik/view?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                  >
                    rebecca.pdf
                  </a>
                </p>
              </div>
              <div class="statement">
                <p class="input">rebecca.skills</p>
                <p class="return">
                  [java, js, python, c++, react / react native, firebase, html,
                  css]
                </p>
              </div>
              <div class="statement">
                <p class="input">rebecca.socials</p>
                <p class="return">
                  <a href="https://www.linkedin.com/in/rcxy/">
                    <LinkedInIcon /> linkedin
                  </a>
                </p>
              </div>
              <div class="statement">
                <p class="input">rebecca.interests</p>
                <p class="return">
                  [frontend web & app dev, computer security, machine learning,
                  coffee ❤️]
                </p>
              </div>
              <div class="statement" id="bottom">
                <p class="input">
                  <span>&nbsp;</span>
                </p>
              </div>
            </div>
          </div>

          <div class="section-title" id="projects">
            <h2>&gt; Projects</h2>
            <p class="quote">
              "It’s not a bug – it’s an undocumented feature." - Anonymous
            </p>

            <div class="project-card">
              <h3>Portfolio site</h3>
              <p class="project-description">
                The site you're currently visiting!
              </p>
              <div class="project-skills">
                <span class="project-skill">reactjs</span>
                <span class="project-skill">html</span>
                <span class="project-skill">css</span>
              </div>
              <div class="project-links">
                <a
                  href="https://github.com/rebeccacxy/rebeccacxy.github.io"
                  class="link button"
                >
                  <i class="fab fa-github"></i> Repository
                </a>
              </div>
            </div>

            <div class="project-card">
              <h3 class="project-title">
                Cashflow Forecasting with BNP Paribas
              </h3>
              <p class="project-description">
                A custom cashflow forecasting tool for BNPP clients to have a
                clearer understanding of their working capital.
              </p>
              <div class="project-skills">
                <span class="project-skill">figma</span>
                <span class="project-skill">python</span>
                <span class="project-skill">tensorflow</span>
                <span class="project-skill">keras</span>
                <span class="project-skill">scikit-learn</span>
              </div>
              <div class="project-links">
                <a
                  href="https://github.com/rebeccacxy/ML_Cashflow_Forecasting"
                  class="link button"
                >
                  <i class="fab fa-github"></i> Repository
                </a>
              </div>
            </div>
            <img src={cff} class="project-img" alt="Project Img" />

            <div class="project-card">
              <h3 class="project-title">Undergraduate Module Planner</h3>
              <p class="project-description">
                Web application for advanced module planning. Features a
                prerequisite checker and drag-and-drop interface.
              </p>
              <div class="project-skills">
                <span class="project-skill">react</span>
                <span class="project-skill">typescript</span>
                <span class="project-skill">firebase</span>
              </div>
              <div class="project-links">
                <a
                  href="https://github.com/rebeccacxy/modpal-planner"
                  class="link button"
                >
                  <i class="fab fa-github"></i> Repository
                </a>
                <a
                  href="https://modpal-planner.web.app/"
                  class="live-demo button"
                >
                  Live Site <i class="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>
            <img src={modpal} class="modpal-img" alt="Project Img" />

            <div class="project-card">
              <h3 class="project-title">Flixie</h3>
              <p class="project-description">
                Create personalized movie recommendations for groups of friends.
              </p>
              <div class="project-skills">
                <span class="project-skill">react-native</span>
                <span class="project-skill">javascript</span>
                <span class="project-skill">firebase</span>
              </div>
              <div class="project-links">
                <a
                  href="https://github.com/rebeccacxy/flixie"
                  class="link button"
                >
                  <i class="fab fa-github"></i> Repository
                </a>
              </div>
            </div>
            <img src={flixie} class="flixie-img" alt="Project Img" />

            <div class="project-card">
              <h3 class="project-title">News sentiment analysis</h3>
              <p class="project-description">
                Sentiment analysis on Financial News.
              </p>
              <div class="project-skills">
                <span class="project-skill">python</span>
                <span class="project-skill">bert</span>
              </div>
              <div class="project-links">
                <a
                  href="https://github.com/rebeccacxy/news-sentiment-analysis"
                  class="link button"
                >
                  <i class="fab fa-github"></i> Repository
                </a>
              </div>
            </div>
          </div>
        </div>
        <footer class="copyright">
          <span>Thanks for visiting! ❤️</span>
        </footer>
      </div>
    </div>
  );
};

export default Main;
