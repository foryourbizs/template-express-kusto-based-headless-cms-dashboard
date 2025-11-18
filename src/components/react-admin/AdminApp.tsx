"use client"; // remove this line if you choose Pages Router

import { useState, useEffect, createContext, useContext } from "react";
import {
	Resource,
	ListGuesser,
	EditGuesser,
	Admin,
	CustomRoutes
} from "react-admin";
import polyglotI18nProvider from 'ra-i18n-polyglot';
import koreanMessages from 'ra-language-korean';
import { BrowserRouter } from "react-router-dom";
import { dataProvider } from "./lib/dataProvider";
import authProvider from "./lib/authProvider";
import LoginPage from "./components/LoginPage";
import { lightTheme, darkTheme } from "./config/theme";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";

// Resource Components - 새로운 모듈화 구조
import { UsersList, UsersEdit, UsersCreate, UsersShow } from './components/pages/users';
import { UserSessionsList, UserSessionsShow } from './components/pages/user-sessions';
import { ObjectStoragesList, ObjectStoragesEdit, ObjectStoragesCreate, ObjectStoragesShow } from './components/pages/object-storages';
import { FilesList, FilesEdit, FilesCreate, FilesShow } from './components/pages/files';
import { AnalyticsLogsList } from './components/pages/analytics-logs';
import { AnalyticsVisitorList } from './components/pages/analytics-visitors';

// Icons
import {
	People,
	ViewList,
	Article,
	Storage,
	AttachFile,
} from '@mui/icons-material';
import { TermList } from "./components/pages/term";
import { PostList } from "./components/pages/posts";
import { TermTaxonomyList } from "./components/pages/term-taxonomy";

// 테마 컨텍스트 생성
interface ThemeContextType {
	darkMode: boolean;
	toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
	darkMode: false,
	toggleDarkMode: () => { },
});

export const useThemeMode = () => useContext(ThemeContext);


// 한글 메시지 커스터마이징
const customKoreanMessages = {
	...koreanMessages,
	ra: {
		...koreanMessages.ra,
		action: {
			...koreanMessages.ra.action,
			unselect: '선택 해제',
			select_all: '모두 선택',
			select_row: '행 선택',
			clear_input_value: '입력값 지우기',
			clear_array_input: '목록 지우기',
		},
		sort: {
			ASC: '오름차순',
			DESC: '내림차순',
		},
		navigation: {
			...koreanMessages.ra.navigation,
			no_results: '현재 필터 조건에 맞는 결과가 없습니다.',
			no_filtered_results: '현재 필터 조건에 맞는 결과가 없습니다.',
			clear_filters: '필터 초기화',
		},
		page: {
			...koreanMessages.ra.page,
			empty: '아직 항목이 없습니다.',
			invite: '새로 만들고 싶으신가요?',
		},
	},
};

const i18nProvider = polyglotI18nProvider(() => customKoreanMessages, 'ko');

// 인증 체크 로딩 컴포넌트
const AuthCheckLoader = () => (
	<div style={{
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '100vh',
		backgroundColor: '#f8fafc',
		gap: '16px',
		zIndex: 9999
	}}>
		<div style={{
			width: '40px',
			height: '40px',
			border: '3px solid #e2e8f0',
			borderTop: '3px solid #50a48c',
			borderRadius: '50%',
			animation: 'spin 1s linear infinite'
		}} />
		<p style={{
			margin: 0,
			color: '#64748b',
			fontSize: '14px',
			fontWeight: '500'
		}}>
			인증 확인 중...
		</p>
		<style>{`
			@keyframes spin {
				0% { transform: rotate(0deg); }
				100% { transform: rotate(360deg); }
			}
			body {
				overflow: hidden !important;
			}
		`}</style>
	</div>
);

