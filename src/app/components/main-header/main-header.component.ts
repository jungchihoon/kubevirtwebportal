import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {
  currentRoute: string = '';
  constructor(
  private router: Router) {
        this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
        // Update the current route when navigation is complete
        this.currentRoute = event.url;
        }
        });
  }

  ngOnInit(): void {
  }


 reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.currentRoute]);


         }
}
