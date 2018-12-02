import {Reminder} from './reminder';

export class Task {
  private id: number;
  private description: String;
  private name: String;
  private reminders: Reminder[];
  private completed = false;

  constructor(name: String) {
    this.name = name;
  }
}
