import './GithubPortfolio.scss';

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useI18next } from 'gatsby-plugin-react-i18next';
import classNames from 'classnames';
import { SiGithub } from '@react-icons/all-files/si/SiGithub';
import GithubApiAdapter from '../../../../core/services/githubApiAdapter';
import GithubRepoCard from '../../../../core/components/GithubRepoCard/GithubRepoCard';
import locales from '../../../../shared/constants/localesKeys';
import Title from '../../../../shared/components/Title/Title';

function GithubPortfolio({ personal, forks }) {
  const firstTabRef = useRef(null);
  const [elasticNavPillBackgroundStyle, setElasticNavPillBackgroundStyle] =
    useState({ top: 0, left: 0, width: 0 });
  const [currentFilterLabelLocaleKey, setCurrentFilterLabelLocaleKey] =
    useState(locales.portfolio.pinned);
  const [personalGithubRepos, setPersonalGithubRepos] = useState(
    new Array(6).fill(null)
  );
  const [iContributedGithubRepos, setIContributedGithubRepos] = useState(
    new Array(6).fill(null)
  );
  const [error, setError] = useState(null);

  const githubApiAdapter = new GithubApiAdapter(
    process.env.GATSBY_GITHUB_API_URL
  );
  const { t } = useI18next();

  const tabs = [
    {
      id: 'personal',
      name: t(locales.portfolio.personal),
      owner: personal,
      repos: personalGithubRepos,
      viewAllUrl: `https://github.com/${personal.userName}?tab=repositories`,
    },
    {
      id: 'iContributed',
      name: t(locales.portfolio.contribute),
      owner: forks,
      repos: iContributedGithubRepos,
      viewAllUrl: `https://github.com/orgs/${forks.userName}/repositories`,
    },
  ];
  const customFilterTypes = {
    pinned: 'pinned',
  };
  const customSortTypes = {
    stars: 'starts',
  };
  const filterOptions = [
    {
      name: t(locales.portfolio.pinned),
      onClick: () =>
        handleFilterClick(locales.portfolio.pinned, {
          customFilterType: customFilterTypes.pinned,
        }),
    },
    {
      name: t(locales.portfolio.mostSupported),
      onClick: () =>
        handleFilterClick(locales.portfolio.mostSupported, {
          customSortType: customSortTypes.stars,
        }),
    },
    {
      name: t(locales.portfolio.recent),
      onClick: () =>
        handleFilterClick(locales.portfolio.recent, {
          sortType: GithubApiAdapter.repoSortTypes.pushed,
        }),
    },
  ];
  // todo: get pinned repo by dynamic way
  const pinnedRepoUrls = {
    'ahmet-cetinkaya': [
      'https://github.com/ahmet-cetinkaya/rentacar-project-backend-dotnet',
      'https://github.com/ahmet-cetinkaya/rentacar-project-frontend-angular',
      'https://github.com/ahmet-cetinkaya/hrms-project-backend',
      'https://github.com/ahmet-cetinkaya/ReCapProject',
      'https://github.com/ahmet-cetinkaya/ReCapProject-Frontend',
      'https://github.com/ahmet-cetinkaya/northwind-project-backend-aspnet',
    ],
    'ahmet-cetinkaya-forks': [
      'https://github.com/ahmet-cetinkaya-forks/DevArchitecture',
      'https://github.com/ahmet-cetinkaya-forks/etiya-angular',
    ],
  };

  const getGithubReposForPreview = async (
    userName,
    userType,
    setStateCallback,
    { sortType, customSortType, customFilterType } = {}
  ) => {
    const githubReposResponse = await githubApiAdapter.getRepos(
      userName,
      userType,
      {
        sortType: sortType,
        page: 1,
        pageSize: customSortType || customFilterType ? null : 6,
      }
    );
    if (!githubReposResponse.isSuccess) {
      setError(githubReposResponse.message);
      return;
    }
    if (error) setError(null);

    let githubRepos = githubReposResponse.data;

    if (customFilterType === customFilterTypes.pinned) {
      githubRepos = pinnedRepoUrls[userName]
        .map((pinnedRepoUrl) =>
          githubRepos.find((repo) => repo.url === pinnedRepoUrl)
        )
        .slice(0, 6);
    }
    if (customSortType === customSortTypes.stars)
      githubRepos = githubRepos
        .sort((a, b) => b.stargazerCount - a.stargazerCount)
        .slice(0, 6);

    setStateCallback(githubRepos);
  };
  const getAllGithubTabsRepos = ({
    sortType,
    customSortType,
    customFilterType,
  } = {}) => {
    tabs.forEach((tab) => {
      getGithubReposForPreview(
        tab.owner.userName,
        tab.owner.userType,
        tab.owner.userName === personal.userName
          ? setPersonalGithubRepos
          : setIContributedGithubRepos,
        {
          sortType,
          customSortType,
          customFilterType,
        }
      );
    });
  };
  const loadingRepos = () => {
    const emptyRepos = new Array(6).fill(null);
    setPersonalGithubRepos(emptyRepos);
    setIContributedGithubRepos(emptyRepos);
  };
  const handleFilterClick = (
    labelLocaleKey,
    { sortType, customSortType, customFilterType } = {}
  ) => {
    loadingRepos();
    setCurrentFilterLabelLocaleKey(labelLocaleKey);
    getAllGithubTabsRepos({ sortType, customSortType, customFilterType });
  };
  const moveElasticNavPillBackground = (e) => {
    setElasticNavPillBackgroundStyle({
      top: `${e.target.offsetTop}px`,
      left: `${e.target.offsetLeft}px`,
      width: `${e.target.offsetWidth}px`,
    });
  };

  useEffect(() => {
    moveElasticNavPillBackground({ target: firstTabRef.current });
    getAllGithubTabsRepos({
      customFilterType: customFilterTypes.pinned,
    });
  }, []);

  return (
    <>
      <Title title={t(locales.portfolio.projects)} className="mb-3" />
      <div className="ac-github-portfolio">
        <div className="d-sm-flex justify-content-between">
          <ul
            className="nav mb-3 position-relative"
            id="ac-github-portfolio"
            role="tablist"
          >
            <div
              className="ac-elastic-nav-pill-background"
              style={elasticNavPillBackgroundStyle}
            />
            {tabs.map((tab, index) => (
              <li key={tab.id} className="nav-item" role="presentation">
                <button
                  ref={index === 0 ? firstTabRef : null}
                  onClick={moveElasticNavPillBackground}
                  className={classNames('nav-link btn border-0', {
                    active: index === 0,
                  })}
                  id={`ac-${tab.id}-repos-tab"`}
                  data-bs-toggle="pill"
                  data-bs-target={`#ac-${tab.id}-repos`}
                  type="button"
                  role="tab"
                  aria-controls={`ac-${tab.id}-repos`}
                  aria-selected="true"
                >
                  {tab.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="dropdown mb-3 mb-sm-0">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {t(currentFilterLabelLocaleKey)}
            </button>
            <ul className="dropdown-menu ac-bg-dark-color-2">
              {filterOptions.map((filterOption) => (
                <li key={filterOption.name}>
                  <button
                    type="button"
                    className="dropdown-item text-light"
                    onClick={filterOption.onClick}
                  >
                    {filterOption.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tab-content" id="ac-github-portfolioContent">
          {!error &&
            tabs.map((tab, tabIndex) => (
              <div
                key={tab.id}
                className={classNames('tab-pane fade', {
                  'show active': tabIndex === 0,
                })}
                id={`ac-${tab.id}-repos`}
                role="tabpanel"
                aria-labelledby={`ac-${tab.id}-repos-tab`}
                tabIndex={0}
              >
                <div className="row">
                  {tab.repos &&
                    tab.repos.map((repo) => (
                      <GithubRepoCard
                        key={repo ? repo.name : Math.random()}
                        githubRepoModel={repo}
                        className={{
                          containerClassName: 'col-lg-6 mb-4',
                          cardClassName: 'border-dark',
                        }}
                        isLoading={!repo}
                      />
                    ))}
                </div>
                <a
                  href={tab.viewAllUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary"
                >
                  <SiGithub />
                  <span className="mx-5">{t(locales.index.viewAll)}</span>
                </a>
              </div>
            ))}
          {error && (
            <div className="alert alert-danger" role="alert">
              {t(error)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

GithubPortfolio.propTypes = {
  personal: PropTypes.shape({
    userName: PropTypes.string.isRequired,
    userType: PropTypes.string.isRequired,
  }).isRequired,
  forks: PropTypes.shape({
    userName: PropTypes.string.isRequired,
    userType: PropTypes.string.isRequired,
  }).isRequired,
};

GithubPortfolio.defaultProps = {};

export default GithubPortfolio;
