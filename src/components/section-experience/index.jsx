import React from 'react';

import Section from '../section';
import SummaryItem from '../summary-item';

const SectionExperience = ({ experience }) => {
  if (!experience.length) return null;

  return (
    <Section title="Experience">
      {experience.map((item) => (
        <SummaryItem
          key={item.name}
          name={item.name}
          description={item.description}
          link={item.link}
          info={item.info}
          tech={item.tech}
          logo={item.logo}
        />
      ))}
    </Section>
  );
};

export default SectionExperience;
