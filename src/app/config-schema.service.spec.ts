import { TestBed } from '@angular/core/testing';

import { ConfigSchemaService } from './config-schema.service';

describe('ConfigSchemaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigSchemaService = TestBed.get(ConfigSchemaService);
    expect(service).toBeTruthy();
  });
});
