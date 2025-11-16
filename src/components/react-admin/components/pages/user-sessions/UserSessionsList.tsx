"use client";

import {
	TextField,
	DateField,
	BooleanField,
	FunctionField,
	TextInput,
	NullableBooleanInput,
	DateInput,
	useRecordContext,
} from 'react-admin';
import { Chip, Box, Typography, useTheme, alpha } from '@mui/material';
import { GenericList } from '../../guesser';

/**
 * 세션 상태 표시 컴포넌트
 */
const SessionStatusField = () => {
	const record = useRecordContext();
	if (!record) return null;

	const isActive = record.attributes?.active;
	const expiresAt = record.attributes?.expiresAt;
	const isExpired = expiresAt && new Date(expiresAt) < new Date();

	const getStatusConfig = () => {
		if (!isActive) {
			return { label: '비활성', color: 'default' as const };
		}
		if (isExpired) {
			return { label: '만료됨', color: 'error' as const };
		}
		return { label: '활성', color: 'success' as const };
	};

	const config = getStatusConfig();

	return <Chip label={config.label} color={config.color} size="small" />;
};

/**
 * IP 주소 표시 컴포넌트 (복사 가능)
 */
const IpAddressField = () => {
	const record = useRecordContext();
	const theme = useTheme();
	
	console.log(record.ipAddress)

	if (!record || !record?.ipAddress) return <Typography variant="body2">-</Typography>;

	const ip = record.ipAddress;

	return (
		<Box
			sx={{
				fontFamily: 'monospace',
				fontSize: '13px',
				cursor: 'pointer',
				padding: '4px 8px',
				borderRadius: '4px',
				display: 'inline-block',
				backgroundColor: alpha(theme.palette.primary.main, 0.08),
				color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
				transition: 'all 0.2s ease',
				'&:hover': {
					backgroundColor: alpha(theme.palette.primary.main, 0.15),
					transform: 'translateY(-1px)',
					boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
				},
			}}
			onClick={(e) => {
				e.stopPropagation();
				navigator.clipboard.writeText(ip);
			}}
			title="클릭하여 복사"
		>
			{ip}
		</Box>
	);
};

/**
 * 만료 시간 표시 (남은 시간 포함)
 */
const ExpiresAtField = () => {
	const record = useRecordContext();
	const theme = useTheme();

	if (!record || !record?.expiresAt) return <Typography variant="body2">-</Typography>;

	const expiresAtValue = record.expiresAt;
	const expiresAt = new Date(expiresAtValue);
	const now = new Date();
	const diff = expiresAt.getTime() - now.getTime();
	const isExpired = diff < 0;

	const formatTimeRemaining = (ms: number) => {
		const absDiff = Math.abs(ms);
		const hours = Math.floor(absDiff / (1000 * 60 * 60));
		const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

		if (hours > 24) {
			const days = Math.floor(hours / 24);
			return `${days}일 ${hours % 24}시간`;
		}
		if (hours > 0) {
			return `${hours}시간 ${minutes}분`;
		}
		return `${minutes}분`;
	};

	return (
		<Box>
			<Typography
				variant="body2"
				sx={{
					color: theme.palette.mode === 'dark'
						? theme.palette.text.primary
						: theme.palette.text.secondary,
				}}
			>
				{expiresAt.toLocaleString('ko-KR')}
			</Typography>
			<Typography
				variant="caption"
				sx={{
					fontSize: '11px',
					display: 'inline-block',
					padding: '2px 6px',
					borderRadius: '3px',
					marginTop: '4px',
					backgroundColor: isExpired
						? alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.2 : 0.1)
						: alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.2 : 0.1),
					color: isExpired
						? theme.palette.error.main
						: theme.palette.success.main,
					fontWeight: 500,
				}}
			>
				{isExpired ? '만료됨' : `${formatTimeRemaining(diff)} 남음`}
			</Typography>
		</Box>
	);
};

/**
 * 세션 필터 정의
 */
