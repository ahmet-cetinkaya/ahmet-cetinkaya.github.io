import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedinIn, faBehance, faTwitter, faInstagram, faItchIo, faDiscord, faSteam } from '@fortawesome/free-brands-svg-icons';
import Popper from '../../components/Popper/Popper';
import './SocialButtons.scss';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

interface Props {
  className?: string;
}

export default class SocialButtons extends Component<Props> {
  render(): JSX.Element {
    const { className } = this.props;
    return (
      <div className='d-flex'>
        <Popper text='Github' trigger='hover focus' placement='bottom'>
          <a href='https://github.com/ahmet-cetinkaya' target='_blank' rel='noreferrer' className={`rounded-circle hoverCircleBackground equal mx-1 ${className}`}>
            <FontAwesomeIcon icon={faGithub} color='white' />
          </a>
        </Popper>
        <Popper text='LinkedIn' trigger='hover focus' placement='bottom'>
          <a href='https://www.linkedin.com/in/ahmet-cetinkaya/' target='_blank' rel='noreferrer' className={`rounded-circle hoverCircleBackground equal mx-1 ${className}`}>
            <FontAwesomeIcon icon={faLinkedinIn} color='white' />
          </a>
        </Popper>
        <Popper text='Email' trigger='hover focus' placement='bottom'>
          <a href='mailto:ahmet4cetinkaya@outlook.com' target='_blank' rel='noreferrer' className={`rounded-circle hoverCircleBackground equal mx-1 ${className}`}>
            <FontAwesomeIcon icon={faEnvelope} color='white' />
          </a>
        </Popper>
        <Popper text='Behance' trigger='hover focus' placement='bottom'>
          <a href='https://www.behance.net/ahmetcetinkaya' target='_blank' rel='noreferrer' className={`rounded-circle hoverCircleBackground equal mx-1 ${className}`}>
            <FontAwesomeIcon icon={faBehance} color='white' />
          </a>
        </Popper>
        <Popper text='itch.io' trigger='hover focus' placement='bottom'>
          <a href='https://ahmetcetinkaya.itch.io/' target='_blank' rel='noreferrer' className={`rounded-circle hoverCircleBackground equal mx-1 ${className}`}>
            <FontAwesomeIcon icon={faItchIo} color='white' />
          </a>
        </Popper>
        <Popper text='Twitter' trigger='hover focus' placement='bottom'>
          <a href='https://twitter.com/ahmet4cetinkaya' target='_blank' rel='noreferrer' className={`rounded-circle hoverCircleBackground equal mx-1 ${className}`}>
            <FontAwesomeIcon icon={faTwitter} color='white' />
          </a>
        </Popper>
        <Popper text='Instagram' trigger='hover focus' placement='bottom'>
          <a href='https://www.instagram.com/ahmet4cetinkaya/' target='_blank' rel='noreferrer' className={`rounded-circle hoverCircleBackground equal mx-1 ${className}`}>
            <FontAwesomeIcon icon={faInstagram} color='white' />
          </a>
        </Popper>
        <Popper text='Discord' trigger='hover focus' placement='bottom'>
          <a href='https://discordapp.com/users/248840559039348736' target='_blank' rel='noreferrer' className={`rounded-circle hoverCircleBackground equal mx-1 ${className}`}>
            <FontAwesomeIcon icon={faDiscord} color='white' />
          </a>
        </Popper>
        <Popper text='Steam' trigger='hover focus' placement='bottom'>
          <a href='https://steamcommunity.com/id/J4UNE/' target='_blank' rel='noreferrer' className={`rounded-circle hoverCircleBackground equal mx-1 ${className}`}>
            <FontAwesomeIcon icon={faSteam} color='white' />
          </a>
        </Popper>
      </div>
    );
  }
}
