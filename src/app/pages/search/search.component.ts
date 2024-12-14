import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIResponse, Customer, IStation, ITrain, Search } from '../../models/train';
import { TrainService } from '../../services/train.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [DatePipe,FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit{
  activatedRoute=inject(ActivatedRoute);
  trainerService=inject(TrainService)
  searchData:Search=new Search();
  trainList:ITrain[]=[];
  stationList:IStation[]=[];
  selectedTrain?: ITrain;
  passenger:any={
    "passengerName": "",
    "age": "0"
  }
  passengerList:any[]=[];
  loggedUserData:Customer=new Customer();

  constructor(){
    const localData=localStorage.getItem('trainApp');
    if(localData!=null){
      this.loggedUserData=JSON.parse(localData);
    }
    this.activatedRoute.params.subscribe((res:any)=>{
      this.searchData.fromStationId=res.fromStationId;
      this.searchData.toStationId=res.toStationId;
      this.searchData.dateOfTravel=res.dateOfTravel;
      this.getSearchTrains();
    })
  }

  ngOnInit(): void {
    this.loadAllStation();
  }

  bookTicket(){
    debugger;
    const bookingObj={
        "bookingId": 0,
        "trainId": this.selectedTrain?.trainId,
        "passengerId": this.loggedUserData.passengerID,
        "travelDate": this.searchData.dateOfTravel,
        "bookingDate": new Date(),
        "totalSeats": 0,
        "TrainAppBookingPassengers": [] as any
    }
    bookingObj.TrainAppBookingPassengers=this.passengerList;
    bookingObj.totalSeats=this.passengerList.length;
    this.trainerService.bookTrain(bookingObj).subscribe((res:APIResponse)=>{
      if(res.result){
        alert("Ticket Booked Success");
      }
      else{
        alert(res.message)
      }
    })
  }

  addPassenger(){
    const strObj=JSON.stringify(this.passenger);
    const parseObj=JSON.parse(strObj);
    this.passengerList.push(parseObj);
  }

  loadAllStation(){
    this.trainerService.getAllStations().subscribe((res:any)=>{
      this.stationList=res.data;
    })
  }

  getSearchTrains(){
    this.trainerService.getTrainsSearch(this.searchData.fromStationId, this.searchData.toStationId, this.searchData.dateOfTravel).subscribe((res:any)=>{
      this.trainList=res.data;
    })
  }

  open(train:ITrain){
    this.selectedTrain=train;
    const model=document.getElementById("myBookModel");
    if(model!=null){
      model.style.display='block';
    }
  }

  close(){
    const model=document.getElementById("myBookModel");
    if(model!=null){
      model.style.display='none';
    }
  }
}
