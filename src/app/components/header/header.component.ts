import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { APIResponse, Customer } from '../../models/train';
import { TrainService } from '../../services/train.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  registerObj:Customer=new Customer();
  trainService=inject(TrainService);
  loginObj:any={
      "phone": "",
      "password": ""
  }

  loggedUser:Customer=new Customer();

  constructor(){
    const localData=localStorage.getItem('trainApp');
    if(localData!=null){
      this.loggedUser =JSON.parse(localData);
    }
  }

  onLogOff(){
    this.loggedUser=new Customer();
    localStorage.removeItem("trainApp");
  }

  onRegister(){
    this.trainService.createNewCustomer(this.registerObj).subscribe((res:APIResponse)=>{
      if(res.result){
        alert("Register Success");
        this.closeRegister();
      }
      else{
        alert(res.message);
      }
    })
  }

  onLogin(){
    this.trainService.onLogin(this.loginObj).subscribe((res:APIResponse)=>{
      if(res.result){
        alert("Login Success");
        localStorage.setItem('trainApp', JSON.stringify(res.data));
        this.closeLogin();
        // Tür kontrolü ve dönüşüm
        if (typeof res.data === 'object') {
          this.loggedUser = res.data as Customer;
        } else {
          this.loggedUser = JSON.parse(res.data) as Customer;
        }

      } else {
        alert(res.message);
      }
    })
  }

  openRegister(){
    const model=document.getElementById("registerModel");
    if(model!=null){
      model.style.display='block';
    }
  }

  openLogin(){
    const model=document.getElementById("loginModel");
    if(model!=null){
      model.style.display='block';
    }
  }

  closeRegister(){
    const model=document.getElementById("registerModel");
    if(model!=null){
      model.style.display='none';
    }
  }

  closeLogin(){
    const model=document.getElementById("loginModel");
    if(model!=null){
      model.style.display='none';
    }
  }
}
