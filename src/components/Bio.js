import React from "react";
import "../App.css";
import github from "../img/github.svg";
import linkedin from "../img/linkedin.svg";

const Bio = () => {
  return (
    <div>
      <div class="short-bio">
        <p>I'm a Computer Science student at the National University of Singapore. Incoming intern at SAP.</p>
        <p>
          I'm passionate about creating human-centered technology solutions that better people's lives.
        </p>
      </div>

      <div class="social-links">
        <a href="https://www.linkedin.com/in/rcxy/" aria-label="LinkedIn">
          <img src={linkedin} class="socials button" alt="LinkedIn Profile" />
        </a>
        <a href="https://github.com/rebeccacxy/" aria-label="GitHub">
          <img src={github} class="socials button" alt="GitHub Profile" />
        </a>
      </div>
    </div>
  );
};

export default Bio;
