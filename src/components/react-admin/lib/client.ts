import _ from 'lodash';
import pluralize from "pluralize";
import { CreateParams, DataProvider, DeleteManyParams, DeleteParams, GetListParams, GetManyParams, GetManyReferenceParams, GetOneParams, UpdateManyParams, UpdateParams } from "react-admin";
import { includeAndConvert } from './util';

export const requester = async (url: string, options: any = {}) => {
  options.credentials = "include";
  
  // JWT 토큰을 헤더에 추가
  const accessToken = localStorage.getItem("accessToken");
  
  // FormData 요청인지 확인
  const isFormData = options.body instanceof FormData;
  
  options.headers = {
    // FormData가 아닌 경우에만 Content-Type 설정
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(accessToken && { "Authorization": `Bearer ${accessToken}` }),
    ...options.headers,
  };

  const response = await fetch(url, options);

  const responseBody = await response.json();

  // 401 에러 시 토큰 만료로 처리
  if (response.status === 401) {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    return Promise.reject({
      message: "인증이 만료되었습니다. 다시 로그인해주세요.",
      status: 401
    });
  }

  // 200대 상태 코드를 성공으로 처리 (200, 201, 204 등)
  if (response.status < 200 || response.status >= 300) {
    if (responseBody?.errors?.find((error: any) => error.status == 401)) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      Promise.resolve();
    }

    // 에러 코드에 따른 커스텀 메시지 매핑
    const getErrorMessage = (errorCode: string): string => {
      switch (errorCode) {
        // 기본 에러 - 유효성 검증 관련
        case 'VALIDATION_ERROR':
          return '입력한 데이터가 올바르지 않습니다. 다시 확인해주세요.';
        case 'INVALID_UUID':
          return '잘못된 ID 형식입니다.';
        
        // 기본 에러 - 리소스 관련
        case 'NOT_FOUND':
          return '요청한 데이터를 찾을 수 없습니다.';
        case 'DUPLICATE_ENTRY':
          return '이미 존재하는 데이터입니다. 중복된 정보를 확인해주세요.';
        
        // 기본 에러 - 인증/권한 관련
        case 'UNAUTHORIZED':
          return '로그인이 필요합니다.';
        case 'FORBIDDEN':
          return '접근 권한이 없습니다.';
        
        // 기본 에러 - 서버 오류
        case 'DATABASE_ERROR':
          return '데이터베이스 처리 중 오류가 발생했습니다.';
        case 'INTERNAL_ERROR':
          return '서버 내부 오류가 발생했습니다.';
        
        // JSON API Spec Response 모듈 에러 코드
        case 'INVALID_REQUEST':
          return '잘못된 요청입니다.';
        
        // Excel 파일 처리
        case 'EXCEL_PARSING_ERROR':
          return 'Excel 파일을 읽는 중 오류가 발생했습니다. 파일 형식을 확인해주세요.';
        
        // CRUD 작업별 특화 에러 코드
        case 'SHOW_ERROR':
          return '데이터를 조회하는 중 오류가 발생했습니다.';
        case 'INDEX_ERROR':
          return '목록을 불러오는 중 오류가 발생했습니다.';
        case 'CREATE_ERROR':
          return '데이터를 생성하는 중 오류가 발생했습니다.';
        case 'UPDATE_ERROR':
          return '데이터를 수정하는 중 오류가 발생했습니다.';
        case 'DESTROY_ERROR':
          return '데이터를 삭제하는 중 오류가 발생했습니다.';
        
        default:
          return '백엔드 오류 발생';
      }
    };

    const errorCode = responseBody?.errors?.[0]?.code;
    const errorMessage = errorCode ? getErrorMessage(errorCode) : '백엔드 오류 발생';

    return Promise.reject(
      {
        message: errorMessage,
        status: response.status
      }
    );

  }

  return {
    status: response.status,
    headers: response.headers,
    body: responseBody,
    json: responseBody,
  }
}

function extractAttributes(data: any) {
  const attributes = _.omit(data, ["id", "type", "relationships"]);
  
  // 모든 필드에 대해 일반적인 처리
  Object.keys(attributes).forEach(key => {
    const value = attributes[key];
    
    // null이나 빈 문자열인 경우 제거
    if (value === '' || value === null || value === undefined) {
      delete attributes[key];
      return;
    }
    
    // 날짜 형식 문자열을 ISO 형식으로 변환 (YYYY-MM-DD 패턴)
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      attributes[key] = new Date(value + 'T00:00:00.000Z').toISOString();
    }
  });
  
  return attributes;
}

