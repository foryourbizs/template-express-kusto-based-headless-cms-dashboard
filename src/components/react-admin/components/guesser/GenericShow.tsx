"use client";

import React from 'react';
import {
    Show,
    SimpleShowLayout,
    TabbedShowLayout,
    Tab,
    TextField,
    DateField,
    BooleanField,
    ReferenceField,
    ChipField,
    useRecordContext,
    TopToolbar,
    ListButton,
    EditButton,
    DeleteButton,
} from 'react-admin';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Avatar,
    Paper,
    Divider,
} from '@mui/material';

// 필드 타입 정의
export interface ShowField {
    source: string;
    label: string;
    type: 'text' | 'date' | 'boolean' | 'reference' | 'chip' | 'custom' | 'json';
    reference?: string;
    referenceSource?: string;
    render?: (value: any, record: any) => React.ReactNode;
    section?: string;
    hideOnMobile?: boolean;
    width?: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

// 섹션 정의
export interface ShowSection {
    title: string;
    icon?: React.ReactElement; // ReactNode -> ReactElement로 변경
    fields: ShowField[];
    columns?: number; // 그리드 컬럼 수 (기본값: 2)
}

// GenericShow Props
export interface GenericShowProps {
    title?: string;
    sections: ShowSection[];
    headerComponent?: React.ComponentType;
    enableEdit?: boolean;
    enableDelete?: boolean;
    customActions?: React.ComponentType[];
    useTabs?: boolean; // 탭 레이아웃 사용 여부
    queryOptions?: {
        meta?: {
            include?: string[];
            [key: string]: any;
        };
        [key: string]: any;
    };
}

// 필드 렌더링 컴포넌트
const FieldRenderer: React.FC<{ field: ShowField }> = ({ field }) => {
    const record = useRecordContext();
    
    if (!record) {
        return (
            <Box sx={{ width: field.width || 'auto' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {field.label}
                </Typography>
                <Typography variant="body2" color="text.disabled">
                    로딩 중...
                </Typography>
            </Box>
        );
    }

    const renderField = () => {
        switch (field.type) {
            case 'date':
                return (
                    <DateField 
                        source={field.source} 
                        showTime 
                        options={{
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                        }}
                    />
                );
            case 'boolean':
                return <BooleanField source={field.source} />;
            case 'reference':
                return (
                    <ReferenceField source={field.source} reference={field.reference!}>
                        <TextField source={field.referenceSource || 'name'} />
                    </ReferenceField>
                );
            case 'chip':
                return (
                    <ChipField 
                        source={field.source} 
                        color={field.color}
                        variant="outlined"
                    />
                );
            case 'json':
                return (
                    <Paper 
                        elevation={1} 
                        sx={{ 
                            p: 2, 
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                            maxHeight: 200, 
                            overflow: 'auto',
                            border: (theme) => `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Typography
                            component="pre"
                            variant="body2"
                            sx={{
                                fontSize: '0.875rem',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                color: (theme) => theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                            }}
                        >
                            {record[field.source] ? JSON.stringify(record[field.source], null, 2) : '데이터 없음'}
                        </Typography>
                    </Paper>
                );
            case 'custom':
                return field.render ? field.render(record[field.source], record) : null;
            default:
                return <TextField source={field.source} />;
        }
    };

    return (
        <Box sx={{ width: field.width || 'auto' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                {field.label}
            </Typography>
            {renderField()}
        </Box>
    );
};

// 섹션 렌더링 컴포넌트
const SectionRenderer: React.FC<{ section: ShowSection }> = ({ section }) => {
    const columns = section.columns || 2;
    
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {section.icon}
                    {section.title}
                </Typography>
                <Box 
                    sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: `repeat(${columns}, 1fr)`, 
                        gap: 2,
                        '@media (max-width: 768px)': {
                            gridTemplateColumns: '1fr'
                        }
                    }}
                >
                    {section.fields.map((field, index) => (
                        <FieldRenderer key={`${field.source}-${index}`} field={field} />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

// 상단 액션 툴바
const ShowActions: React.FC<{ enableEdit?: boolean; enableDelete?: boolean; customActions?: React.ComponentType[] }> = ({ 
    enableEdit = true, 
    enableDelete = false,
    customActions = []
}) => (
    <TopToolbar>
        <ListButton />
        {enableEdit && <EditButton />}
        {enableDelete && <DeleteButton />}
        {customActions.map((ActionComponent, index) => (
            <ActionComponent key={index} />
        ))}
    </TopToolbar>
);

// 메인 GenericShow 컴포넌트
export const GenericShow: React.FC<GenericShowProps> = ({
    title,
    sections,
    headerComponent: HeaderComponent,
    enableEdit = true,
    enableDelete = false,
    customActions = [],
    useTabs = false,
    queryOptions,
}) => {
    // 탭 레이아웃 사용
    if (useTabs) {
        return (
            <Show 
                actions={<ShowActions enableEdit={enableEdit} enableDelete={enableDelete} customActions={customActions} />} 
                title={title}
                queryOptions={queryOptions}
            >
                {HeaderComponent && <HeaderComponent />}
                <TabbedShowLayout>
                    {sections.map((section, index) => (
                        <Tab key={`${section.title}-${index}`} label={section.title} icon={section.icon}>
                            <Box 
                                sx={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: `repeat(${section.columns || 2}, 1fr)`, 
                                    gap: 2,
                                    '@media (max-width: 768px)': {
                                        gridTemplateColumns: '1fr'
                                    }
                                }}
                            >
                                {section.fields.map((field, fieldIndex) => (
                                    <FieldRenderer key={`${field.source}-${fieldIndex}`} field={field} />
                                ))}
                            </Box>
                        </Tab>
                    ))}
                </TabbedShowLayout>
            </Show>
        );
    }

    // 기본 카드 레이아웃
    return (
        <Show 
            actions={<ShowActions enableEdit={enableEdit} enableDelete={enableDelete} customActions={customActions} />} 
            title={title}
            queryOptions={queryOptions}
        >
            <Box sx={{ width: '100%', maxWidth: 1200 }}>
                {/* 헤더 컴포넌트 */}
                {HeaderComponent && <HeaderComponent />}
                
                {/* 섹션들 */}
                {sections.map((section, index) => (
                    <SectionRenderer key={`${section.title}-${index}`} section={section} />
                ))}
            </Box>
        </Show>
    );
};

export default GenericShow;
