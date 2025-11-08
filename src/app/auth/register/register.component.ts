import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { GlobalService } from "../../services/global.service";
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private authService: AuthService,
      private globalService: GlobalService,
      private alertService: AlertService,
    ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    console.log('Register form submitted:', this.registerForm.value);
    try {
      const formData = this.registerForm.value;
      if (!formData.username || !formData.email || !formData.password) {
        throw new Error("Invalid Register request");
      }
      const apiBody = {
          username: formData.username,
          email: formData.email,
          password: formData.password
      }
      const registerDetail = await this.globalService.post("auth/register", apiBody);
      console.log("apiCall::",registerDetail);
      const username = registerDetail?.user?.username;
      const token = registerDetail?.token;
      if (!username || !token) {
        throw new Error("Invalid Register response");
      }
      this.authService.login(username, token, 24 * 60 * 60);
      this.router.navigate(['/chats']);
      this.alertService.success(`Welcome to MeChat ${username}`);
    } catch (error) {
      console.error("Register failed:", error);
    }
  }
}
