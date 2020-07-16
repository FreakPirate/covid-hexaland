export const ERROR_CODE_HEXAGON_PRESENT = 1;
export const ERROR_CODE_INVALID_NEIGHBOR = 2;
export const ERROR_CODE_BORDER_TAKEN = 3;
export const ERROR_CODE_INVALID_NAME = 4;
export const ERROR_CODE_PATH_DOES_NOT_EXIST = 5;

export const ERROR_MESSAGES = {
  [ERROR_CODE_HEXAGON_PRESENT]: "Hexagon name already present",
  [ERROR_CODE_INVALID_NEIGHBOR]: "Neighbor already present",
  [ERROR_CODE_BORDER_TAKEN]: "Border is taken",
  [ERROR_CODE_INVALID_NAME]: "Hexagon not present",
  [ERROR_CODE_PATH_DOES_NOT_EXIST]:
    "Can not remove %(name)! No other path exists amongst surrounding neighbors",
};
