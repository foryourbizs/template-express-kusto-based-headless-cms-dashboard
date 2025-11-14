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

import ListGuesserEx from './components/guesser_______OLD/ListGuesser';
import ObjectStoragesList from './components/guesser_______OLD/ObjectStoragesList';
import ObjectStoragesEdit from './components/guesser_______OLD/ObjectStoragesEdit';
import ObjectStoragesCreate from './components/guesser_______OLD/ObjectStoragesCreate';
import FilesList from './components/guesser_______OLD/FilesList';
import FilesEdit from './components/guesser_______OLD/FilesEdit';
import FilesCreate from './components/guesser_______OLD/FilesCreate';
import FilesShow from './components/guesser_______OLD/FilesShow';

import { BrowserRouter } from "react-router-dom";
import {
	People,
	ViewList,
	Article,
	Storage,
	AttachFile,
} from '@mui/icons-material';

import { dataProvider } from "./lib/dataProvider";
import authProvider from "./lib/authProvider";
import LoginPage from "./components/LoginPage";
import { lightTheme, darkTheme, simpleGrayTheme } from "./config/theme";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import UserSessionList from "./components/guesser_______OLD/UserSessionList";
import UserList from "./components/guesser_______OLD/UserList";
import UserListSimple from "./components/guesser_______OLD/UserListSimple";
import UserLogsGroupedList from "./components/guesser_______OLD/UserLogsGroupedList";

import { CreateUserPermissions } from "./components/guesser_______OLD/CreateUserPermissions";
import PermissionsListWithDelete from "./components/guesser_______OLD/PermissionsList";
import UserAuditsShow from "./components/guesser_______OLD/UserAuditsShow";

import RatelimitsList from "./components/guesser_______OLD/RatelimitsList";
import SiteMenuList from "./components/guesser_______OLD/SiteMenuList";
import SiteMenuEdit from "./components/guesser_______OLD/SiteMenuEdit";
import SiteMenuCreate from "./components/guesser_______OLD/SiteMenuCreate";
import SiteMenuGroupList from "./components/guesser_______OLD/SiteMenuGroupList";
import SiteMenuGroupEdit from "./components/guesser_______OLD/SiteMenuGroupEdit";
import SiteMenuGroupCreate from "./components/guesser_______OLD/SiteMenuGroupCreate";
import PostList from "./components/guesser_______OLD/PostList";
import PostEdit from "./components/guesser_______OLD/PostEdit";

// 테마 컨텍스트 생성
interface ThemeContextType {
	darkMode: boolean;
	toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
	darkMode: false,
	toggleDarkMode: () => {},
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
    },
    sort: {
      ASC: '오름차순',
      DESC: '내림차순',
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
					>

			{/* <Resource name="privates/users" list={UserList} edit={EditGuesser} options={{ label: '사용자', menuGroup: 'users', menuGroupLabel: '사용자 관리', icon: <People /> }} /> */}
			{/* <Resource name="privates/users/user-sessions" list={UserSessionList} options={{ label: '세션', menuGroup: 'users', menuGroupLabel: '사용자 관리', icon: <ViewList /> }} /> */}
			{/* <Resource name="privates/users/roles" list={ListGuesserEx} options={{ label: '역할', menuGroup: 'users', menuGroupLabel: '사용자 관리', BulkDeleteButton: false, icon: <Article /> }} /> */}
			{/* <Resource name="privates/users/permissions" list={PermissionsListWithDelete} create={CreateUserPermissions} options={{ label: '권한', menuGroup: 'users', menuGroupLabel: '사용자 관리', icon: <Article /> }} /> */}
			{/* <Resource name="privates/users/ratelimits" list={RatelimitsList} options={{ label: '처리율 제한 장치', menuGroup: 'users', menuGroupLabel: '사용자 관리', icon: <Article /> }} /> */}
			{/* <Resource name="privates/users/audits" list={UserLogsGroupedList} show={UserAuditsShow} options={{ label: '사용자 로그', menuGroup: 'users', menuGroupLabel: '사용자 관리', icon: <Article /> }} /> */}
			 
			{/* <Resource name="privates/users/user-roles" list={ListGuesserEx} options={{ label: '역할 - 사용자 연결', menuGroup: 'users', menuGroupLabel: '사용자 관리', icon: <Article /> }} /> */}
			{/* <Resource name="privates/users/user-permissions" list={ListGuesserEx} options={{ label: '권한 - 사용자 연결', menuGroup: 'users', menuGroupLabel: '사용자 관리', icon: <Article /> }} /> */}
			{/* <Resource name="privates/users/user-security-events" list={ListGuesserEx} options={{ label: '사용자 보안 이벤트', menuGroup: 'users', menuGroupLabel: '사용자 관리', icon: <Article /> }} /> */}

			{/* <Resource name="privates/objectStorages" list={ObjectStoragesList} edit={ObjectStoragesEdit} create={ObjectStoragesCreate} options={{ label: '저장소', menuGroup: 'objects', menuGroupLabel: '오브젝트', icon: <Storage /> }} />
			<Resource name="privates/files" list={FilesList} show={FilesShow} edit={FilesEdit} create={FilesCreate} options={{ label: '파일', menuGroup: 'objects', menuGroupLabel: '오브젝트', icon: <AttachFile /> }} /> */}


			{/* 가상 Resource - 환경설정 페이지 (데이터 없음, 메뉴만 생성) */}
			<Resource name="system.settings" options={{ label: '데이터 분석', menuGroup: 'system', menuGroupLabel: '시스템' }} />

			{/* <Resource name="system.analytics" list={AnalyticsPage} options={{ label: '데이터 분석', menuGroup: 'system', menuGroupLabel: '시스템', icon: <Analytics /> }} /> */}
			{/* <Resource name="system.logs" list={SystemLogs} options={{ label: '시스템 로그', menuGroup: 'system', menuGroupLabel: '시스템', icon: <ViewList /> }} /> */}
{/* 
			<Resource name="privates/siteMenuGroup" list={SiteMenuGroupList} edit={SiteMenuGroupEdit} create={SiteMenuGroupCreate} options={{ label: '메뉴 그룹 관리', menuGroup: 'menus', menuGroupLabel: '사이트', icon: <Article /> }} />
			<Resource name="privates/siteMenu" list={SiteMenuList} edit={SiteMenuEdit} create={SiteMenuCreate} options={{ label: '메뉴 관리', menuGroup: 'menus', menuGroupLabel: '사이트', icon: <Article /> }} />
			<Resource name="privates/posts" list={PostList} edit={PostEdit} options={{ label: '게시판 관리', menuGroup: 'posts', menuGroupLabel: '게시판', icon: <Article /> }} /> */}

				</Admin>
			)}
		</BrowserRouter>
		</ThemeContext.Provider>
	);
};

export default AdminApp;