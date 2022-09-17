import './HomeCredits.scss';

import React from 'react';
import Credit from '../../../../core/components/Credit/Credit';

function HomeCredits() {
  const credits = [
    {
      title: 'Retro Computer 3D Model',
      link: 'https://sketchfab.com/3d-models/retro-computer-3d-model-8c3b3b3b3b3b4b3b8b3b3b3b3b3b3b3b',
      author: 'dogflesh',
      authorLink: 'https://sketchfab.com/dogflesh',
      license: 'CC BY 4.0',
      details: 'change texture from original',
    },
  ];

  return (
    <div className="w-100 d-flex justify-content-end align-items-end">
      <Credit
        content={credits.map((credit) => (
          <div>
            <a
              href="https://sketchfab.com/3d-models/retro-computer-9439cb5e09cc44caa63dfbfb299df45f"
              target="_blank"
              rel="noreferrer"
            >
              {credit.title}
            </a>{' '}
            by{' '}
            <a href={credit.authorLink} target="_blank" rel="noreferrer">
              {credit.author}
            </a>
            , used under {credit.license}{' '}
            {credit.details && <>/ {credit.details}</>}
          </div>
        ))}
        classNames={{
          containerClassName: 'ac-home-credit d-flex justify-content-end',
        }}
      />
    </div>
  );
}

HomeCredits.propTypes = {};

HomeCredits.defaultProps = {};

export default HomeCredits;
