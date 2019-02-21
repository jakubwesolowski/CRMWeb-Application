import {Reminder} from './reminder';
import {Priority} from './priority';
import {Project} from '@app/_models/project';

export class Task {
    id: number;
    description: String;
    name: String;
    reminders: Reminder[];
    priority: Priority;
    project: Project;
    completed = false;

    constructor(name: String) {
        this.name = name;
    }
}
