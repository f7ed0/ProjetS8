import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../user.service';
import { ApiServiceService } from '../api-service.service';

@Component({
  selector: 'app-sugg',
  standalone: true,
  templateUrl: './sugg.component.html',
  styleUrl: './sugg.component.scss',
  imports: [MatTableModule, MatPaginatorModule, MatPaginator, HeaderComponent],
})
export class SuggComponent implements AfterViewInit {

  columnsLike: string[] = ["reponse"];
  columnsDislike: string[] = ["reponse", "commentaires"];
  columnsSuggestion: string[] = ["reponse", "commentaires"];

  dataLike = new MatTableDataSource<Like>();
  dataDislike = new MatTableDataSource<Dislike>();
  dataSuggestion = new MatTableDataSource<Suggestion>();


  constructor(
    private userService: UserService,
    private apiService : ApiServiceService,
  ) {}

  @ViewChild(MatPaginator) paginatorLike!: MatPaginator;
  @ViewChild(MatPaginator) paginatorDislike!: MatPaginator;
  @ViewChild(MatPaginator) paginatorSuggestion!: MatPaginator;

  ngAfterViewInit() {
    this.getFeedback();
    console.log(this.dataLike.data);
    this.dataLike.paginator = this.paginatorLike;
    this.dataDislike.paginator = this.paginatorDislike;
    this.dataSuggestion.paginator = this.paginatorSuggestion;
  }

  getFeedback(){
    this.apiService.getFeedbackLike().subscribe({
      next: (data: any) => {
        const dat: Like[] = data.map((item: { chat_ia: any; }) => {
          return {
            reponse: item.chat_ia
          };
        });
        this.dataLike = new MatTableDataSource<Like>(dat)
      },
      error: (error) => {
        console.error('There was an error getting likes!', error);
      }
    })

    this.apiService.getFeedbackDislike().subscribe({
      next: (data: any) => {
        console.log(data);
        const dat: Dislike[] = data.map((item: { chat_ia: any; feedback: any;}) => {
          return {
            reponse: item.chat_ia,
            commentaires : item.feedback
          };
        });
        this.dataDislike = new MatTableDataSource<Dislike>(dat)
      },
      error: (error) => {
        console.error('There was an error getting likes!', error);
      }
    })

    this.apiService.getFeedbackSuggestion().subscribe({
      next: (data: any) => {
        const dat: Suggestion[] = data.map((item: { chat_ia: any; feedback: any;}) => {
          return {
            reponse: item.chat_ia,
            commentaires : item.feedback
          };
        });
        this.dataSuggestion = new MatTableDataSource<Suggestion>(dat)
      },
      error: (error) => {
        console.error('There was an error getting likes!', error);
      } 
    })
    
  }
}


export interface Like {
  reponse: string;
}
export interface Dislike {
  reponse: string;
  commentaires: string;
}
export interface Suggestion {
  reponse: string;
  commentaires: string;
}

