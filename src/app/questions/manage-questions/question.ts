import { EstablishmentType } from "src/app/test-form/establishment-type";
export interface Question {
  id:number,
  name:string,
  code:string,
  type:string,
  max_score:number,
  description:string,
  parent_id:number,
  value:number,
  children_type:string,
  children:any[],
  dependent:number,
  establishment_type:EstablishmentType
}
