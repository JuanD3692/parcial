import { TestBed } from '@angular/core/testing';

import { MessageFlashService } from './message-flash.service';

describe('MessageFlashService', () => {
  let service: MessageFlashService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageFlashService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
