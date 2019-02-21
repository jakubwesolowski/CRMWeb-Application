import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TaskService} from '@app/_services/task.service';
import {UserService} from '@app/_services';
import {Task} from '@app/_models/task';
import {ContextMenuComponent} from 'ngx-contextmenu';
import {ModalDismissReasons, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {formatDate} from '@angular/common';
import {Priority} from '@app/_models/priority';

@Component({
    selector: 'app-task-view',
    templateUrl: './task-view.component.html',
    styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {

    @Input() public tasks: Task[];
    @ViewChild('taskMenu') public taskMenu: ContextMenuComponent;
    priority = Priority;
    priorityValues = Object.values(Priority).filter(value => typeof value === 'string') as string[];
    datePick: NgbDateStruct = {year: 0, month: 0, day: 0};
    editedTask: Task;
    closeResult: string;
    @Input() private projectId: number;

    constructor(
        private taskService: TaskService,
        private userService: UserService,
        private modalService: NgbModal,
    ) {
    }

    ngOnInit() {
    }

    finishTask(taskToFinish: Task): void {
        taskToFinish.completed = true;
        this.taskService.updateTask(taskToFinish, this.projectId).subscribe((task: Task) => {
            if (task.completed) {
                this.tasks = this.tasks.filter(value => value.id !== task.id);
            }
        });
    }

    open(content) {
        if (this.editedTask.reminders !== null && this.editedTask.reminders.length > 0 && this.editedTask.reminders[0].date !== null) {
            const arr = this.editedTask.reminders[0].date.split('/');
            this.datePick.year = Number(arr[0]);
            this.datePick.month = Number(arr[1]);
            this.datePick.day = Number(arr[2]);
        }

        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    saveEditedTask() {
        if (this.datePick.day !== 0 && this.datePick.month !== 0 && this.datePick.day !== 0) {
            let month = '';
            if (this.datePick.month < 10) {
                month = `0${this.datePick.month}`;
            } else {
                month = `${this.datePick.month}`;
            }

            let day = '';
            if (this.datePick.day < 10) {
                day = `0${this.datePick.day}`;
            } else {
                day = `${this.datePick.day}`;
            }

            this.editedTask.reminders[0].date = `${this.datePick.year}/${month}/${day}`;
        }

        this.taskService.updateTask(this.editedTask, this.projectId).subscribe((task: Task) => {
            const index = this.tasks.findIndex(value => value.id === task.id);
            this.tasks[index] = task;
        });

        this.datePick = {year: 0, month: 0, day: 0};
    }

    todayDate() {
        return formatDate(Date.now(), 'yyyy/MM/dd', 'en');
    }

    tomorrowDate() {
        const todayDate = new Date();
        const tomorrow = todayDate.setDate(todayDate.getDate() + 1);
        return formatDate(tomorrow, 'yyyy/MM/dd', 'en');
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
}
