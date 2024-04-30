interface NpmPackage {
    name: string;
    description: string;
    links: {
      npm: string;
      homepage: string;
      repository?: string;
      bugs: string;
    };
  }
  
export interface NpmSearchResult {
    objects: {
      package: NpmPackage;
  
      score: {
        detail: {
          popularity: number;
        };
      };
    }[];
    total: number;
  }