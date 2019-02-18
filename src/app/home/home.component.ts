import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';

import {User} from '@app/_models';
import {AuthenticationService, UserService} from '@app/_services';
import {Project} from '@app/_models/project';
import {Task} from '@app/_models/task';
import {ContextMenuComponent} from 'ngx-contextmenu';
import {Reminder} from '@app/_models/reminder';
import {Priority} from '@app/_models/priority';
import {TaskService} from '@app/_services/task.service';
import {ModalDismissReasons, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {formatDate} from '@angular/common';
import {WeatherSettings, TemperatureScale, ForecastMode, WeatherLayout} from 'angular-weather-widget';

@Component({templateUrl: 'home.component.html', styleUrls: ['./home.component.css']})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;
  datePick: NgbDateStruct = {year: 0, month: 0, day: 0};

  constructor(
    private authenticationService: AuthenticationService,
    private taskService: TaskService,
    private userService: UserService,
    private modalService: NgbModal,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  @ViewChild('projectMenu') public projectMenu: ContextMenuComponent;
  projects: Project[] = [];
  reminders: Reminder[] = [];
  editedTask: Task;
  priority = Priority;
  closeResult: string;
  priorityValues = Object.values(Priority).filter(value => typeof value === 'string') as string[];
  currentProject: Project;
  settings: WeatherSettings;

  ngOnInit() {
    this.currentProject = new Project('');
    this.currentProject.tasks = [];

    this.taskService.getProjects().subscribe((res: Project[]) => {
      console.log(JSON.stringify(res));
      this.currentProject = res[0];
      this.projects.push.apply(this.projects, res);
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.settings = {
          location: {
            latLng: {lat: position.coords.latitude, lng: position.coords.longitude}
          },
          backgroundColor: '#347c57',
          color: '#ffffff',
          width: '200px',
          height: 'auto',
          showWind: false,
          scale: TemperatureScale.CELCIUS,
          forecastMode: ForecastMode.GRID,
          showDetails: false,
          showForecast: false,
          layout: WeatherLayout.NARROW,
          language: 'en'
        };
      });
    } else {
      alert('Geolocation is not supported by this browser.');
      this.settings = {
        location: {
          cityName: 'Warsaw'
        },
        backgroundColor: '#347c57',
        color: '#ffffff',
        width: '200px',
        height: 'auto',
        showWind: false,
        scale: TemperatureScale.CELCIUS,
        forecastMode: ForecastMode.GRID,
        showDetails: false,
        showForecast: false,
        layout: WeatherLayout.NARROW,
        language: 'en'
      };
    }
  }

  ngOnDestroy() {
  }

  addTask(name: String): void {
    name = name.trim();
    if (!name) {
      return;
    }

    const newTask = new Task(name);
    this.taskService.addTask(new Task(name), this.currentProject.id).subscribe(task => {
      newTask.id = task.id;
      this.taskService.getReminders(newTask.id).subscribe(reminders => {
        newTask.reminders = reminders;
        this.currentProject.tasks.push(newTask);
      });
    });
  }

  addProject(name: String): void {
    name = name.trim();
    if (!name) {
      return;
    }

    this.taskService.addProject(new Project(name)).subscribe(project => {
      this.projects.push(project);
    });
  }

  finishTask(taskToFinish: Task): void {
    taskToFinish.completed = true;
    this.taskService.updateTask(taskToFinish, this.currentProject.id).subscribe((task: Task) => {
      if (task.completed) {
        this.currentProject.tasks = this.currentProject.tasks.filter(value => value.id !== task.id);
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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

    this.taskService.updateTask(this.editedTask, this.currentProject.id).subscribe((task: Task) => {
      const index = this.currentProject.tasks.findIndex(value => value.id === task.id);
      task.project = this.currentProject;
      this.currentProject.tasks[index] = task;
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

  getTodayTasks() {
    if (this.currentProject.tasks !== null) {
      return this.currentProject.tasks
        .filter(value => !value.completed)
        .filter(value => value.reminders !== null)
        .filter(value => value.reminders[0].date !== null)
        .filter(value => value.reminders[0].date === this.todayDate());

    }
  }

  getNext7Days() {
    if (this.currentProject.tasks !== null) {
      return this.currentProject.tasks
        .filter(value => !value.completed)
        .filter(value => value.reminders !== null)
        .filter(value => value.reminders[0].date !== this.todayDate());
    }
  }

  setProject(project: Project) {
    this.currentProject = project;
    this.currentProject.tasks = project.tasks;
  }

  getProjectsWithoutInbox() {
    return this.projects.filter(value => value.name !== 'Inbox');
  }

  removeProject(project: Project) {
    project.removed = true;
    this.taskService.updateProject(project).subscribe((res: Project) => {
      if (res.removed) {
        this.projects = this.projects.filter(value => value.id !== res.id);
      }
    });

  }
}
