import { Component, inject, OnInit } from '@angular/core';
import { TrainService } from '../../services/train.service';
import { IStation } from '../../models/train';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  trainService=inject(TrainService);
  router=inject(Router);

  stationList:IStation[]=[];
  fromStationId:number=0;
  toStationId:number=0;
  dateOfTravel:string='';

  ngOnInit(): void {
    this.loadAllStation();
  }

  loadAllStation(){
    this.trainService.getAllStations().subscribe((res:any)=>{
      this.stationList=res.data;
    })
  }
  onSearch(){
    if(this.fromStationId==0 || this.toStationId ==0 || this.dateOfTravel==''){
      alert("Select your Journey Details");
    }
    else{
      if(this.fromStationId==this.toStationId){
        alert("from n to station cant be same");
      }
      else{
        this.router.navigate(['/search',this.fromStationId,this.toStationId,this.dateOfTravel])
      }
    }
  }
}
