import { States } from './document.machine';

export class Document {
  public id: number;
  public name: string;
  public stateId: States;

  constructor(id: number, name: string, stateId: States) {
    this.id = id;
    this.name = name;
    this.stateId = stateId;
  }
}
