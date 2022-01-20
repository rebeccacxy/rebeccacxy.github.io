import React from "react";
import "../App.css";
import cff from "../assets/cff3.png";
import flixie from "../assets/flixie_match.png";
import modpal from "../assets/modpal.png";
import cubey from "../assets/cubey.png";

const Projects = () => {
    return (
        <div class="section-title" id="projects">
        <h2>Projects</h2>

        <div class="project-card">
          <h3>Portfolio site</h3>
          <p class="project-description">
            The site you're currently visiting!
          </p>
          <div class="project-skills">
            <span class="project-skill">React</span>
            <span class="project-skill">HTML</span>
            <span class="project-skill">CSS</span>
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
            Cashflow forecasting software for BNP Pariba's clients to have a
            clearer understanding of their working capital.
          </p>
          <div class="project-skills">
            <span class="project-skill">Python</span>
            <span class="project-skill">Tensorflow</span>
            <span class="project-skill">Keras</span>
            <span class="project-skill">Scikit-learn</span>
          </div>
          <div class="project-links">
            <a
              href="https://github.com/rebeccacxy/ML_Cashflow_Forecasting"
              class="link button"
              target="_blank"
              rel="noreferrer"
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
            <span class="project-skill">React</span>
            <span class="project-skill">Typescript</span>
            <span class="project-skill">Firebase</span>
          </div>
          <div class="project-links">
            <a
              href="https://github.com/rebeccacxy/modpal-planner"
              class="link button"
              target="_blank"
              rel="noreferrer"
            >
              <i class="fab fa-github"></i> Repository
            </a>
            <a
              href="https://modpal-planner.web.app/"
              class="live-demo button"
              target="_blank"
              rel="noreferrer"
              style={{fontSize:18}}
            >
              <i class="fas fa-external-link-alt"></i>
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
            <span class="project-skill">React Native</span>
            <span class="project-skill">Javascript</span>
          </div>
          <div class="project-links">
            <a
              href="https://github.com/rebeccacxy/flixie"
              class="link button"
              target="_blank"
              rel="noreferrer"
            >
              <i class="fab fa-github"></i> Repository
            </a>
          </div>
        </div>
        <img src={flixie} class="flixie-img" alt="Project Img" />

        <div class="project-card">
          <h3 class="project-title">Cubey</h3>
          <p class="project-description">
            Rubik's cube solver with an interactive cube. <br/>
            Solves in two ways: Two-phase and Layer-by-Layer
          </p>
          <div class="project-skills">
            <span class="project-skill">Javascript</span>
            <span class="project-skill">HTML</span>
            <span class="project-skill">CSS</span>
          </div>
          <div class="project-links">
            <a
              href="https://github.com/rebeccacxy/cubey"
              class="link button"
              target="_blank"
              rel="noreferrer"
            >
              <i class="fab fa-github"></i> Repository
            </a>
            <a
              href="https://rebeccacxy.github.io/cubey/"
              class="live-demo button"
              target="_blank"
              rel="noreferrer"
              style={{fontSize:18}}
            >
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
        <img src={cubey} class="cubey-img" alt="Project Img" />

        {/* <div class="project-card">
          <h3 class="project-title">News sentiment analysis</h3>
          <p class="project-description">
            Sentiment analysis on Financial News.
          </p>
          <div class="project-skills">
            <span class="project-skill">Python</span>
            <span class="project-skill">Bert</span>
          </div>
          <div class="project-links">
            <a
              href="https://github.com/rebeccacxy/news-sentiment-analysis"
              class="link button"
              target="_blank"
              rel="noreferrer"
            >
              <i class="fab fa-github"></i> Repository
            </a>
          </div>
        </div> */}
      </div>
    );
}

export default Projects;