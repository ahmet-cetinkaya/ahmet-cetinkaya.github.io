import './SocialLinks.scss';

import React from 'react';
import Popover from '../../../core/components/Popover/Popover';
import IconButton from '../../../core/components/IconButton/IconButton';
import { SiGithub, SiLinkedin, SiTwitter, SiInstagram, SiDiscord } from 'react-icons/si';
import { FaRegEnvelope, FaItchIo } from 'react-icons/fa';
import { BsMastodon } from 'react-icons/bs';
import aboutData from '../../assets/data/about.json'

function SocialLinks() {
  const getLinks = () => {
    const icon = { size: '1.8rem' };
    return [
      {
        name: 'Github',
        url: aboutData.links.github.url,
        icon: <SiGithub size={icon.size} />,
      },
      {
        name: 'LinkedIn',
        url: aboutData.links.linkedin.url,
        icon: <SiLinkedin size={icon.size} />,
      },
      {
        name: aboutData.links.email.userName,
        url: aboutData.links.email.url,
        icon: <FaRegEnvelope size={icon.size} />,
      },
      {
        name: 'itchio',
        url: aboutData.links.itchio.url,
        icon: <FaItchIo size={icon.size} />,
      },
      {
        name: 'Mastodon',
          url: aboutData.links.mastodon.url,
        icon: <BsMastodon size={icon.size} />,
      },
      {
        name: 'Twitter',
          url: aboutData.links.twitter.url,
        icon: <SiTwitter size={icon.size} />,
      },
      {
        name: 'Instagram',
        url: aboutData.links.instagram.url,
        icon: <SiInstagram size={icon.size} />,
      },
      {
        name: 'Discord',
        url: aboutData.links.discord.url,
        icon: <SiDiscord size={icon.size} />,
      },
    ];
  };

  return (
    <div className="d-flex overflow-auto w-100 py-2">
      {getLinks().map(({ name, url, icon }) => (
        <Popover key={name} content={name} placement="bottom">
          <IconButton link={url} icon={icon} />
        </Popover>
      ))}
    </div>
  );
}

SocialLinks.propTypes = {};

SocialLinks.defaultProps = {};

export default SocialLinks;
