import { TestBed } from '@angular/core/testing';

import { MockServiceService } from './mock-service.service';

describe('MockServiceService', () => {
  let service: MockServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
