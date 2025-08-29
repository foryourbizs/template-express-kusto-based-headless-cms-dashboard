import React from 'react';
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Box,
	Avatar,
	Menu,
	MenuItem,
	Badge,
	useTheme,
	alpha,
} from '@mui/material';
import {
	Menu as MenuIcon,
	Notifications as NotificationsIcon,
	AccountCircle,
	Logout,
	Settings,
	Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuthProvider, useLogout, useGetIdentity, useNotify } from 'react-admin';
import { refreshTokens, getTokenTimeRemaining } from '../../lib/authProvider';

interface HeaderProps {
	onMenuClick: () => void;
	isMobile: boolean;
}

/**
 * 헤더 컴포넌트
 * 메뉴 버튼, 타이틀, 사용자 메뉴 등을 포함
 */
export const Header: React.FC<HeaderProps> = ({ onMenuClick, isMobile }) => {
	const theme = useTheme();
	const logout = useLogout();
	const notify = useNotify();
	const { data: identity } = useGetIdentity();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [tokenInfo, setTokenInfo] = React.useState(getTokenTimeRemaining());
	const [isRefreshing, setIsRefreshing] = React.useState(false);

	// 토큰 만료시간 실시간 업데이트
	React.useEffect(() => {
		const interval = setInterval(() => {
			setTokenInfo(getTokenTimeRemaining());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// 토큰 갱신 함수
	const handleRefreshToken = async () => {
		setIsRefreshing(true);
		try {
			const result = await refreshTokens();
			if (result.success) {
				notify('토큰이 성공적으로 갱신되었습니다.', { type: 'success' });
				setTokenInfo(getTokenTimeRemaining());
			} else {
				notify(result.error || '토큰 갱신에 실패했습니다.', { type: 'error' });
				if (result.error?.includes('다시 로그인')) {
					logout();
				}
			}
		} catch (error) {
			notify('토큰 갱신 중 오류가 발생했습니다.', { type: 'error' });
		} finally {
			setIsRefreshing(false);
		}
	};

	// 시간을 사람이 읽기 쉬운 형태로 변환 (초단위까지 표시)
	const formatTimeRemaining = (milliseconds: number): string => {
		if (milliseconds <= 0) return '만료됨';
		
		const totalSeconds = Math.floor(milliseconds / 1000);
		const days = Math.floor(totalSeconds / (24 * 60 * 60));
		const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
		const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
		const seconds = totalSeconds % 60;

		if (days > 0) return `${days}일 ${hours}시간`;
		if (hours > 0) return `${hours}시간 ${minutes}분`;
		if (minutes > 0) return `${minutes}분 ${seconds}초`;
		return `${seconds}초`;
	};

	// 모바일용 간결한 시간 표시
	const formatTimeRemainingMobile = (milliseconds: number): string => {
		if (milliseconds <= 0) return '만료';
		
		const totalSeconds = Math.floor(milliseconds / 1000);
		const days = Math.floor(totalSeconds / (24 * 60 * 60));
		const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
		const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
		const seconds = totalSeconds % 60;

		if (days > 0) return `${days}d`;
		if (hours > 0) return `${hours}h`;
		if (minutes > 0) return `${minutes}m`;
		return `${seconds}s`;
	};

	const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleUserMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		handleUserMenuClose();
		logout();
	};

	return (
		<AppBar
			position="fixed"
			sx={{
				zIndex: theme.zIndex.drawer + 1,
				backgroundColor: theme.palette.background.paper,
				borderBottom: `1px solid ${theme.palette.divider}`,
			}}
		>
			<Toolbar>
				{/* 메뉴 버튼 */}
				<IconButton
					edge="start"
					color="inherit"
					aria-label="menu"
					onClick={onMenuClick}
					sx={{ mr: 2 }}
				>
					<MenuIcon />
				</IconButton>

				{/* 타이틀 */}
				<Typography
					variant="h6"
					component="div"
					sx={{
						flexGrow: 1,
						color: theme.palette.text.primary,
						fontWeight: 600,
					}}
				>
					관리자 대시보드
				</Typography>

				{/* 오른쪽 액션들 */}
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					{/* 토큰 표시 및 갱신 버튼 통합 UI */}
					<Box sx={{ 
						display: 'flex', 
						alignItems: 'center', 
						gap: 0,
						borderRadius: 2,
						border: `1px solid ${theme.palette.divider}`,
						overflow: 'hidden',
						backgroundColor: alpha(theme.palette.background.paper, 0.8),
						transition: 'all 0.2s ease-in-out',
						'&:hover': {
							borderColor: theme.palette.primary.main,
							boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`,
						}
					}}>
						{/* 토큰 만료시간 표시 부분 */}
						<Box sx={{
							display: 'flex',
							alignItems: 'center',
							gap: { xs: 0.5, md: 1 },
							px: { xs: 1, md: 1.5 },
							py: 0.75,
							backgroundColor: tokenInfo.accessToken.expired 
								? alpha(theme.palette.error.main, 0.1)
								: tokenInfo.accessToken.remaining < 5 * 60 * 1000 // 5분 미만
									? alpha(theme.palette.warning.main, 0.1)
									: alpha(theme.palette.success.main, 0.1),
							transition: 'all 0.2s ease-in-out',
						}}>
							<Box sx={{
								width: { xs: 6, md: 8 },
								height: { xs: 6, md: 8 },
								borderRadius: '50%',
								backgroundColor: tokenInfo.accessToken.expired 
									? theme.palette.error.main
									: tokenInfo.accessToken.remaining < 5 * 60 * 1000
										? theme.palette.warning.main
										: theme.palette.success.main,
								animation: tokenInfo.accessToken.remaining < 60 * 1000 ? 'pulse 1s infinite' : 'none',
								'@keyframes pulse': {
									'0%': { opacity: 1 },
									'50%': { opacity: 0.5 },
									'100%': { opacity: 1 },
								},
							}} />
							<Typography 
								variant="body2" 
								sx={{ 
									fontWeight: 500,
									color: tokenInfo.accessToken.expired 
										? theme.palette.error.main
										: tokenInfo.accessToken.remaining < 5 * 60 * 1000
											? theme.palette.warning.main
											: theme.palette.success.main,
									fontFamily: 'monospace',
									fontSize: { xs: '0.75rem', md: '0.875rem' },
									minWidth: { xs: '35px', md: '80px' },
									textAlign: 'center'
								}}
							>
								{/* 모바일과 데스크톱에서 다른 표시 형식 */}
								<Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
									{formatTimeRemaining(tokenInfo.accessToken.remaining)}
								</Box>
								<Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
									{formatTimeRemainingMobile(tokenInfo.accessToken.remaining)}
								</Box>
							</Typography>
						</Box>

						{/* 구분선 */}
						<Box sx={{
							width: 1,
							height: { xs: 28, md: 32 },
							backgroundColor: theme.palette.divider,
						}} />

						{/* 토큰 갱신 버튼 부분 */}
						<IconButton
							onClick={handleRefreshToken}
							disabled={isRefreshing || tokenInfo.refreshToken.expired}
							size="small"
							title={isRefreshing ? "토큰 갱신 중..." : "토큰 갱신"}
							sx={{
								width: { xs: 32, md: 40 },
								height: { xs: 32, md: 40 },
								borderRadius: 0,
								backgroundColor: 'transparent',
								color: theme.palette.primary.main,
								transition: 'all 0.2s ease-in-out',
								'&:hover': {
									backgroundColor: alpha(theme.palette.primary.main, 0.1),
								},
								'&:disabled': {
									backgroundColor: 'transparent',
									color: theme.palette.action.disabled,
								},
							}}
						>
							<RefreshIcon sx={{ 
								fontSize: { xs: 16, md: 18 },
								animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
								'@keyframes spin': {
									'0%': {
										transform: 'rotate(0deg)',
									},
									'100%': {
										transform: 'rotate(360deg)',
									},
								},
							}} />
						</IconButton>
					</Box>
					{/* 알림 */}
					{/* <IconButton color="inherit">
						<Badge badgeContent={3} color="error">
							<NotificationsIcon />
						</Badge>
					</IconButton> */}

					{/* 사용자 메뉴 */}
					<IconButton
						onClick={handleUserMenuOpen}
						color="inherit"
						sx={{ p: 0 }}
					>
						<Avatar
							sx={{
								width: 32,
								height: 32,
								bgcolor: theme.palette.primary.main,
							}}
						>
							{identity?.fullName?.[0] || 'A'}
						</Avatar>
					</IconButton>

					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleUserMenuClose}
						onClick={handleUserMenuClose}
						PaperProps={{
							elevation: 0,
							sx: {
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
								mt: 1.5,
								'& .MuiAvatar-root': {
									width: 24,
									height: 24,
									ml: -0.5,
									mr: 1,
								},
								'&:before': {
									content: '""',
									display: 'block',
									position: 'absolute',
									top: 0,
									right: 14,
									width: 10,
									height: 10,
									bgcolor: 'background.paper',
									transform: 'translateY(-50%) rotate(45deg)',
									zIndex: 0,
								},
							},
						}}
						transformOrigin={{ horizontal: 'right', vertical: 'top' }}
						anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
					>
						{/* <MenuItem onClick={handleUserMenuClose}>
							<AccountCircle sx={{ mr: 1 }} />
							프로필
						</MenuItem>
						<MenuItem onClick={handleUserMenuClose}>
							<Settings sx={{ mr: 1 }} />
							설정
						</MenuItem> */}
						<MenuItem onClick={handleLogout}>
							<Logout sx={{ mr: 1 }} />
							로그아웃
						</MenuItem>
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	);
};
