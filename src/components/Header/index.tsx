import { Component, JSX, children as ch } from 'solid-js';
import './style.css';

interface HeaderProps {
  className?: string;
  children: JSX.Element;
}

export const Header: Component<HeaderProps> = (props) => {
  const { children, className } = props;
  const c = ch(() => children);
  return <div class={className}>{c()}</div>;
};
