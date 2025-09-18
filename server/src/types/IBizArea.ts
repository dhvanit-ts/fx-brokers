interface IBizArea {
  name: string;
  ranking: {
    country: string;
    code: string;
    value: number;
    flag: string;
  }[];
  chart: {
    labels: [];
    datasets: {
      name: string;
      data: {
        value: string;
        name: string;
      }[];
    }[];
  };
}


type BizArea = [IBizArea, IBizArea]