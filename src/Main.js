import React from "react";
import "./App.css";
import About from "./components/About";
import Projects from "./components/Projects";
import Bio from "./components/Bio";
import Footer from "./components/Footer";

const Main = () => {
  return (
    <div>
      <div class="page" id="home">
        <div class="page-container">
          <div class="typewriter">
            <h1>
              Hi, I'm Rebecca.
            </h1>
          </div>
          <Bio />
          <About />
          <Projects />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Main;
