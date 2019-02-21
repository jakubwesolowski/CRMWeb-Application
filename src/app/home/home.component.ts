import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {User} from '@app/_models';
import {AuthenticationService} from '@app/_services';
import {Project} from '@app/_models/project';
import {Task} from '@app/_models/task';
import {TaskService} from '@app/_services/task.service';
import {formatDate} from '@angular/common';
import {ForecastMode, TemperatureScale, WeatherLayout, WeatherSettings} from 'angular-weather-widget';

@Component({templateUrl: 'home.component.html', styleUrls: ['./home.component.css']})
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    projects: Project[] = [];
    currentProject: Project;
    settings: WeatherSettings;
    areTasksLoaded = false;

    constructor(
        private authenticationService: AuthenticationService,
        private taskService: TaskService,
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        this.taskService.getProjects().subscribe((res: Project[]) => {
            this.currentProject = res[0];
            this.projects.push.apply(this.projects, res);
            this.areTasksLoaded = true;
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

    todayDate() {
        return formatDate(Date.now(), 'yyyy/MM/dd', 'en');
    }

    getTodayTasks() {
        if (this.areTasksLoaded) {
            return this.currentProject.tasks
                .filter(value => !value.completed)
                .filter(value => value.reminders !== null)
                .filter(value => value.reminders[0].date !== null)
                .filter(value => value.reminders[0].date === this.todayDate());
        } else {
            return [];
        }
    }

    getNext7Days() {
        if (this.areTasksLoaded) {
            return this.currentProject.tasks
                .filter(value => !value.completed)
                .filter(value => value.reminders !== null)
                .filter(value => value.reminders[0].date !== this.todayDate());
        } else {
            return [];
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
