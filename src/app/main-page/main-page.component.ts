import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkActive } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { ProductNavigationComponent } from '../product-navigation/product-navigation.component';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProductNavigationComponent,
    AngularMaterialModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
  private authListenerSub!: Subscription;

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: boolean) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.authListenerSub) {
      this.authListenerSub.unsubscribe();
    }
  }
}
