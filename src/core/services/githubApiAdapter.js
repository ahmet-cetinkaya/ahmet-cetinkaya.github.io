import axios from 'axios';
import GithubRepoModel from '../models/githubRepoModel';
import { ErrorDataResult, SuccessDataResult } from '../models/result';

const githubLanguagesData = require('../assets/data/githubLanguages.json');

export default class GithubApiAdapter {
  static userTypes = {
    user: 'user',
    organization: 'org',
  };

  static repoSortTypes = {
    fullName: 'full_name',
    created: 'created',
    updated: 'updated',
    pushed: 'pushed',
  };

  static sortTypeDirections = {
    asc: 'ASC',
    desc: 'DESC',
  };

  #apiUrl;
  #http;

  constructor(apiUrl) {
    this.#apiUrl = apiUrl;
    this.#http = axios.create({
      baseURL: this.#apiUrl,
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });
  }

  async getRepos(
    userName,
    userType,
    {
      sortType = GithubApiAdapter.repoSortTypes.pushed,
      sortTypeDirection = GithubApiAdapter.sortTypeDirections.desc,
      page,
      pageSize,
    } = {}
  ) {
    const reposResponse = await this.#http.get(
      `/${userType}s/${userName}/repos`,
      {
        params: {
          sort: sortType,
          direction: sortTypeDirection,
          page,
          per_page: pageSize,
        },
      }
    );

    const cacheKey = `githubApiAdapter_${userType}/${userName}/repos-sortType-${sortType}-sortTypeDirection-${sortTypeDirection}-page-${page}-pageSize-${pageSize}`;

    if (reposResponse.status !== 200) {
      const cacheResponse = localStorage.getItem(cacheKey);
      if (!cacheResponse)
        return new ErrorDataResult('errorFetchingGithubRepos');

      return new SuccessDataResult(
        'githubReposListedFromCache',
        JSON.parse(cacheResponse)
      );
    }

    const githubRepoModels = reposResponse.data.map(
      (repo) =>
        new GithubRepoModel({
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          primaryLanguage: {
            langName: repo.language,
            langColor: githubLanguagesData[repo.language]
              ? githubLanguagesData[repo.language].color
              : '#FFFFFF',
          },
          tagsArray: repo.topics,
          stargazerCount: repo.stargazers_count,
          watchersCount: repo.watchers_count,
          isFork: repo.fork,
          forksCount: repo.forks_count,
          openIssues: repo.open_issues,
          isArchived: repo.archived,
          createdAt: repo.createdAt,
          updatedAt: repo.updatedAt,
        })
    );

    localStorage.setItem(cacheKey, JSON.stringify(githubRepoModels));
    return new SuccessDataResult('githubReposListed', githubRepoModels);
  }
}
