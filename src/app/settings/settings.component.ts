import {Component, OnInit} from '@angular/core';
import {User} from '@app/_models';
import {Subscription} from 'rxjs';
import {AuthenticationService, UserService} from '@app/_services';
import {TaskService} from '@app/_services/task.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  currentUser: User;
  currentUserSubscription: Subscription;
  newsletter: boolean;

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

  ngOnInit() {
    this.userService.getDaily().subscribe((daily: boolean) => {
      this.newsletter = daily;
    });
  }

  saveSettings() {
    if (this.newsletter) {
      this.userService.setDaily().subscribe();
    } else {
      this.userService.removeDaily().subscribe();
    }
  }
}
