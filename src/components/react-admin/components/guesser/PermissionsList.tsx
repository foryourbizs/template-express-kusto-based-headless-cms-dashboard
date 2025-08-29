import React from 'react';
import ListGuesser from './ListGuesser';


// 권한 리스트 컴포넌트 - BulkDeleteButton 활성화
export const PermissionsListWithDelete = (props: any) => {
  return (
    <ListGuesser
      {...props}
      hasBulkDelete={true}  // BulkDeleteButton 활성화
      hasDelete={true}      // 개별 Delete 버튼도 활성화
      hasEdit={true}        // Edit 버튼 활성화
      hasShow={true}        // Show 버튼 활성화
      hasCreate={true}      // Create 버튼 활성화
    />
  );
};
