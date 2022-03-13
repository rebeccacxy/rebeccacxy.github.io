import { Link } from 'gatsby';
import React from 'react';

const classes = {
  wrapper: 'mb-6',
  name: 'font-semibold text-gray-900',
  description: 'text-base text-gray-600 font-light',
  info: 'text-base text-gray-800 font-dark mt-2',
  tech: 'text-base text-gray-800 font-dark mt-1',
};

const SummaryItem = ({
  name,
  description,
  link = false,
  internal = false,
  info,
  tech,
}) => {
  let linkContent;
  if (internal) {
    linkContent = <Link to={link}>{name}</Link>;
  } else {
    linkContent = <a href={link}>{name}</a>;
  }

  return (
    <div className={classes.wrapper}>
      <h3
        className={`${classes.name} ${
          link ? 'hover:underline hover:text-black' : ''
        }`}
      >
        {link ? linkContent : name}
      </h3>
      <p className={classes.description}>{description}</p>
      <p className={classes.info}>{info}</p>
      {tech ? (
        <p className={classes.tech}>
          <b>Tech Stack: </b>
          {tech}
        </p>
      ) : (
        ''
      )}
    </div>
  );
};

export default SummaryItem;
