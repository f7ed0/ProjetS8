import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvsComponent } from './convs.component';

describe('ConvsComponent', () => {
  let component: ConvsComponent;
  let fixture: ComponentFixture<ConvsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConvsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
