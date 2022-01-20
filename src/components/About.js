import React from "react";
import "../App.css";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import EmailIcon from "@material-ui/icons/Email";
import Resume from "../assets/Rebecca_Resume_Jan-2022.pdf"

const About = () => {
  return (
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
          <p class="return">bachelor of computing, computer science</p>
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
              href={Resume}
              target="_blank"
              rel="noreferrer"
            >
              resume.pdf
            </a>
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
            [computer security, machine learning, mathematics, coffee ❤️]
          </p>
        </div>
        <div class="statement" id="bottom">
          <p class="input">
            <span>&nbsp;</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
