import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityBarComponent } from './identity-bar.component';

describe('IdentityBarComponent', () => {
  let component: IdentityBarComponent;
  let fixture: ComponentFixture<IdentityBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentityBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
