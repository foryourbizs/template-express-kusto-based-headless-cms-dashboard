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
import { useLogout, useGetIdentity, useNotify } from 'react-admin';
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

	// 시간을 간결하게 변환
	const formatTimeRemaining = (milliseconds: number): string => {
		if (milliseconds <= 0) return '0초';
		
		const totalSeconds = Math.floor(milliseconds / 1000);
		const totalMinutes = Math.floor(totalSeconds / 60);
		const totalHours = Math.floor(totalMinutes / 60);
		const totalDays = Math.floor(totalHours / 24);
		const totalMonths = Math.floor(totalDays / 30);
		
		// 12개월 이상 = 년 단위
		if (totalMonths >= 12) {
			const years = Math.floor(totalMonths / 12);
			return `${years}년`;
		}
		// 1개월 이상 = 개월, 일 단위
		else if (totalMonths >= 1) {
			const remainingDays = totalDays % 30;
			return `${totalMonths}개월 ${remainingDays}일`;
		}
		// 1일 이상 = 일, 시 단위
		else if (totalDays >= 1) {
			const remainingHours = totalHours % 24;
			return `${totalDays}일 ${remainingHours}시간`;
		}
		// 1시간 이상 = 시, 분 단위
		else if (totalHours >= 1) {
			const remainingMinutes = totalMinutes % 60;
			return `${totalHours}시간 ${remainingMinutes}분`;
		}
		// 1분 이상 = 분, 초 단위
		else if (totalMinutes >= 1) {
			const remainingSeconds = totalSeconds % 60;
			return `${totalMinutes}분 ${remainingSeconds}초`;
		}
		// 1분 미만 = 초 단위
		else {
			return `${totalSeconds}초`;
		}
	};

	// 토큰 만료 퍼센트 계산 (24시간 기준)
	const getTokenProgress = (): number => {
		const maxTime = 24 * 60 * 60 * 1000; // 24시간
		const remaining = tokenInfo.accessToken.remaining;
		if (remaining <= 0) return 0;
		return Math.min((remaining / maxTime) * 100, 100);
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
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					{/* 토큰 상태 표시 (시간 + 새로고침) */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							height: { xs: 44, md: 48 },
							pl: { xs: 1.75, md: 2 },
							pr: { xs: 0.75, md: 1 },
							borderRadius: 1,
							backgroundColor: alpha(theme.palette.background.paper, 0.9),
							border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
							transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
							overflow: 'hidden',
							backdropFilter: 'blur(10px)',
							boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.05)}`,
							position: 'relative',
							'&:hover': {
								borderColor: alpha(theme.palette.divider, 0.6),
								boxShadow: `0 2px 6px ${alpha(theme.palette.common.black, 0.08)}`,
							},
							'&::after': {
								content: '""',
								position: 'absolute',
								left: 0,
								bottom: 0,
								height: '3px',
								width: `${getTokenProgress()}%`,
								background: `linear-gradient(90deg, 
									${tokenInfo.accessToken.expired 
										? theme.palette.error.main
										: tokenInfo.accessToken.remaining < 5 * 60 * 1000
											? theme.palette.warning.main
											: theme.palette.success.main
									} 0%,
									${alpha(tokenInfo.accessToken.expired 
										? theme.palette.error.main
										: tokenInfo.accessToken.remaining < 5 * 60 * 1000
											? theme.palette.warning.main
											: theme.palette.success.main, 0.6
									)} 100%
								)`,
								transition: 'width 1s ease-out',
								borderRadius: '0 0 0 6px',
							},
						}}
					>
						{/* 상태 도트 + 시간 */}
						<Box sx={{ 
							display: 'flex', 
							alignItems: 'center', 
							gap: 1,
							zIndex: 1,
						}}>
							<Box
								sx={{
									width: { xs: 6, md: 7 },
									height: { xs: 6, md: 7 },
									borderRadius: '50%',
									backgroundColor: tokenInfo.accessToken.expired 
										? theme.palette.error.main
										: tokenInfo.accessToken.remaining < 5 * 60 * 1000
											? theme.palette.warning.main
											: theme.palette.success.main,
									flexShrink: 0,
									boxShadow: `0 0 ${tokenInfo.accessToken.remaining < 60 * 1000 ? '6px' : '3px'} ${
										alpha(tokenInfo.accessToken.expired 
											? theme.palette.error.main
											: tokenInfo.accessToken.remaining < 5 * 60 * 1000
												? theme.palette.warning.main
												: theme.palette.success.main, 0.5)
									}`,
									animation: tokenInfo.accessToken.remaining < 60 * 1000 ? 'pulse 2s ease-in-out infinite' : 'none',
									'@keyframes pulse': {
										'0%, 100%': { opacity: 1, transform: 'scale(1)' },
										'50%': { opacity: 0.6, transform: 'scale(0.85)' },
									},
								}}
							/>
							
							<Typography
								variant="body2"
								sx={{
									fontFamily: 'system-ui, -apple-system, sans-serif',
									fontWeight: 600,
									fontSize: { xs: '0.8125rem', md: '0.875rem' },
									color: theme.palette.text.primary,
									letterSpacing: '0.3px',
									lineHeight: 1.2,
								}}
							>
								{formatTimeRemaining(tokenInfo.accessToken.remaining)}
							</Typography>
						</Box>

						{/* 새로고침 버튼 */}
						<IconButton
							onClick={handleRefreshToken}
							disabled={isRefreshing || tokenInfo.refreshToken.expired}
							size="small"
							sx={{
								width: { xs: 32, md: 36 },
								height: { xs: 32, md: 36 },
								backgroundColor: alpha(theme.palette.primary.main, 0.08),
								color: theme.palette.primary.main,
								zIndex: 1,
								transition: 'all 0.2s ease-in-out',
								'&:hover': {
									backgroundColor: alpha(theme.palette.primary.main, 0.15),
									transform: 'rotate(90deg)',
								},
								'&:disabled': {
									opacity: 0.4,
									backgroundColor: alpha(theme.palette.action.disabled, 0.08),
								},
							}}
						>
							<RefreshIcon
								sx={{
									fontSize: { xs: 16, md: 18 },
									animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
									'@keyframes spin': {
										'0%': { transform: 'rotate(0deg)' },
										'100%': { transform: 'rotate(360deg)' },
									},
								}}
							/>
						</IconButton>
					</Box>

					{/* 사용자 프로필 */}
					<Box
						onClick={handleUserMenuOpen}
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1.25,
							height: { xs: 44, md: 48 },
							pl: { xs: 1, md: 1.25 },
							pr: { xs: 1.5, md: 1.75 },
							borderRadius: 1,
							cursor: 'pointer',
							backgroundColor: alpha(theme.palette.background.paper, 0.9),
							border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
							transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
							backdropFilter: 'blur(10px)',
							boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.05)}`,
							'&:hover': {
								backgroundColor: alpha(theme.palette.background.paper, 1),
								borderColor: alpha(theme.palette.primary.main, 0.4),
								boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.12)}`,
								transform: 'translateY(-1px)',
							},
						}}
					>
						<Avatar
							sx={{
								width: { xs: 32, md: 36 },
								height: { xs: 32, md: 36 },
								bgcolor: theme.palette.primary.main,
								fontSize: { xs: '0.9375rem', md: '1.0625rem' },
								fontWeight: 600,
								boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.25)}`,
							}}
						>
							{identity?.fullName?.[0] || ''}
						</Avatar>

						<Typography
							variant="body2"
							sx={{
								display: { xs: 'none', md: 'block' },
								fontWeight: 500,
								fontSize: '0.875rem',
								color: theme.palette.text.primary,
								maxWidth: 100,
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{identity?.fullName || '관리자'}
						</Typography>
					</Box>

					
					{/* 알림 */}
					{/* <IconButton color="inherit">
						<Badge badgeContent={3} color="error">
							<NotificationsIcon />
						</Badge>
					</IconButton> */}

					{/* 사용자 메뉴 (기존 위치에서 제거 - 위의 통합 컴포넌트로 이동됨) */}
					{/* <IconButton ... 제거됨 ... */}

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
						</MenuItem> */}


						{/* <MenuItem onClick={handleUserMenuClose}>
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

export default Header;
