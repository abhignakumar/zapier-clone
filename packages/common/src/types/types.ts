export type AllZaps = {
  id: string;
  userId: string;
  createdAt: Date;
  trigger: {
    type: {
      id: string;
      name: string;
      image: string;
    };
  } | null;
  actions: {
    type: {
      id: string;
      name: string;
      image: string;
    };
  }[];
}[];

export type Trigger = {
  availableTriggerId: string;
  metaData?: any;
};

export type Action = {
  availableActionId: string;
  order: number;
  metaData?: any;
};

export type AvailableTA = {
  id: string;
  name: string;
  image: string;
};
