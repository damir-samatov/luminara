export type UserUpdateDto = {
  externalUserId: string;
  username: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
};

export type UserCreateDto = {
  externalUserId: string;
  username: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
};

export type UserDto = {
  id: string;
  username: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
};
