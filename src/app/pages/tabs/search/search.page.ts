import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Events } from 'src/app/models/event.model';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy {

  @ViewChild('searchInput') sInput;
  model: any = {
    icon: "search-outline",
    title: "No Events Found",
    subTitle: ""
  };
  isLoading: boolean;
  query: any;
  events: Events[] = [];
  startAt = new Subject();
  endAt = new Subject();

  startObs = this.startAt.asObservable();
  endObs = this.endAt.asObservable();

  querySub: Subscription;

  constructor(
    private apiService: ApiService,
    public globalService: GlobalService,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.sInput.setFocus();
    }, 500);
    this.querySub = combineLatest(this.startObs, this.endObs).subscribe(val => {
      console.log('val: ', val);
      this.queryResults(val[0], val[1]);
    });
  }

  queryResults(start, end) {
    this.isLoading = true;
    this.apiService.collection('events', ref => ref.orderBy('short_name').startAt(start).endAt(end))
      .valueChanges()
      .pipe(take(1))
      .subscribe((data: any) => {
        this.events = data;
        this.isLoading = false;
      }, e => {
        this.isLoading = false;
        console.log(e);
        this.globalService.errorToast();
      });
  }

  async onSearchChange(event) {
    console.log(event.detail.value);
    this.query = event.detail.value.toLowerCase();
    this.events = [];
    this.querySearch();
  }

  querySearch() {
    if (this.query.length > 0) {
      this.startAt.next(this.query);
      this.endAt.next(this.query + '\uf8ff');
    }
  }

  ngOnDestroy(): void {
    if (this.querySub) this.querySub.unsubscribe();
  }

}
