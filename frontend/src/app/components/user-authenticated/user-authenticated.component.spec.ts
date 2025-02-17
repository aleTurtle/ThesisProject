import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthenticatedComponent } from './user-authenticated.component';

describe('UserAuthenticatedComponent', () => {
  let component: UserAuthenticatedComponent;
  let fixture: ComponentFixture<UserAuthenticatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAuthenticatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAuthenticatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