const sessionFilters = [
	<TextInput
		key="search"
		source="q"
		label="검색"
		placeholder="IP 주소 또는 사용자 ID"
		alwaysOn
		sx={{ minWidth: 250 }}
	/>,
	<TextInput
		key="userId"
		source="userId"
		label="사용자 ID"
		sx={{ minWidth: 150 }}
	/>,
	<TextInput
		key="ipAddress"
		source="ipAddress"
		label="IP 주소"
		sx={{ minWidth: 180 }}
	/>,
	<NullableBooleanInput
		key="active"
		source="active"
		label="활성 상태"
		sx={{ minWidth: 120 }}
	/>,
	<DateInput
		key="createdAtStart"
		source="createdAt_gte"
		label="생성일 (시작)"
		sx={{ minWidth: 150 }}
	/>,
	<DateInput
		key="createdAtEnd"
		source="createdAt_lte"
		label="생성일 (종료)"
		sx={{ minWidth: 150 }}
	/>,
	<DateInput
		key="expiresAtStart"
		source="expiresAt_gte"
		label="만료일 (시작)"
		sx={{ minWidth: 150 }}
	/>,
	<DateInput
		key="expiresAtEnd"
		source="expiresAt_lte"
		label="만료일 (종료)"
		sx={{ minWidth: 150 }}
	/>,
];

/**
 * 세션 목록 컬럼 정의
 */
const sessionColumns = [
	<TextField
		source="id"
		label="세션 ID"
		key="id"
		sx={{ fontFamily: 'monospace', fontSize: '13px' }}
	/>,
	<TextField
		source="user.id"
		label="사용자 ID"
		key="userId"
	/>,
	<FunctionField
		label="IP 주소"
		render={() => <IpAddressField />}
		key="ipAddress"
	/>,
	<FunctionField
		label="상태"
		render={() => <SessionStatusField />}
		key="status"
	/>,
	<DateField
		source="createdAt"
		label="생성일시"
		showTime
		key="createdAt"
	/>,
	<FunctionField
		label="만료일시"
		render={() => <ExpiresAtField />}
		key="expiresAt"
	/>,
];

/**
 * 사용자 세션 목록 컴포넌트
 * 
 * GenericList를 사용하여 구현
 * - 활성/만료/비활성 상태 시각화
 * - IP 주소 클릭으로 복사 기능
 * - 만료 시간 및 남은 시간 표시
 * - 다양한 필터 옵션
 * - 다크모드 완벽 지원
 */
export const UserSessionsList = () => {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	return (
		<GenericList
			columns={sessionColumns}
			filters={sessionFilters}
			filterDefaultValues={{ active: true }}
			defaultSort={{ field: 'createdAt', order: 'DESC' }}
			perPage={25}
			rowClick="show"
			enableBulkActions={false}
			queryOptions={{
				meta: {
					include: ['user']
				}
			}}
			datagridProps={{
				rowStyle: (record) => {
					const isActive = record.attributes?.active;
					const expiresAt = record.attributes?.expiresAt;
					const isExpired = expiresAt && new Date(expiresAt) < new Date();

					if (!isActive) {
						return {
							backgroundColor: isDark
								? alpha(theme.palette.background.paper, 0.3)
								: alpha(theme.palette.grey[500], 0.15),
							opacity: isDark ? 0.5 : 0.7,
						};
					}
					if (isExpired) {
						return {
							backgroundColor: isDark
								? alpha(theme.palette.error.main, 0.15)
								: alpha(theme.palette.error.main, 0.08),
							borderLeft: `3px solid ${theme.palette.error.main}`,
						};
					}
					return {
						'&:hover': {
							backgroundColor: isDark
								? alpha(theme.palette.primary.main, 0.08)
								: alpha(theme.palette.primary.main, 0.04),
						},
					};
				},
			}}
			datagridSx={{
				'& .RaDatagrid-headerCell': {
					backgroundColor: isDark
						? alpha(theme.palette.background.paper, 0.6)
						: alpha(theme.palette.grey[100], 0.8),
					borderBottom: `2px solid ${isDark ? theme.palette.divider : theme.palette.grey[300]}`,
					fontWeight: 700,
				},
				'& .RaDatagrid-rowCell': {
					borderBottom: `1px solid ${alpha(theme.palette.divider, isDark ? 0.3 : 0.5)}`,
				},
				'& .RaDatagrid-row:hover': {
					boxShadow: isDark
						? `0 2px 8px ${alpha(theme.palette.common.black, 0.4)}`
						: `0 2px 8px ${alpha(theme.palette.grey[400], 0.3)}`,
				},
			}}
		/>
	);
};