export const provider = (props: { url: string; settings?: any }): DataProvider => {
  const { url, settings } = props;

  return {
    getList: async (resource: string, params: GetListParams) => {
      const { page, perPage } = params.pagination ? params.pagination : { page: 1, perPage: 10 };

      const searchParams = new URLSearchParams();

      if (params.meta?.include) {
        searchParams.set("include", params.meta.include);
      }

      searchParams.set("page[number]", String(page));
      searchParams.set("page[size]", String(perPage));

      Object.keys(params.filter || {}).forEach((key) => {
        const value = params.filter[key];
        
        // user 객체 특별 처리
        if (key === 'user' && typeof value === 'object' && value !== null) {
          Object.keys(value).forEach((subKey) => {
            if (value[subKey] !== null && value[subKey] !== undefined) {
              searchParams.set(`filter[user.${subKey}]`, value[subKey]);
            }
          });
          return;
        }
        
        // 특수한 필터 키 처리 - 여러 패턴 체크
        if ((key === 'user.name_like' || key === 'user_name_like' || key === 'name_like') && value) {
          searchParams.set(`filter[user.name_like]`, value);
          return;
        }
        
        // 값이 객체가 아닌 경우에만 필터 추가
        if (value !== null && value !== undefined && typeof value !== 'object') {
          searchParams.set(`filter[${key}]`, value);
        } else if (typeof value === 'object' && value !== null) {
          // 객체인 경우 각 속성을 개별 필터로 추가 (일반적인 경우)
          Object.keys(value).forEach((subKey) => {
            if (value[subKey] !== null && value[subKey] !== undefined) {
              searchParams.set(`filter[${subKey}]`, value[subKey]);
            }
          });
        }
      });

      if (params.sort && params.sort.field) {
        const prefix = params.sort.order === "ASC" ? "" : "-";
        searchParams.set("sort", `${prefix}${params.sort.field}`);
      }

      const response = await requester(
        `${url}/${resource}?${searchParams.toString()}`,
        {
          method: "GET",
        },
      );

      let total = response.json.data.length;
      if (response.json.meta) {
        // Use settings.total if specified, otherwise default to 'total'
        const totalField = settings?.total || 'total';
        total = response.json.meta[totalField] || response.json.data.length;
      }

      return {
        data: includeAndConvert(response.json.data, response.json.included),
        total,
      };
    },
    getOne: async (resource: string, params: GetOneParams) => {
      const searchParams = new URLSearchParams();
      if (params.meta?.include) {
        searchParams.set("include", params.meta.include);
      }
      const response = await requester(
        `${url}/${resource}/${params.id}?${searchParams.toString()}`,
        {
          method: "GET",
        },
      );

      const converted = includeAndConvert(
        response.json.data,
        response.json.included,
      );
      return {
        data: converted,
      };
    },
    update: async (resource: string, params: UpdateParams) => {
      const { id, data } = params;

      if (data.relationships) {
        Object.values(data.relationships).forEach(async (relationship: any) => {
          if (!relationship?.type) {
            return;
          }

          await requester(
            `${url}/${pluralize(relationship.type)}/${relationship.id}`,
            {
              method: "PUT",
              body: JSON.stringify({
                data: {
                  id: relationship.id,
                  attributes: extractAttributes(relationship),
                },
              }),
            },
          );
        });
      }

      const response = await requester(`${url}/${resource}/${params.id}`, {
        method: "PUT",
        body: JSON.stringify({
          data: {
            id: id,
            attributes: extractAttributes(data),
          },
        }),
      });

      const json: { data: { id: string; attributes: any } } = response.json;
      return {
        data: {
          id: json.data.id,
          ...json.data.attributes,
        },
      };
    },
    create: async (resource: string, params: CreateParams) => {
      const { data } = params;

      const relationshipsToSend: any = {};
      if (data.relationships) {
        for (const key of Object.keys(data.relationships)) {
          const relationship = data.relationships[key];
          if (!relationship?.type) {
            continue;
          }

          const relationshipResponse = await requester(
            `${url}/${pluralize(relationship.type)}`,
            {
              method: "POST",
              body: JSON.stringify({
                data: {
                  attributes: extractAttributes(relationship),
                },
              }),
            },
          );

          if (!relationshipResponse) {
            continue;
          }

          relationshipsToSend[key] = {
            data: {
              id: relationshipResponse.json.data.id,
              type: relationshipResponse.json.data.type,
            },
          };
        }
      }

      const response = await requester(`${url}/${resource}`, {
        method: "POST",
        body: JSON.stringify({
          data: {
            attributes: extractAttributes(data),
            relationships: relationshipsToSend,
          },
        }),
      });

      const json: { data: { id: string; attributes: any } } = response.json;
      return {
        data: {
          id: json.data.id,
          ...json.data.attributes,
        },
      };
    },
    delete: async (resource: string, params: DeleteParams) => {
      await requester(`${url}/${resource}/${params.id}`, {
        method: "DELETE",
      });

      return { data: params.id };
    },

    deleteMany: async (resource: string, params: DeleteManyParams) => {
      const { ids } = params;
      const deletedIds = [];

      for (const id of ids) {
        try {
          await requester(`${url}/${resource}/${id}`, {
            method: "DELETE",
          });
          deletedIds.push(id);
        } catch (error) {
          console.error(`Error deleting ${resource} with id ${id}:`, error);
        }
      }

      return { data: deletedIds };
    },

    getMany: async (resource: string, params: GetManyParams) => {
      const { ids } = params;
      const data = [];

      for (const id of ids) {
        try {
          const response = await requester(`${url}/${resource}/${id}`, {
            method: "GET",
          });
          const converted = includeAndConvert(
            response.json.data,
            response.json.included,
          );
          data.push(converted);
        } catch (error) {
          console.error(`Error fetching ${resource} with id ${id}:`, error);
        }
      }

      return { data };
    },

    getManyReference: async (resource: string, params: GetManyReferenceParams) => {
      const { target, id, pagination = { page: 1, perPage: 10 }, sort, filter } = params;
      const { page, perPage } = pagination;

      const searchParams = new URLSearchParams();
      searchParams.set(`filter[${target}]`, id.toString());
      searchParams.set("page[number]", String(page));
      searchParams.set("page[size]", String(perPage));

      if (sort && sort.field) {
        const prefix = sort.order === "ASC" ? "" : "-";
        searchParams.set("sort", `${prefix}${sort.field}`);
      }

      Object.keys(filter || {}).forEach((key) => {
        const value = filter[key];
        
        // user 객체 특별 처리
        if (key === 'user' && typeof value === 'object' && value !== null) {
          Object.keys(value).forEach((subKey) => {
            if (value[subKey] !== null && value[subKey] !== undefined) {
              searchParams.set(`filter[user.${subKey}]`, value[subKey]);
            }
          });
          return;
        }
        
        // 특수한 필터 키 처리
        if (key === 'user.name_like' && value) {
          searchParams.set(`filter[user.name_like]`, value);
          return;
        }
        
        // 값이 객체가 아닌 경우에만 필터 추가
        if (value !== null && value !== undefined && typeof value !== 'object') {
          searchParams.set(`filter[${key}]`, value);
        } else if (typeof value === 'object' && value !== null) {
          // 객체인 경우 각 속성을 개별 필터로 추가
          Object.keys(value).forEach((subKey) => {
            if (value[subKey] !== null && value[subKey] !== undefined) {
              searchParams.set(`filter[${subKey}]`, value[subKey]);
            }
          });
        }
      });

      const response = await requester(
        `${url}/${resource}?${searchParams.toString()}`,
        {
          method: "GET",
        },
      );

      let total = response.json.data.length;
      if (response.json.meta) {
        // Use settings.total if specified, otherwise default to 'total'
        const totalField = settings?.total || 'total';
        total = response.json.meta[totalField] || response.json.data.length;
      }

      return {
        data: includeAndConvert(response.json.data, response.json.included),
        total,
      };
    },

    updateMany: async (resource: string, params: UpdateManyParams) => {
      const { ids, data } = params;
      const updatedIds = [];

      for (const id of ids) {
        try {
          await requester(`${url}/${resource}/${id}`, {
            method: "PUT",
            body: JSON.stringify({
              data: {
                id: id,
                attributes: extractAttributes(data),
              },
            }),
          });
          updatedIds.push(id);
        } catch (error) {
          console.error(`Error updating ${resource} with id ${id}:`, error);
        }
      }

      return { data: updatedIds };
    },
  };
};