export interface Question {
  id:number,
  name:string,
  code:string,
  type:string,
  max_score:number,
  description:string,
  parent_id:number,
  value:number,
  questionsRelated:any[]
}
