"use client";

import { TextField, DateField, NumberField, BooleanField, ImageField } from 'react-admin';
import { GenericList } from '../../guesser/GenericList';

export const PostList = () => {
  return (
    <GenericList
      queryOptions={{
        meta: {
          include: ['author', 'parent', 'children', 'comments']
        }

      }}
      columns={[

        <TextField key="id" source="id" label="ID" />,
        <ImageField key="featuredImage" source="featuredImage" label="대표 이미지" />,
        <TextField key="title" source="title" label="타이틀" />,

        <TextField key="postType" source="postType" label="타입" />,
        <TextField key="postStatus" source="postStatus" label="상태" />,

        <BooleanField key="commentStatus" source="commentStatus" label="댓글 허용 여부" />,

        <DateField key="publishedAt" source="publishedAt" label="공개 일자" showTime />,
        <DateField key="createdAt" source="createdAt" label="등록일" showTime />,



      ]}
      defaultSort={{ field: 'createdAt', order: 'DESC' }}
      rowClick="show"
      actions={false}
      perPage={50}
    />
  );
};
