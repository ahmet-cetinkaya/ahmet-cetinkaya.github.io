import type ITechnologiesService from "@application/features/technologies/services/abstraction/ITechnologiesService";

export default class SeoConstants {
  static readonly DEFAULT_TITLE = "Ahmet Çetinkaya";
  static readonly DEFAULT_TAGS = [
    "Ahmet Çetinkaya",
    "Backend Development",
    "Blog",
    "Code",
    "Coding",
    "Computer Engineer",
    "Developer",
    "DevOps",
    "Engineer",
    "Frontend Development",
    "Full Stack Development",
    "Mobile Development",
    "Personal Website",
    "Portfolio",
    "Programmer",
    "Programming",
    "Software Developer",
    "Software Development",
    "Software Engineer",
    "Software Engineering",
    "Software",
    "Technology",
    "Web Development",
  ];
  static DEFAULT_FAVICON_SVG: string = "/favicon.svg";

  static async getExtendedDefaultTags(technologiesService: ITechnologiesService): Promise<string[]> {
    const technologies = await technologiesService.getAll();
    return [...this.DEFAULT_TAGS, ...technologies.map((t) => t.name)];
  }

  static readonly DEFAULT_AUTHOR_META = {
    name: "Ahmet Çetinkaya",
    content: "contact@ahmetcetinkaya.me",
  };
}
