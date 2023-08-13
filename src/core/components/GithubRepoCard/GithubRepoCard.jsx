import './GithubRepoCard.scss';

import React from 'react';
import PropTypes from 'prop-types';
import { GoRepo } from 'react-icons/go';
import { FaCircle, FaRegStar } from 'react-icons/fa';
import classNames from 'classnames';

import GithubRepoModel from '../../models/githubRepoModel';
import Label from '../Label/Label';

function GithubRepoCard({
  githubRepoModel,
  className: { containerClassName, cardClassName, tagLabelClassName },
  isLoading,
}) {
  if (isLoading)
    return (
      <GithubRepoCardPlaceHolder
        className={{ containerClassName, cardClassName }}
      />
    );

  return (
    <div className={classNames(containerClassName)}>
      <a
        href={githubRepoModel.url}
        target="_blank"
        className={classNames(cardClassName, 'ac-github-repo-card')}
      >
        <div className="mb-1">
          <h1 className="d-inline fs-6">
            <GoRepo /> <span className="ms-1">{githubRepoModel.name}</span>
          </h1>
          <p className="text-white-50 mb-0">{githubRepoModel.description}</p>
        </div>

        <div className="d-flex align-items-center">
          <FaCircle color={githubRepoModel.primaryLanguage.color} />
          <span className="ms-2">{githubRepoModel.primaryLanguage.name}</span>

          <FaRegStar className="ms-3" />
          <span className="ms-2">{githubRepoModel.stargazerCount}</span>

          <div className="ac-github-repo-card-tags">
            {githubRepoModel.tags &&
              githubRepoModel.tags.map((tag) => (
                <Label
                  key={tag}
                  name={tag}
                  className={classNames(
                    tagLabelClassName,
                    'ac-github-repo-card-tag-label'
                  )}
                />
              ))}
          </div>
        </div>
      </a>
    </div>
  );
}

GithubRepoCard.propTypes = {
  githubRepoModel: PropTypes.oneOfType([
    () => null,
    PropTypes.objectOf(GithubRepoModel),
  ]),
  className: PropTypes.shape({
    containerClassName: PropTypes.string,
    cardClassName: PropTypes.string,
    tagLabelClassName: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
};

GithubRepoCard.defaultProps = {
  githubRepoModel: null,
  className: {
    containerClassName: undefined,
    cardClassName: undefined,
    tagLabelClassName: undefined,
  },
  isLoading: false,
};

export default GithubRepoCard;

function GithubRepoCardPlaceHolder({
  className: { containerClassName, cardClassName },
}) {
  return (
    <div className={classNames(containerClassName)}>
      <div className={classNames(cardClassName, 'ac-github-repo-card')}>
        <div className="mb-1">
          <h1 className="d-inline fs-6 placeholder-glow">
            <GoRepo /> <span className="placeholder rounded col-6" />
          </h1>
          <p className="text-white-50 mb-0 placeholder-glow">
            <span className="placeholder rounded col-12 placeholder-lg" />
          </p>
        </div>

        <div className="placeholder-glow">
          <FaCircle />
          <span className="ms-2 placeholder-glow">
            <span className="placeholder rounded col-1 placeholder-sm" />
          </span>

          <FaRegStar className="ms-3" />
          <span className="ms-2 placeholder-glow">
            <span className="placeholder rounded col-1 placeholder-sm" />
          </span>

          <span className="ms-3 placeholder-glow">
            <span className="me-1 placeholder rounded col-1 placeholder-sm" />
            <span className="me-1 placeholder rounded col-1 placeholder-sm" />
            <span className="me-1 placeholder rounded col-1 placeholder-sm" />
          </span>
        </div>
      </div>
    </div>
  );
}

GithubRepoCardPlaceHolder.propTypes = {
  className: PropTypes.shape({
    containerClassName: PropTypes.string,
    cardClassName: PropTypes.string,
  }),
};

GithubRepoCardPlaceHolder.defaultProps = {
  className: {
    containerClassName: null,
    cardClassName: null,
  },
};
