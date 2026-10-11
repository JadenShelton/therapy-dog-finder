import React from 'react';
import { MessageView, type MessageViewProps } from './EmptyView';

export function ErrorView(props: MessageViewProps) {
  return <MessageView {...props} role="alert" />;
}
