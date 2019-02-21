import {Task} from './task';
import {User} from './user';

export class Project {

    id: number;
    tasks: Task[];
    name: String;
    user: User;
    removed: boolean;

    constructor(name: String) {
        this.name = name;
    }
}
