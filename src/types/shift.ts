type Shift = {
  name:string;
  shortName:string;
  color:string;
  startTime:string;
  endTime:string;
  type:string;
};

type Schedule = {
  name:string;
  color:string;
  startTime:Date;
  endTime:Date;
  level:number;
  isStart:boolean;
  isEnd:boolean;
}