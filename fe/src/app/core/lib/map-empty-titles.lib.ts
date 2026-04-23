import { ProtectedTitle } from '@party/shared';
import { ApiResult } from '../services/api.service';

//TODO this should be move to serverside setup
export function mapEmptyTitles(titles: ApiResult<ProtectedTitle[]>): ApiResult<ProtectedTitle[]> {
  if (titles.success && titles.result.length === 0) {
    titles.result = [
      {
        createdAt: new Date(),
        description: 'The fooly foolerson',
        id: 0,
        imageUrl: '/images/fool.png',
        name: 'The Fool',
        titleType: 'SINGLE_REQUIREMENT',
        updatedAt: new Date(),
      },
    ];
  }
  return titles;
}