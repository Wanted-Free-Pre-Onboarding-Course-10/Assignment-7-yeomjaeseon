// == 바퀴 정보 타입 == //
export type TireInfo = {
  width: number;
  aspectRatio: number;
  wheelSize: number;
};

// == 앞바퀴, 뒷바퀴 정보 타입 == //
export type EntireTireInfo = {
  frontTire: TireInfo;
  rearTire: TireInfo;
};

export type ResponseTireInfo = {
  trimId: number;
  frontTire: TireInfo;
  rearTire: TireInfo;
};
