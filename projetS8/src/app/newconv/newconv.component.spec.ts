import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewconvComponent } from './newconv.component';

describe('NewconvComponent', () => {
  let component: NewconvComponent;
  let fixture: ComponentFixture<NewconvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewconvComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewconvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
