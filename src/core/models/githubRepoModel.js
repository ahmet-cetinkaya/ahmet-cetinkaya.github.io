export default class GithubRepoModel {
  constructor({
    name,
    description,
    url,
    primaryLanguage: { langName, langColor },
    tagsArray,
    stargazerCount,
    watchersCount,
    isFork,
    forksCount,
    openIssues,
    isArchived,
    createdAt,
    updatedAt,
  }) {
    this.name = name;
    this.description = description;
    this.url = url;
    this.primaryLanguage = {
      name: langName,
      color: langColor,
    };
    this.tags = tagsArray;
    this.stargazerCount = stargazerCount;
    this.watchersCount = watchersCount;
    this.isFork = isFork;
    this.forksCount = forksCount;
    this.openIssues = openIssues;
    this.isArchived = isArchived;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
