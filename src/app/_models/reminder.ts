import {NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Task} from '@app/_models/task';

export class Reminder {
  id: number;
  alarm: String;
  date: String;
  task: Task;
}
