import { Technology } from "../models/Technology";
import { Icons } from "./Icons";

export enum Technologies {
  csharp,
  dotNetCore,
  javascript,
  typescript,
  nodeJS,
  expressJS,
  angular,
  react,
  solidJS,
  astro,
  dart,
  flutter,
  java,
  spring,
  php,
  laravel,
  sql,
  msSql,
  mySql,
  postgreSql,
  noSql,
  mongoDB,
  redis,
  unity,
  godot,
  azureDevOps,
}

export const TechnologiesData: Technology[] = [
  new Technology(Technologies.csharp, "C#", Icons.csharp, null, new Date("2024-12-01")),
  new Technology(Technologies.dotNetCore, ".NET Core", Icons.dotNetCore, [Technologies.csharp], new Date("2024-12-01")),

  new Technology(Technologies.javascript, "JavaScript", Icons.javascript, null, new Date("2024-12-01")),
  new Technology(
    Technologies.typescript,
    "TypeScript",
    Icons.typescript,
    [Technologies.javascript],
    new Date("2024-12-01"),
  ),
  new Technology(
    Technologies.nodeJS,
    "Node.js",
    Icons.nodeJS,
    [Technologies.javascript, Technologies.typescript],
    new Date("2024-12-01"),
  ),
  new Technology(Technologies.expressJS, "Express.js", Icons.expressJS, [Technologies.nodeJS], new Date("2024-12-01")),
  new Technology(Technologies.angular, "Angular", Icons.angular, [Technologies.typescript], new Date("2024-12-01")),
  new Technology(
    Technologies.react,
    "React",
    Icons.react,
    [Technologies.javascript, Technologies.typescript],
    new Date("2024-12-01"),
  ),
  new Technology(
    Technologies.solidJS,
    "Solid",
    Icons.solid,
    [Technologies.typescript, Technologies.typescript],
    new Date("2024-12-01"),
  ),
  new Technology(
    Technologies.astro,
    "Astro",
    Icons.astro,
    [Technologies.javascript, Technologies.typescript],
    new Date("2024-12-01"),
  ),

  new Technology(Technologies.dart, "Dart", Icons.dart, null, new Date("2024-12-01")),
  new Technology(Technologies.flutter, "Flutter", Icons.flutter, [Technologies.dart], new Date("2024-12-01")),

  new Technology(Technologies.java, "Java", Icons.java, null, new Date("2024-12-01")),
  new Technology(Technologies.spring, "Spring", Icons.spring, [Technologies.java], new Date("2024-12-01")),

  new Technology(Technologies.php, "PHP", Icons.php, null, new Date("2024-12-01")),
  new Technology(Technologies.laravel, "Laravel", Icons.laravel, [Technologies.php], new Date("2024-12-01")),

  new Technology(Technologies.sql, "SQL", Icons.sql, null, new Date("2024-12-01")),
  new Technology(Technologies.msSql, "MSSQL", Icons.mssql, [Technologies.sql], new Date("2024-12-01")),
  new Technology(Technologies.mySql, "MySQL", Icons.mysql, [Technologies.sql], new Date("2024-12-01")),
  new Technology(Technologies.postgreSql, "PostgreSQL", Icons.postgresql, [Technologies.sql], new Date("2024-12-01")),

  new Technology(Technologies.noSql, "NoSQL", Icons.nosql, null, new Date("2024-12-01")),
  new Technology(Technologies.mongoDB, "MongoDB", Icons.mongodb, [Technologies.noSql], new Date("2024-12-01")),
  new Technology(Technologies.redis, "Redis", Icons.redis, [Technologies.noSql], new Date("2024-12-01")),

  new Technology(Technologies.unity, "Unity", Icons.unity3d, [Technologies.csharp], new Date("2024-12-01")),
  new Technology(Technologies.godot, "Godot", Icons.godotEngine, [Technologies.csharp], new Date("2024-12-01")),

  new Technology(Technologies.azureDevOps, "Azure DevOps", Icons.azureDevOps, null, new Date("2024-12-01")),
];
