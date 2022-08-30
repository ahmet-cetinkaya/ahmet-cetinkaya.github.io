import './SocialLinks.scss';

import React from 'react';
import {SiGithub} from '@react-icons/all-files/si/SiGithub';
import {SiLinkedin} from '@react-icons/all-files/si/SiLinkedin';
import {FaRegEnvelope} from '@react-icons/all-files/fa/FaRegEnvelope';
import {FaItchIo} from '@react-icons/all-files/fa/FaItchIo';
import {SiTwitter} from '@react-icons/all-files/si/SiTwitter';
import {SiInstagram} from '@react-icons/all-files/si/SiInstagram';
import {SiDiscord} from '@react-icons/all-files/si/SiDiscord';
import Popover from '../../../core/components/Popover/Popover';
import IconButton from '../../../core/components/IconButton/IconButton';

function SocialLinks() {
  const getLinks = () => {
    const icon = {size: '1.8rem'};
    return [
      {
        name: 'Github',
        url: 'https://github.com/ahmet-cetinkaya',
        icon: <SiGithub size={icon.size} />,
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/ahmet-cetinkaya/',
        icon: <SiLinkedin size={icon.size} />,
      },
      {
        name: 'ahmetcetinkaya7@outlook.com',
        url: 'mailto:ahmetcetinkaya7@outlook.com',
        icon: <FaRegEnvelope size={icon.size} />,
      },
      {
        name: 'itchio',
        url: 'https://ahmetcetinkaya.itch.io/',
        icon: <FaItchIo size={icon.size} />,
      },
      {
        name: 'Twitter',
        url: 'https://twitter.com/ahmetctnky_dev',
        icon: <SiTwitter size={icon.size} />,
      },
      {
        name: 'Instagram',
        url: 'https://www.instagram.com/ahmetcetinkaya.raw/',
        icon: <SiInstagram size={icon.size} />,
      },
      {
        name: 'Discord',
        url: 'https://discordapp.com/users/248840559039348736',
        icon: <SiDiscord size={icon.size} />,
      },
    ];
  };

  return (
    <div className="d-flex overflow-auto w-100 py-2">
      {getLinks().map(({name, url, icon}) => (
        <Popover key={name} content={name} placement="bottom">
          <IconButton url={url} icon={icon} />
        </Popover>
      ))}
    </div>
  );
}

SocialLinks.propTypes = {};

SocialLinks.defaultProps = {};

export default SocialLinks;
