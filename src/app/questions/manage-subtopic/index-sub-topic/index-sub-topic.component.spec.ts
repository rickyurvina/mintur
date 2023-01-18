import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexSubTopicComponent } from './index-sub-topic.component';

describe('IndexSubTopicComponent', () => {
  let component: IndexSubTopicComponent;
  let fixture: ComponentFixture<IndexSubTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexSubTopicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexSubTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
