import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    ReferenceField,
    FunctionField,
    SearchInput,
    TextInput,
    DateInput,
    BooleanField,
    ChipField,
    useRecordContext
} from 'react-admin';
import { Card, CardContent, Box, Chip } from '@mui/material';

const auditFilters = [
    <SearchInput source="q" alwaysOn placeholder="검색..." />,
    <TextInput source="action_filter" label="액션" placeholder="액션 검색..." />,
    <TextInput source="resource_filter" label="리소스" placeholder="리소스 검색..." />,
    <DateInput source="createdAt_gte" label="시작일" />,
    <DateInput source="createdAt_lte" label="종료일" />,
];

const ActionChip = () => {
    const record = useRecordContext();
    if (!record || !record.action) return null;
    
    const getActionColor = (action: string) => {
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes('create') || lowerAction.includes('생성') || lowerAction.includes('add') || lowerAction.includes('insert')) {
            return 'success';
        }
        if (lowerAction.includes('update') || lowerAction.includes('수정') || lowerAction.includes('edit') || lowerAction.includes('modify')) {
            return 'primary';
        }
        if (lowerAction.includes('delete') || lowerAction.includes('삭제') || lowerAction.includes('remove')) {
            return 'error';
        }
        if (lowerAction.includes('login') || lowerAction.includes('로그인') || lowerAction.includes('signin')) {
            return 'info';
        }
        if (lowerAction.includes('logout') || lowerAction.includes('로그아웃') || lowerAction.includes('signout')) {
            return 'default';
        }
        return 'secondary';
    };

    return (
        <Chip 
            label={record.action} 
            color={getActionColor(record.action)} 
            size="small" 
        />
    );
};

const ResourceChip = () => {
    const record = useRecordContext();
    if (!record || !record.resource) return null;
    
    return (
        <Chip 
            label={record.resource} 
            variant="outlined" 
            size="small" 
        />
    );
};

export const UserAuditsList = () => (
    <List
        filters={auditFilters}
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={25}
        title="사용자 감사 로그"
    >
        <Datagrid
            bulkActionButtons={false}
            rowClick={false}
        >
            <TextField source="id" label="ID" />
            <ReferenceField 
                source="userUuid" 
                reference="privates/users" 
                label="사용자"
                link={false}
            >
                <TextField source="username" />
            </ReferenceField>
            <FunctionField 
                label="액션" 
                render={() => <ActionChip />} 
            />
            <FunctionField 
                label="리소스" 
                render={() => <ResourceChip />} 
            />
            <TextField source="resourceId" label="리소스 ID" />
            <TextField source="ipAddress" label="IP 주소" />
            <TextField source="userAgent" label="사용자 에이전트" />
            <FunctionField
                label="변경 사항"
                render={(record: any) => (
                    <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {record.changes ? (
                            <pre style={{ 
                                fontSize: '0.75rem', 
                                margin: 0, 
                                whiteSpace: 'pre-wrap',
                                maxHeight: '60px',
                                overflow: 'hidden'
                            }}>
                                {JSON.stringify(record.changes, null, 2)}
                            </pre>
                        ) : (
                            '-'
                        )}
                    </Box>
                )}
            />
            <DateField 
                source="createdAt" 
                label="생성일시" 
                showTime 
                locales="ko-KR"
            />
        </Datagrid>
    </List>
);

export default UserAuditsList;