"use client";

import { GenericShow, ShowSection } from '../../guesser/GenericShow';
import {
	InfoOutlined,
	StorageOutlined,
	SecurityOutlined,
	FingerprintOutlined,
	PersonOutlined,
	HistoryOutlined
} from '@mui/icons-material';
import { Typography, Chip, Box, Link } from '@mui/material';

export const FilesShow = () => {
	// 파일 크기를 읽기 쉬운 형식으로 변환
	const formatFileSize = (bytes: number) => {
		if (!bytes) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
	};

	const sections: ShowSection[] = [
		{
			title: '기본 정보',
			icon: <InfoOutlined />,
			columns: 2,
			fields: [
				{ source: 'id', label: 'ID', type: 'text' },
				{ source: 'uuid', label: 'UUID', type: 'text' },
				{ source: 'filename', label: '파일명', type: 'text' },
				{ source: 'originalName', label: '원본 파일명', type: 'text' },
				{ source: 'mimeType', label: 'MIME 타입', type: 'text' },
				{
					source: 'extension', label: '확장자', type: 'custom', render: (value) => (
						value ? <Chip label={value.toUpperCase()} size="small" color="primary" variant="outlined" /> : '-'
					)
				},
				{
					source: 'fileSize', label: '파일 크기', type: 'custom', render: (value) => (
						<Box>
							<Typography variant="body2">{formatFileSize(value)}</Typography>
							<Typography variant="caption" color="text.secondary">({value?.toLocaleString()} bytes)</Typography>
						</Box>
					)
				},
			],
		},
		{
			title: '스토리지 정보',
			icon: <StorageOutlined />,
			columns: 2,
			fields: [
				{ source: 'storageUuid', label: '스토리지 UUID', type: 'text' },
				{
					source: 'filePath', label: '파일 경로', type: 'custom', render: (value) => (
						<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
							{value || '-'}
						</Typography>
					)
				},
				{
					source: 'exists', label: '파일 존재 여부', type: 'custom', render: (value) => (
						<Chip
							label={value ? '존재함' : '존재하지 않음'}
							color={value ? 'success' : 'error'}
							size="small"
						/>
					)
				},
				{
					source: 'isPublic', label: '공개 여부', type: 'custom', render: (value) => (
						<Chip
							label={value ? '공개' : '비공개'}
							color={value ? 'info' : 'default'}
							size="small"
						/>
					)
				},
				{
					source: 'isArchived', label: '아카이브 상태', type: 'custom', render: (value) => (
						value ? <Chip label="아카이브됨" color="warning" size="small" /> :
							<Chip label="활성" color="success" size="small" variant="outlined" />
					)
				},
			],
		},
		{
			title: '보안 및 검증',
			icon: <SecurityOutlined />,
			columns: 2,
			fields: [
				{
					source: 'md5Hash', label: 'MD5 해시', type: 'custom', render: (value) => (
						<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>
							{value || '-'}
						</Typography>
					)
				},
				{
					source: 'sha256Hash', label: 'SHA256 해시', type: 'custom', render: (value) => (
						<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>
							{value || '-'}
						</Typography>
					)
				},
			],
		},
		{
			title: '접근 제어',
			icon: <FingerprintOutlined />,
			columns: 2,
			fields: [
				{ source: 'accessPermissionUuid', label: '접근 권한 UUID', type: 'text' },
				{ source: 'expiresAt', label: '만료 시간', type: 'date' },
			],
		},
		{
			title: '업로드 정보',
			icon: <PersonOutlined />,
			columns: 2,
			fields: [
				{ source: 'uploadedBy', label: '업로드한 사용자 UUID', type: 'text' },
				{
					source: 'uploadSource', label: '업로드 소스', type: 'custom', render: (value) => (
						value ? <Chip label={value} size="small" color="secondary" variant="outlined" /> : '-'
					)
				},
			],
		},
		{
			title: '메타데이터',
			icon: <InfoOutlined />,
			columns: 1,
			fields: [
				{ source: 'metadata', label: '추가 메타데이터', type: 'json' },
			],
		},
		{
			title: '감사 추적',
			icon: <HistoryOutlined />,
			columns: 2,
			fields: [
				{ source: 'createdAt', label: '생성일시', type: 'date' },
				{ source: 'updatedAt', label: '수정일시', type: 'date' },
				{ source: 'deletedAt', label: '삭제일시', type: 'date' },
			],
		},
	];

	return (
		<GenericShow
			sections={sections}
			enableEdit={true}
			enableDelete={true}
			useTabs={true}
			queryOptions={{
				meta: {
					include: ['storage', 'uploader', 'accessPermission']
				}
			}}
		/>
	);
};
