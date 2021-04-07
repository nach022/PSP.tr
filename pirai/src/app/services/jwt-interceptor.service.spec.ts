/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { JwtInterceptorService } from './jwt-interceptor.service';

describe('Service: JwtInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwtInterceptorService]
    });
  });

  it('should ...', inject([JwtInterceptorService], (service: JwtInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
