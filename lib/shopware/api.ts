import { createAPIClient, RequestReturnType, ApiClientError } from '@shopware/api-client';
import { operations } from '@shopware/api-client/api-types';
import {
  ExtendedCategory,
  ExtendedCriteria,
  ExtendedCrossSellingElementCollection,
  extendedOperations,
  extendedPaths,
  ExtendedProductListingResult
} from './api-extended';
import {
  CategoryListingResultSW,
  ProductListingCriteria,
  RouteNames,
  SeoURLResultSW,
  StoreNavigationTypeSW
} from './types';
import { getStoreDomainWithApiType, getAccessToken, getApiType } from 'lib/shopware/helpers';

export function getApiClient(cartId?: string) {
  const apiClientParams = {
    baseURL: getStoreDomainWithApiType(),
    accessToken: getAccessToken(),
    apiType: getApiType(),
    contextToken: cartId
  };

  return createAPIClient<extendedOperations, extendedPaths>(apiClientParams);
}

// reimport operations return types to use it in application
export type ApiReturnType<OPERATION_NAME extends keyof operations> = RequestReturnType<
  OPERATION_NAME,
  operations
>;

export async function requestNavigation(
  type: StoreNavigationTypeSW,
  depth: number
): Promise<ExtendedCategory[] | undefined> {
  try {
    return await getApiClient().invoke(
      'readNavigation post /navigation/{activeId}/{rootId} sw-include-seo-urls',
      {
        activeId: type,
        rootId: type,
        depth: depth,
        'sw-include-seo-urls': true
      }
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      console.error(error);
      console.error('Details:', error.details);
    } else {
      console.error('==>', error);
    }
  }
}

export async function requestCategory(
  categoryId: string,
  criteria?: Partial<ProductListingCriteria>
): Promise<ExtendedCategory | undefined> {
  try {
    return await getApiClient().invoke('readCategory post /category/{navigationId}?slots', {
      navigationId: categoryId,
      ...criteria
    });
  } catch (error) {
    if (error instanceof ApiClientError) {
      console.error(error);
      console.error('Details:', error.details);
    } else {
      console.error('==>', error);
    }
  }
}

export async function requestCategoryList(
  criteria: Partial<ExtendedCriteria>
): Promise<CategoryListingResultSW | undefined> {
  try {
    return await getApiClient().invoke('readCategoryList post /category', criteria);
  } catch (error) {
    if (error instanceof ApiClientError) {
      console.error(error);
      console.error('Details:', error.details);
    } else {
      console.error('==>', error);
    }
  }
}

export async function requestProductsCollection(
  criteria: Partial<ProductListingCriteria>
): Promise<ExtendedProductListingResult | undefined> {
  try {
    const result = (await getApiClient().invoke(
      'readProduct post /product',
      criteria
    )) as unknown as ExtendedProductListingResult;
    return result;
  } catch (error) {
    if (error instanceof ApiClientError) {
      console.error(error);
      console.error('Details:', error.details);
    } else {
      console.error('==>', error);
    }
  }
}

export async function requestCategoryProductsCollection(
  categoryId: string,
  criteria: Partial<ProductListingCriteria>
): Promise<ExtendedProductListingResult | undefined> {
  try {
    return await getApiClient().invoke('readProductListing post /product-listing/{categoryId}', {
      ...criteria,
      categoryId: categoryId
    });
  } catch (error) {
    if (error instanceof ApiClientError) {
      console.error(error);
      console.error('Details:', error.details);
    } else {
      console.error('==>', error);
    }
  }
}

export async function requestSearchCollectionProducts(
  criteria?: Partial<ProductListingCriteria>
): Promise<ExtendedProductListingResult | undefined> {
  try {
    return await getApiClient().invoke('searchPage post /search', {
      search: encodeURIComponent(criteria?.query || ''),
      ...criteria
    });
  } catch (error) {
    if (error instanceof ApiClientError) {
      console.error(error);
      console.error('Details:', error.details);
    } else {
      console.error('==>', error);
    }
  }
}

export async function requestSeoUrls(routeName: RouteNames, page: number = 1, limit: number = 100) {
  try {
    return await getApiClient().invoke('readSeoUrl post /seo-url', {
      page: page,
      limit: limit,
      filter: [
        {
          type: 'equals',
          field: 'routeName',
          value: routeName
        }
      ]
    });
  } catch (error) {
    if (error instanceof ApiClientError) {
      console.error(error);
      console.error('Details:', error.details);
    } else {
      console.error('==>', error);
    }
  }
}

export async function requestSeoUrl(
  criteria: Partial<ExtendedCriteria>
): Promise<SeoURLResultSW | undefined> {
  try {
    return await getApiClient().invoke('readSeoUrl post /seo-url', criteria);
  } catch (error) {
    if (error instanceof ApiClientError) {
      console.error(error);
      console.error('Details:', error.details);
    } else {
      console.error('==>', error);
    }
  }
}

export async function requestCrossSell(
  productId: string,
  criteria?: Partial<ProductListingCriteria>
): Promise<ExtendedCrossSellingElementCollection | undefined> {
  try {
    return await getApiClient().invoke(
      'readProductCrossSellings post /product/{productId}/cross-selling',
      {
        productId: productId,
        ...criteria
      }
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      console.error(error);
      console.error('Details:', error.details);
    } else {
      console.error('==>', error);
    }
  }
}

export async function requestContext(cartId?: string) {
  try {
    return getApiClient(cartId).invoke('readContext get /context', {});
  } catch (error) {
    if (error instanceof ApiClientError) {
      console.error(error);
      console.error('Details:', error.details);
    } else {
      console.error('==>', error);
    }
  }
}
