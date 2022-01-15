import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
  attribution: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy',
    image: '/img/happiness.png',
    description: (
      <>
        Simple and clutter-free interface with intuitive behaviors
      </>
    ),
    attribution: <a href="https://www.flaticon.com/free-icons/emoji" title="emoji icons">Emoji icons created by Freepik - Flaticon</a>
  },
  {
    title: 'Collaborative',
    image: '/img/united.png',
    description: (
      <>
        Share and collaborate with others, anytime, anywhere
      </>
    ),
    attribution: <a href="https://www.flaticon.com/free-icons/friendship" title="friendship icons">Friendship icons created by Freepik - Flaticon</a>
  },
  {
    title: 'Powerful',
    image: '/img/cool.png',
    description: (
      <>
        Fully-featured task management system
      </>
    ),
    attribution: <a href="https://www.flaticon.com/free-icons/cool" title="cool icons">Cool icons created by Ruslan Babkin - Flaticon</a>
  },
];

function Feature({title, image, description, attribution}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} alt={title} src={image} />
      </div>
      <div className="text--center padding-horiz--md">
      {attribution}
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
