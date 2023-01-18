import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubTopicComponent } from './create-sub-topic.component';

describe('CreateSubTopicComponent', () => {
  let component: CreateSubTopicComponent;
  let fixture: ComponentFixture<CreateSubTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSubTopicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
