module.exports = {
  siteMetadata: {
    // Site URL for when it goes live
    siteUrl: `https://rebeccacxy.github.io`,
    pathPrefix: "/rebeccacxy.github.io",
    // Your Name
    name: 'Rebecca Chin',
    // Main Site Title
    title: `Rebecca Chin`,
    // Description that goes under your name in main bio
    description: `Computer Science Undergraduate at NUS`,
    // Optional: Twitter account handle
    // author: `@rfitzio`,
    // Optional: Github account URL
    github: `https://github.com/rebeccacxy`,
    // Optional: LinkedIn account URL
    linkedin: `https://www.linkedin.com/in/rcxy/`,
    // Content of the About Me section
    about: `Interested in creating efficient and human-centered technology solutions. In my free time, I lift at the gym.`,
    // Optional: List your projects, they must have `name` and `description`. `link` is optional.
    // projects: [
    //   {
    //     name: 'Devfolio',
    //     description:
    //       'A zero-config and blazing fast personal site + blog built with GatsbyJs and TailwindCSS',
    //     link: 'https://github.com/RyanFitzgerald/devfolio',
    //   },
    //   {
    //     name: 'ChromeExtensionKit',
    //     description:
    //       'Kit to jump-start your Chrome extension projects with a variety of battle-tested starter templates',
    //     link: 'https://chromeextensionkit.com/?ref=devfolio',
    //   },
    //   {
    //     name: 'Another Cool Project',
    //     description:
    //       'Lorem ipsum dolor sit amet consectetur adipisicing elit ducimus perferendis',
    //     link: 'https://github.com/RyanFitzgerald/devfolio',
    //   },
    // ],
    // Optional: List your experience, they must have `name` and `description`. `link` is optional.
    experience: [
      {
        name: 'Meta (Facebook)',
        description: 'Software Engineer Intern | May 2022 - Aug 2022',
        info: '> Led cross-functional efforts to build features for sellers to onboard more easily into real-time selling on Facebook Pages. \n> Spearheaded an internal debugging tool for dogfooding internal pages, used by teams in the organisation.',
        link: 'https://about.facebook.com/',
      },
      {
        name: 'WorkClass',
        description: 'Software Engineer Intern | Dec 2021 - Jan 2022',
        link: 'https://workclass.co/',
        info: '> Developed and improved upon frontend and backend features of core web applications used in production by 100,000 employers and jobseekers. Automated processes for scraping logs and worked with tools that monitor their health.',
        tech: 'Typescript, React, Gatsby, GraphQL, Cypress, Django, MySQL'
      },
      {
        name: 'Tinkertanker',
        description: 'Software Engineer Intern | Jan 2020 - Jun 2020',
        link: 'https://tinkertanker.com/',
      },
    ],
    // Optional: List your skills, they must have `name` and `description`.
    skills: [
      {
        name: 'Code',
        description:
          'Python, C++, Java, JavaScript, Typescript, SQL',
      },
    ],
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              wrapperStyle: `margin: 0 0 30px;`,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `ADD YOUR TRACKING ID HERE`, // Optional Google Analytics
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `devfolio`,
        short_name: `devfolio`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`, // This color appears on mobile
        display: `minimal-ui`,
        icon: `src/images/favicon.svg`,
      },
    },
  ],
};
