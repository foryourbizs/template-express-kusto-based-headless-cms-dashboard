import _ from 'lodash';
import pluralize from "pluralize";
import { CreateParams, DataProvider, DeleteManyParams, DeleteParams, GetListParams, GetManyParams, GetManyReferenceParams, GetOneParams, UpdateManyParams, UpdateParams } from "react-admin";
import { includeAndConvert } from './util';

// 토큰 자동 갱신을 위한 변수
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export const requester = async (url: string, options: any = {}) => {
  options.credentials = "include";
  
  // 토큰 만료 체크 및 자동 갱신
  const accessTokenExpiresAt = localStorage.getItem("accessTokenExpiresAt");
  const refreshTokenExpiresAt = localStorage.getItem("refreshTokenExpiresAt");
  
  if (accessTokenExpiresAt && refreshTokenExpiresAt) {
    const now = new Date().getTime();
    const accessTokenExpires = new Date(accessTokenExpiresAt).getTime();
    const refreshTokenExpires = new Date(refreshTokenExpiresAt).getTime();
    
    // Access Token이 5분 이내에 만료되고, Refresh Token이 아직 유효한 경우
    const fiveMinutes = 5 * 60 * 1000;
    if (accessTokenExpires - now < fiveMinutes && refreshTokenExpires > now) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshTokensInternal();
      }
      
      if (refreshPromise) {
        await refreshPromise;
      }
    }
  }
  
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

  try {
    const response = await fetch(url, options);
    
    // 네트워크 에러나 서버 연결 실패 체크
    if (!response.ok && (response.status >= 500 || response.status === 0)) {
      return Promise.reject({
        message: `서버 연결에 실패했습니다. (상태 코드: ${response.status})`,
        status: response.status || 500
      });
    }

    // Content-Type 체크
    const contentType = response.headers.get("content-type");
    
    let responseBody;
    try {
      // JSON 응답이 아닌 경우 처리 - JSON API 형식(application/vnd.api+json)도 허용
      if (!contentType || (!contentType.includes("application/json") && !contentType.includes("application/vnd.api+json"))) {
        const textResponse = await response.text();
        
        // HTML 페이지를 받은 경우 (보통 404, 500 페이지)
        if (textResponse.includes("<!DOCTYPE") || textResponse.includes("<html")) {
          return Promise.reject({
            message: `API 엔드포인트를 찾을 수 없습니다. URL을 확인해주세요: ${url}`,
            status: response.status || 404
          });
        }
        
        // 그 외 텍스트 응답
        return Promise.reject({
          message: `서버에서 올바르지 않은 응답을 받았습니다: ${textResponse.substring(0, 100)}...`,
          status: response.status || 500
        });
      }
      
      responseBody = await response.json();
    } catch (jsonError) {
      // JSON 파싱 에러 처리
      return Promise.reject({
        message: `서버 응답을 파싱할 수 없습니다. JSON 형식이 아닙니다.`,
        status: response.status || 500,
        details: `JSON 파싱 에러: ${jsonError instanceof Error ? jsonError.message : '알 수 없는 오류'}`
      });
    }

    // 401 에러 시 토큰 만료로 처리
    if (response.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // window.location.href = "/login";
      return Promise.reject({
        message: "인증이 만료되었습니다. 다시 로그인해주세요.",
        status: 401
      });
    }

  // 200대 상태 코드를 성공으로 처리 (200, 201, 204 등)
  if (response.status < 200 || response.status >= 300) {
    if (responseBody?.errors?.find((error: any) => error.status == 401)) {
      console.log(responseBody?.errors);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    //   window.location.href = "/login";
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
  } catch (networkError) {
    // 네트워크 에러나 기타 예외 처리
    return Promise.reject({
      message: `네트워크 오류가 발생했습니다: ${networkError instanceof Error ? networkError.message : '알 수 없는 오류'}`,
      status: 0
    });
  }
}

function extractAttributes(data: any) {
  const attributes = _.omit(data, ["id", "type", "relationships"]);
  
  // 날짜 필드를 ISO 형식으로 변환
  if (attributes.birthday && typeof attributes.birthday === 'string') {
    // YYYY-MM-DD 형식을 ISO 형식으로 변환
    if (attributes.birthday.match(/^\d{4}-\d{2}-\d{2}$/)) {
      attributes.birthday = new Date(attributes.birthday + 'T00:00:00.000Z').toISOString();
    }
  }
  
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
        searchParams.set(`filter[${key}]`, params.filter[key]);
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
        searchParams.set(`filter[${key}]`, filter[key]);
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

// 내부용 토큰 갱신 함수
const refreshTokensInternal = async (): Promise<void> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!accessToken || !refreshToken) {
      throw new Error('Access Token 또는 Refresh Token이 없습니다.');
    }

    const refreshUrl = process.env.ADMIN_SERVER_URL || process.env.NEXT_PUBLIC_ADMIN_SERVER_URL || 'http://localhost:3001';
    const response = await fetch(`${refreshUrl}/users/sign/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        refreshToken: refreshToken
      }),
    });

    if (!response.ok) {
      throw new Error(`토큰 갱신 실패: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.data?.attributes) {
      // 새로운 토큰들과 만료시간 저장
      localStorage.setItem("accessToken", result.data.attributes.accessToken);
      localStorage.setItem("refreshToken", result.data.attributes.refreshToken);
      
      if (result.data.attributes.accessTokenExpiresAt) {
        localStorage.setItem("accessTokenExpiresAt", result.data.attributes.accessTokenExpiresAt);
      }
      if (result.data.attributes.refreshTokenExpiresAt) {
        localStorage.setItem("refreshTokenExpiresAt", result.data.attributes.refreshTokenExpiresAt);
      }
    }
  } catch (error) {
    console.error('Internal token refresh error:', error);
    // 갱신 실패 시 로그아웃 처리
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpiresAt");
    localStorage.removeItem("refreshTokenExpiresAt");
    throw error;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};