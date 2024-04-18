import { Component } from "@angular/core";
import { AuthService } from "../usuarios/auth.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})

export class HeaderComponent { 
    title:string = 'App Angular';
    authService : AuthService;
    constructor(authService : AuthService, private router : Router){
        this.authService = authService;
    }

    logout() : void {
        this.authService.logout();
        swal.fire("Logout", "Usted ha cerrado sesión!", "success");
        this.router.navigate(["/login"]);
    }
}