const AdminApp = () => {
	// 초기값을 null로 설정하여 아무것도 렌더링하지 않음
	const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated' | null>(null);

	// 다크모드 상태 관리 (localStorage에서 초기값 가져오기)
	const [darkMode, setDarkMode] = useState(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('darkMode');
			return saved === 'true';
		}
		return false;
	});

	// 다크모드 토글 함수
	const toggleDarkMode = () => {
		setDarkMode(prev => {
			const newValue = !prev;
			if (typeof window !== 'undefined') {
				localStorage.setItem('darkMode', String(newValue));
			}
			return newValue;
		});
	};

	useEffect(() => {
		// 클라이언트에서만 실행
		if (typeof window === 'undefined') return;

		// 즉시 로딩 상태로 전환
		setAuthState('loading');

		// 앱 로드 시 인증 상태를 먼저 확인
		const checkInitialAuth = async () => {
			try {
				await authProvider.checkAuth({});
				setAuthState('authenticated');
			} catch (error) {
				setAuthState('unauthenticated');
			}
		};

		checkInitialAuth();

		// 로그아웃 이벤트 리스너 추가
		const handleLogout = () => {
			console.log('Logout event detected, switching to login page');
			setAuthState('unauthenticated');
		};

		// 커스텀 이벤트로 로그아웃 감지
		window.addEventListener('auth-logout', handleLogout);

		return () => {
			window.removeEventListener('auth-logout', handleLogout);
		};
	}, []);

	// 초기 상태이거나 로딩 중이면 로딩 화면만 표시
	if (authState === null || authState === 'loading') {
		return <AuthCheckLoader />;
	}

	// 모든 경우에 BrowserRouter로 감싸서 일관성 유지
	return (
		<ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
			<BrowserRouter>
				{authState === 'unauthenticated' ? (
					// 인증되지 않았으면 로그인 페이지
					<LoginPage />
				) : (
					// 인증된 사용자는 Admin 앱
					<Admin
						requireAuth
						dataProvider={dataProvider}
						authProvider={authProvider}
						i18nProvider={i18nProvider}
						theme={darkMode ? darkTheme : lightTheme}
						loginPage={LoginPage}
						layout={Layout}
						dashboard={Dashboard}
						// loading={() => <>xxx</>}
					>


						{/* 사용자 관리 */}
						<Resource
							name="privates/users"
							list={UsersList}
							edit={UsersEdit}
							create={UsersCreate}
							show={UsersShow}
							options={{ label: '사용자', menuGroup: 'users', menuGroupLabel: '사용자 관리', icon: <People /> }}
						/>
						<Resource
							name="privates/users/user-sessions"
							list={UserSessionsList}
							show={UserSessionsShow}
							options={{ label: '세션', menuGroup: 'users', menuGroupLabel: '사용자 관리', icon: <ViewList /> }}
						/>


						{/* 오브젝트 관리 */}
						<Resource
							name="privates/objectStorages"
							list={ObjectStoragesList}
							edit={ObjectStoragesEdit}
							create={ObjectStoragesCreate}
							show={ObjectStoragesShow}
							options={{ label: '저장소', menuGroup: 'objects', menuGroupLabel: '오브젝트', icon: <Storage /> }}
						/>
						<Resource
							name="privates/files"
							list={FilesList}
							show={FilesShow}
							edit={FilesEdit}
							create={FilesCreate}
							options={{ label: '파일', menuGroup: 'objects', menuGroupLabel: '오브젝트', icon: <AttachFile /> }}
						/>

						{/* 시스템 */}
						<Resource
							name="privates/terms"
							list={TermList}
							options={{ label: '대분류', menuGroup: 'systems', menuGroupLabel: '시스템', icon: <Storage /> }}
						/>

						{/* 포스트 */}
						<Resource
							name="privates/posts"
							list={PostList}
							options={{ label: '게시 아이템', menuGroup: 'posts', menuGroupLabel: '게시', icon: <Storage /> }}
						/>
						<Resource
							name="privates/terms/taxonomy"
							list={TermTaxonomyList}
							options={{ label: '게시 분류', menuGroup: 'posts', menuGroupLabel: '게시', icon: <Storage /> }}
						/>



						{/* 통계 관리 */}
						<Resource
							name="privates/analytics/logs"
							list={AnalyticsLogsList}
							options={{ label: '통계 데이터', menuGroup: 'analytics', menuGroupLabel: '통계', icon: <Storage /> }}
						/>
						<Resource
							name="privates/analytics/visitors"
							list={AnalyticsVisitorList}
							options={{ label: '고유 방문자', menuGroup: 'analytics', menuGroupLabel: '통계', icon: <Storage /> }}
						/>



					</Admin>
				)}
			</BrowserRouter>
		</ThemeContext.Provider>
	);
};

export default AdminApp;